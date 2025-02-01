import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookStats {
  notStarted: number;
  inProgress: number;
  finished: number;
}

interface Book {
  id: string;
  title: string;
  is_top_favorite: number | null;
}

export default function Profile() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<BookStats>({
    notStarted: 0,
    inProgress: 0,
    finished: 0,
  });
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [topFavorites, setTopFavorites] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!session) {
      navigate("/");
      return;
    }
    fetchStats();
    fetchBooks();
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

  const fetchBooks = async () => {
    try {
      const { data } = await supabase
        .from("books")
        .select("id, title, is_top_favorite")
        .eq("user_id", session?.user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setBooks(data);
        const favorites: Record<number, string> = {};
        data.forEach((book) => {
          if (book.is_top_favorite) {
            favorites[book.is_top_favorite] = book.id;
          }
        });
        setTopFavorites(favorites);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
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

      setNewPassword("");
    } catch (error: any) {
      console.error("Error changing password:", error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTopFavoriteChange = async (position: string, bookId: string) => {
    const pos = parseInt(position);
    try {
      // Remove the previous favorite from this position if it exists
      if (topFavorites[pos]) {
        await supabase
          .from("books")
          .update({ is_top_favorite: null })
          .eq("id", topFavorites[pos]);
      }

      // Remove the book from its previous position if it was a favorite
      Object.entries(topFavorites).forEach(async ([p, id]) => {
        if (id === bookId) {
          await supabase
            .from("books")
            .update({ is_top_favorite: null })
            .eq("id", id);
        }
      });

      // Set the new favorite
      await supabase
        .from("books")
        .update({ is_top_favorite: pos })
        .eq("id", bookId);

      // Refresh the books list
      fetchBooks();
    } catch (error) {
      console.error("Error updating top favorites:", error);
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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Top 3 Favorite Books</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((position) => (
              <div key={position} className="flex items-center gap-2">
                <span className="font-medium">#{position}</span>
                <Select
                  value={topFavorites[position] || ""}
                  onValueChange={(value) =>
                    handleTopFavoriteChange(position.toString(), value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a book" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-start" size="lg">
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