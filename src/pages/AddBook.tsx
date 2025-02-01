import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookDetailView } from "@/components/BookDetailView";
import { Book } from "@/components/BookList";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    categories?: string[];
    publishedDate?: string;
    description?: string;
  };
}

export default function AddBook() {
  const [book, setBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();

  const searchBooks = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      // First, get the API key from Supabase
      const { data: secretData, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'GOOGLE_BOOKS_API_KEY')
        .single();

      if (secretError) {
        throw new Error('Could not retrieve API key from secrets');
      }

      if (!secretData?.value) {
        throw new Error('API key not found in secrets');
      }

      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&key=${secretData.value}&maxResults=1`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch book data');
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const googleBook: GoogleBook = data.items[0];
        const newBook: Book = {
          id: "",
          title: googleBook.volumeInfo.title,
          author: googleBook.volumeInfo.authors?.[0] || "Unknown Author",
          genre: googleBook.volumeInfo.categories?.[0] || "Uncategorized",
          dateRead: new Date().toISOString().split('T')[0],
          rating: 0,
          status: "Not started",
          notes: [],
          isFavorite: false,
        };
        setBook(newBook);
        toast({
          title: "Book found!",
          description: "You can now edit the details and save.",
        });
      } else {
        toast({
          title: "No books found",
          description: "Try a different search term",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching books:', error);
      toast({
        title: "Error searching books",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = async (updatedBook: Book) => {
    if (!session?.user?.id) {
      console.error('User must be logged in to save books');
      return;
    }

    const bookData = {
      id: updatedBook.id,
      title: updatedBook.title,
      author: updatedBook.author,
      genre: updatedBook.genre,
      date_read: updatedBook.dateRead,
      rating: updatedBook.rating,
      status: updatedBook.status,
      is_favorite: updatedBook.isFavorite,
      user_id: session.user.id,
    };

    const { error } = await supabase
      .from("books")
      .upsert(bookData);

    if (error) {
      console.error('Error saving book:', error);
      toast({
        title: "Error saving book",
        description: "Please try again",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Book saved successfully",
    });
    navigate("/dashboard");
  };

  const handleClose = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex-1 md:container">
      {!id && (
        <div className="p-4 space-y-4">
          <h2 className="text-2xl font-bold">Search for a Book</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchBooks()}
            />
            <Button 
              onClick={searchBooks}
              disabled={isSearching}
            >
              {isSearching ? (
                "Searching..."
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Search for a book to auto-fill the details, or fill them in manually below.
          </p>
        </div>
      )}
      <BookDetailView book={book} onSave={handleSave} onClose={handleClose} />
    </div>
  );
}