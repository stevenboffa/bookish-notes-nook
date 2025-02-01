import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BookStatus = "Not started" | "In Progress" | "Finished";

interface BookFormData {
  title: string;
  author: string;
  genre: string;
  dateRead: string;
  status: BookStatus;
}

export default function AddBook() {
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    genre: "",
    dateRead: new Date().toISOString().split('T')[0],
    status: "Not started",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      const { data: book, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (book) {
        setFormData({
          title: book.title,
          author: book.author,
          genre: book.genre,
          dateRead: book.date_read,
          status: book.status as BookStatus,
        });
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error("Failed to fetch book details");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error("You must be logged in to add books");
      return;
    }

    try {
      const bookData = {
        title: formData.title,
        author: formData.author,
        genre: formData.genre,
        date_read: formData.dateRead,
        status: formData.status,
        user_id: session.user.id,
      };

      if (id) {
        const { error } = await supabase
          .from("books")
          .update(bookData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Book updated successfully");
      } else {
        const { error } = await supabase
          .from("books")
          .insert([bookData]);

        if (error) throw error;
        toast.success("Book added successfully");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error('Error saving book:', error);
      toast.error("Failed to save book");
    }
  };

  return (
    <div className="flex-1 md:container p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">
            {id ? "Edit Book" : "Add New Book"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter book title"
                required
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Enter author name"
                required
              />
            </div>
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                placeholder="Enter book genre"
                required
              />
            </div>
            <div>
              <Label htmlFor="dateRead">Date Read</Label>
              <Input
                id="dateRead"
                type="date"
                value={formData.dateRead}
                onChange={(e) => setFormData({ ...formData, dateRead: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: BookStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue>{formData.status}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not started">Not started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Finished">Finished</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                {id ? "Update Book" : "Add Book"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}