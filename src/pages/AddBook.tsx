import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookDetailView } from "@/components/BookDetailView";
import { Book } from "@/components/BookList";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AddBook() {
  const [book, setBook] = useState<Book | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBook = async () => {
      if (id) {
        const { data, error } = await supabase
          .from("books")
          .select("*, notes(*)")
          .eq("id", id)
          .single();

        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch book details",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          setBook({
            ...data,
            dateRead: data.date_read,
            isFavorite: data.is_favorite,
          });
        }
      }
    };

    fetchBook();
  }, [id]);

  const handleSave = async (updatedBook: Book) => {
    const { error } = await supabase.from("books").upsert({
      id: updatedBook.id,
      title: updatedBook.title,
      author: updatedBook.author,
      genre: updatedBook.genre,
      date_read: updatedBook.dateRead,
      rating: updatedBook.rating,
      status: updatedBook.status,
      is_favorite: updatedBook.isFavorite,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save book",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Book saved successfully",
    });
    navigate("/dashboard");
  };

  const handleClose = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex-1 md:container">
      <BookDetailView
        book={book}
        onSave={handleSave}
        onClose={handleClose}
      />
    </div>
  );
}