import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Book, BookIcon, Lock, LogOut, User, Camera, AlertTriangle, Info } from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Meta } from "@/components/Meta";
import { useWelcomeTour } from "@/hooks/use-welcome-tour";

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
  const { restartTour } = useWelcomeTour();
  const [stats, setStats] = useState<ReadingStats>({ notStarted: 0, inProgress: 0, finished: 0 });
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>({ username: null, avatar_url: null });
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

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
      
      console.log("Fetched profile:", data); // Debug log
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
      setIsUpdating(true);
      console.log("Starting avatar upload..."); // Debug log

      // First, try to delete the old avatar if it exists
      if (profile.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          const { error: removeError } = await supabase.storage
            .from('avatars')
            .remove([oldFileName]);
          
          if (removeError) {
            console.error('Error removing old avatar:', removeError);
          }
        }
      }

      // Upload new image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${session?.user.id}-${Date.now()}.${fileExt}`;
      
      console.log("Uploading new avatar with filename:", fileName); // Debug log

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;
      console.log("Upload successful:", uploadData); // Debug log

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      console.log("Generated public URL:", publicUrl); // Debug log

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', session?.user.id);

      if (updateError) throw updateError;

      // Update local state immediately
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      
      // Force refresh profile data
      await fetchProfile();

      console.log("Profile updated with new avatar URL"); // Debug log

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
    } finally {
      setIsUpdating(false);
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

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== session?.user.email) {
      toast({
        title: "Error",
        description: "Please type your email correctly to confirm account deletion",
        variant: "destructive",
      });
      return;
    }

    setIsDeletingAccount(true);
    try {
      // Set a flag in localStorage to notify about account deletion after sign-out
      localStorage.setItem('account_deleted', 'true');
      
      console.log("Starting account deletion process...");
      
      // Call the delete_user RPC function 
      const { error } = await supabase.rpc('delete_user');
      
      if (error) {
        console.error("Error calling delete_user RPC:", error);
        throw error;
      }
      
      console.log("Account deletion successful, redirecting...");
      
      // If deletion was successful, we need to sign out and redirect
      // The auth system may have already signed the user out, but let's make sure
      await supabase.auth.signOut();
      
      // Navigate to home page
      navigate("/");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      setIsDeletingAccount(false);
      setIsDeleteAccountOpen(false);
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      });
      localStorage.removeItem('account_deleted');
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 pb-20">
      <Meta title="Profile" />
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
                {isUpdating ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <>
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10">
                      {profile.username?.slice(0, 2).toUpperCase() || 
                       session?.user.email?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 p-1 bg-background border rounded-full cursor-pointer hover:bg-accent disabled:cursor-not-allowed"
              >
                <Camera className="h-4 w-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUpdating}
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

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">App Preferences</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">App Tour</h3>
              <p className="text-sm text-gray-500">Restart the guided tour of the app</p>
            </div>
            <Button 
              variant="outline" 
              onClick={restartTour}
              className="flex items-center gap-2"
            >
              <Info className="h-4 w-4" />
              Start Tour
            </Button>
          </div>
        </div>
      </div>

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
      
      <div className="pt-8 border-t border-border mt-8">
        <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
        <Button
          variant="outline"
          className="w-full border-destructive text-destructive hover:bg-destructive/10"
          onClick={() => setIsDeleteAccountOpen(true)}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
      </div>

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
      
      <Dialog open={isDeleteAccountOpen} onOpenChange={setIsDeleteAccountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirm-email">
                Type <span className="font-medium">{session?.user.email}</span> to confirm
              </Label>
              <Input
                id="confirm-email"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteAccountOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount || deleteConfirmation !== session?.user.email}
              >
                {isDeletingAccount ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
