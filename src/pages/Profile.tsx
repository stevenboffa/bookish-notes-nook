import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Book, BookIcon, Lock, LogOut } from "lucide-react";
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

type ReadingStats = {
  notStarted: number;
  inProgress: number;
  finished: number;
};

export default function Profile() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<ReadingStats>({ notStarted: 0, inProgress: 0, finished: 0 });
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      navigate("/");
      return;
    }

    fetchReadingStats();
  }, [session, navigate]);

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
    } catch (error: any) {
      setError(error.message);
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
            <BookIcon className="h-5 w-5" />
            <CardTitle>Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">{session?.user.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5" />
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