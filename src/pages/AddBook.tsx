import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Book } from "@/components/BookList";
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
import { BookDetailView } from "@/components/BookDetailView";

type BookStatus = "Not started" | "In Progress" | "Finished";

export default function AddBook() {
  const [book, setBook] = useState<Book>({
    id: "",
    title: "",
    author: "",
    genre: "",
    dateRead: new Date().toISOString().split('T')[0],
    rating: 0,
    status: "Not started",
    isFavorite: false,
    notes: [],
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;

      try {
        const { data: bookData, error: bookError } = await supabase
          .from("books")
          .select("*, notes(*)")
          .eq("id", id)
          .single();

        if (bookError) throw bookError;

        if (bookData) {
          const notes = bookData.notes.map((note: any) => ({
            id: note.id,
            content: note.content,
            createdAt: note.created_at,
          }));

          setBook({
            id: bookData.id,
            title: bookData.title,
            author: bookData.author,
            genre: bookData.genre,
            dateRead: bookData.date_read,
            rating: Number(bookData.rating) || 0,
            status: bookData.status as BookStatus || "Not started",
            notes,
            isFavorite: bookData.is_favorite || false,
          });
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        toast.error("Failed to fetch book details");
      }
    };

    fetchBook();
  }, [id]);

  const handleSave = async (updatedBook: Book) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to save books");
      return;
    }

    try {
      const bookData = {
        title: updatedBook.title,
        author: updatedBook.author,
        genre: updatedBook.genre,
        date_read: updatedBook.dateRead,
        rating: updatedBook.rating,
        status: updatedBook.status,
        is_favorite: updatedBook.isFavorite,
        user_id: session.user.id,
      };

      let response;
      
      if (id) {
        response = await supabase
          .from("books")
          .update(bookData)
          .eq("id", id);
      } else {
        response = await supabase
          .from("books")
          .insert([bookData]);
      }

      if (response.error) throw response.error;

      toast.success(id ? "Book updated successfully" : "Book added successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error('Error saving book:', error);
      toast.error("Failed to save book");
    }
  };

  const handleClose = () => {
    navigate("/dashboard");
  };

  const handleInputChange = (field: keyof Book, value: string) => {
    setBook(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex-1 md:container p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">
            {id ? "Edit Book" : "Add New Book"}
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={book.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter book title"
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={book.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                placeholder="Enter author name"
              />
            </div>
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={book.genre}
                onChange={(e) => handleInputChange("genre", e.target.value)}
                placeholder="Enter book genre"
              />
            </div>
            <div>
              <Label htmlFor="dateRead">Date Read</Label>
              <Input
                id="dateRead"
                type="date"
                value={book.dateRead}
                onChange={(e) => handleInputChange("dateRead", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={book.status} 
                onValueChange={(value: BookStatus) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue>{book.status}</SelectValue>
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
                onClick={() => handleSave(book)}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                {id ? "Update Book" : "Add Book"}
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}