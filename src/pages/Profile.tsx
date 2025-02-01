import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, LogOut, Lock, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface BookStats {
  notStarted: number;
  inProgress: number;
  finished: number;
}

export default function Profile() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<BookStats>({
    notStarted: 0,
    inProgress: 0,
    finished: 0,
  });
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate("/");
      return;
    }
    fetchStats();
  }, [session, navigate]);

  const fetchStats = async () => {
    try {
      const { data: books } = await supabase
        .from("books")
        .select("status")
        .eq("user_id", session?.user.id);

      if (books) {
        const newStats = books.reduce(
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
        setStats(newStats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
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

  const handleChangePassword = async () => {
    try {
      setIsChangingPassword(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setNewPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">{session?.user.email}</p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Reading Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-purple-100 p-4">
              <p className="text-sm text-purple-800">Not Started</p>
              <p className="text-2xl font-bold text-purple-900">
                {stats.notStarted}
              </p>
            </div>
            <div className="rounded-lg bg-yellow-100 p-4">
              <p className="text-sm text-yellow-800">In Progress</p>
              <p className="text-2xl font-bold text-yellow-900">
                {stats.inProgress}
              </p>
            </div>
            <div className="rounded-lg bg-green-100 p-4">
              <p className="text-sm text-green-800">Finished</p>
              <p className="text-2xl font-bold text-green-900">
                {stats.finished}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="lg"
            >
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button
                onClick={handleChangePassword}
                disabled={isChangingPassword || !newPassword}
                className="w-full"
              >
                {isChangingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="destructive"
          className="w-full justify-start"
          size="lg"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}