
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Book, BookIcon, Lock, LogOut, User, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

type ReadingStats = {
  notStarted: number;
  inProgress: number;
  finished: number;
};

type Profile = {
  username: string | null;
  avatar_url: string | null;
};

export default function Profile() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<ReadingStats>({ notStarted: 0, inProgress: 0, finished: 0 });
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>({ username: null, avatar_url: null });
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate("/");
      return;
    }

    fetchProfile();
    fetchReadingStats();
  }, [session, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", session?.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setNewUsername(data.username || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchReadingStats = async () => {
    try {
      const { data: books, error } = await supabase
        .from("books")
        .select("status")
        .eq("user_id", session?.user.id);

      if (error) throw error;

      const stats = books.reduce(
        (acc, book) => {
          switch (book.status) {
            case "Not started":
              acc.notStarted++;
              break;
            case "In Progress":
              acc.inProgress++;
              break;
            case "Finished":
              acc.finished++;
              break;
          }
          return acc;
        },
        { notStarted: 0, inProgress: 0, finished: 0 }
      );

      setStats(stats);
    } catch (error) {
      console.error("Error fetching reading stats:", error);
    }
  };

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setIsChangePasswordOpen(false);
      setNewPassword("");
      setError(null);
      toast({
        title: "Success",
        description: "Your password has been updated.",
      });
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleUpdateProfile = async () => {
    if (!newUsername.trim()) {
      toast({
        title: "Error",
        description: "Username cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username: newUsername })
        .eq("id", session?.user.id);

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error("This username is already taken");
        }
        throw error;
      }

      setProfile(prev => ({ ...prev, username: newUsername }));
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      // First, try to delete the old avatar if it exists
      if (profile.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([oldFileName]);
        }
      }

      // Upload new image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${session?.user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', session?.user.id);

      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile picture",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4 space-y-4">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Profile</CardTitle>
          </div>
          <CardDescription>Manage your profile settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10">
                  {profile.username?.slice(0, 2).toUpperCase() || 
                   session?.user.email?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 p-1 bg-background border rounded-full cursor-pointer hover:bg-accent"
              >
                <Camera className="h-4 w-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>

            {isEditing ? (
              <div className="w-full space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex gap-2">
                  <Input
                    id="username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                  <Button 
                    onClick={handleUpdateProfile} 
                    disabled={isUpdating}
                  >
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setNewUsername(profile.username || "");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-medium text-lg">{profile.username || "Set username"}</p>
                <p className="text-sm text-muted-foreground">{session?.user.email}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="mt-2"
                >
                  Edit Username
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <BookIcon className="h-5 w-5" />
            <CardTitle>Reading Stats</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-purple-700 font-medium">Not Started</p>
            <p className="text-2xl font-bold">{stats.notStarted}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-yellow-700 font-medium">In Progress</p>
            <p className="text-2xl font-bold">{stats.inProgress}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-green-700 font-medium">Finished</p>
            <p className="text-2xl font-bold">{stats.finished}</p>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setIsChangePasswordOpen(true)}
      >
        <Lock className="mr-2 h-4 w-4" />
        Change Password
      </Button>

      <Button
        variant="destructive"
        className="w-full"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Log Out
      </Button>

      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your new password below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button onClick={handleChangePassword} className="w-full">
              Update Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
