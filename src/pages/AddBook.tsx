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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const [searchResults, setSearchResults] = useState<GoogleBook[]>([]);
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
    setSearchResults([]);
    try {
      const { data, error } = await supabase.functions.invoke('search-books', {
        body: { searchQuery: searchQuery.trim() }
      });

      if (error) {
        throw error;
      }

      if (data.items && data.items.length > 0) {
        setSearchResults(data.items);
        toast({
          title: `Found ${data.items.length} books`,
          description: "Select a book from the results below.",
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
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const selectBook = (googleBook: GoogleBook) => {
    const newBook: Book = {
      id: crypto.randomUUID(),
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
    setSearchResults([]);
    toast({
      title: "Book selected!",
      description: "You can now edit the details and save.",
    });
  };

  const handleSave = async (updatedBook: Book) => {
    if (!session?.user?.id) {
      console.error('User must be logged in to save books');
      return;
    }

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

    // If we're updating an existing book, include its ID
    if (updatedBook.id && updatedBook.id !== "") {
      bookData["id"] = updatedBook.id;
    }

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

          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Search Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((result) => (
                  <Card 
                    key={result.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => selectBook(result)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{result.volumeInfo.title}</CardTitle>
                      <CardDescription>
                        by {result.volumeInfo.authors?.[0] || "Unknown Author"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {result.volumeInfo.categories?.[0] || "Uncategorized"}
                      </p>
                      {result.volumeInfo.publishedDate && (
                        <p className="text-sm text-muted-foreground">
                          Published: {result.volumeInfo.publishedDate}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <BookDetailView book={book} onSave={handleSave} onClose={handleClose} />
    </div>
  );
}