import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookDetailView } from "@/components/BookDetailView";
import { Book } from "@/components/BookList";
import { BookSearch } from "@/components/BookSearch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AddBook() {
  const [book, setBook] = useState<Book | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBookSelect = (selectedBook: Book) => {
    setBook(selectedBook);
  };

  const handleClose = () => {
    navigate("/dashboard");
  };

  const handleSave = async (bookToSave: Book) => {
    try {
      const { error } = await supabase
        .from('books')
        .insert([{
          title: bookToSave.title,
          author: bookToSave.author,
          genre: bookToSave.genre,
          date_read: bookToSave.dateRead,
          rating: bookToSave.rating,
          status: bookToSave.status,
          is_favorite: bookToSave.isFavorite,
          image_url: bookToSave.imageUrl,
          thumbnail_url: bookToSave.thumbnailUrl,
        }]);

      if (error) throw error;

      toast({
        title: "Book added successfully",
        description: `${bookToSave.title} has been added to your library`,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error('Error saving book:', error);
      toast({
        title: "Error saving book",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 md:container">
      {!book && (
        <div className="p-4 space-y-4">
          <h2 className="text-2xl font-bold">Search for a Book</h2>
          <BookSearch onBookSelect={handleBookSelect} />
          <p className="text-sm text-muted-foreground">
            Search for a book to auto-fill the details, or fill them in manually below.
          </p>
        </div>
      )}
      <BookDetailView 
        book={book} 
        onClose={handleClose} 
        onSave={handleSave}
      />
    </div>
  );
}