import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookDetailView } from "@/components/BookDetailView";
import { Book, Note } from "@/components/BookList";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type BookStatus = "Not started" | "In Progress" | "Finished";

export default function AddBook() {
  const [book, setBook] = useState<Book | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    const fetchBook = async () => {
      if (id) {
        const { data, error } = await supabase
          .from("books")
          .select("*, notes(*)")
          .eq("id", id)
          .single();

        if (error) {
          console.error('Error fetching book:', error);
          toast.error("Failed to fetch book details");
          return;
        }

        if (data) {
          const notes: Note[] = data.notes.map((note: any) => ({
            id: note.id,
            content: note.content,
            createdAt: note.created_at,
          }));

          setBook({
            id: data.id,
            title: data.title,
            author: data.author,
            genre: data.genre,
            dateRead: data.date_read,
            rating: Number(data.rating) || 0,
            status: data.status as BookStatus || "Not started",
            notes,
            isFavorite: data.is_favorite || false,
          });
        }
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
        // Update existing book
        response = await supabase
          .from("books")
          .update(bookData)
          .eq("id", id);
      } else {
        // Create new book
        response = await supabase
          .from("books")
          .insert([bookData]);
      }

      if (response.error) {
        throw response.error;
      }

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

  return (
    <div className="flex-1 md:container">
      <BookDetailView book={book} onSave={handleSave} onClose={handleClose} />
    </div>
  );
}