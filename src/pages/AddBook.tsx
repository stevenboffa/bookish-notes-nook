import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookDetailView } from "@/components/BookDetailView";
import { Book } from "@/components/BookList";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type BookStatus = "Not started" | "In Progress" | "Finished";
type BookData = Database['public']['Tables']['books']['Insert'];

export default function AddBook() {
  const [book, setBook] = useState<Book | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (id) {
      const fetchBook = async () => {
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
          setBook({
            id: data.id,
            title: data.title,
            author: data.author,
            genre: data.genre,
            dateRead: data.date_read,
            rating: Number(data.rating) || 0,
            status: data.status as BookStatus || "Not started",
            notes: data.notes.map((note: any) => ({
              id: note.id,
              content: note.content,
              createdAt: note.created_at,
            })),
            isFavorite: data.is_favorite || false,
          });
        }
      };

      fetchBook();
    } else {
      // Initialize with empty book for new entries
      setBook({
        id: '',
        title: '',
        author: '',
        genre: '',
        dateRead: new Date().toISOString().split('T')[0],
        rating: 0,
        status: "Not started",
        notes: [],
        isFavorite: false,
      });
    }
  }, [id]);

  const handleSave = async (updatedBook: Book) => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to save books');
      return;
    }

    const bookData: BookData = {
      title: updatedBook.title,
      author: updatedBook.author,
      genre: updatedBook.genre,
      date_read: updatedBook.dateRead,
      rating: updatedBook.rating,
      status: updatedBook.status,
      is_favorite: updatedBook.isFavorite,
      user_id: session.user.id,
    };

    try {
      const { error } = await supabase
        .from("books")
        .upsert({ ...bookData, id: id || undefined });

      if (error) throw error;

      toast.success("Book saved successfully");
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
    <div className="flex-1 md:container px-4 py-8">
      <BookDetailView 
        book={book} 
        onSave={handleSave} 
        onClose={handleClose} 
      />
    </div>
  );
}