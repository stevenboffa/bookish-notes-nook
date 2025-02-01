import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    dateRead: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const bookData = {
        title: formData.title,
        author: formData.author,
        genre: formData.genre,
        date_read: formData.dateRead,
        user_id: session.user.id,
        status: "Not started",
        rating: 0,
        is_favorite: false,
      };

      const { error } = await supabase.from("books").insert([bookData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Book added successfully!",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding book:", error);
      toast({
        title: "Error",
        description: "Failed to add book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Book</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            required
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Select
            value={formData.genre}
            onValueChange={(value) =>
              setFormData({ ...formData, genre: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fiction">Fiction</SelectItem>
              <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
              <SelectItem value="Mystery">Mystery</SelectItem>
              <SelectItem value="Science Fiction">Science Fiction</SelectItem>
              <SelectItem value="Fantasy">Fantasy</SelectItem>
              <SelectItem value="Romance">Romance</SelectItem>
              <SelectItem value="Thriller">Thriller</SelectItem>
              <SelectItem value="Horror">Horror</SelectItem>
              <SelectItem value="Biography">Biography</SelectItem>
              <SelectItem value="History">History</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Self-Help">Self-Help</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateRead">Date Read</Label>
          <Input
            id="dateRead"
            type="date"
            required
            value={formData.dateRead}
            onChange={(e) =>
              setFormData({ ...formData, dateRead: e.target.value })
            }
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Book"}
        </Button>
      </form>
    </div>
  );
}