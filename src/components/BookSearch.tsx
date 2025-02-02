import { useState, useCallback } from "react";
import { Book } from "./BookList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookCover } from "./BookCover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Loader2 } from "lucide-react";

interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    categories?: string[];
    publishedDate?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
}

interface BookSearchProps {
  onBookSelect: (book: Book) => void;
}

export function BookSearch({ onBookSelect }: BookSearchProps) {
  const [searchResults, setSearchResults] = useState<GoogleBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  const searchBooks = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-books', {
        body: { searchQuery: searchQuery.trim() }
      });

      if (error) throw error;

      setSearchResults(Array.isArray(data?.items) ? data.items : []);
    } catch (error) {
      console.error('Error searching books:', error);
      toast({
        title: "Error searching books",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  const handleBookSelect = (googleBook: GoogleBook) => {
    const imageUrl = googleBook.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:');
    const thumbnailUrl = googleBook.volumeInfo.imageLinks?.smallThumbnail?.replace('http:', 'https:');
    
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
      imageUrl,
      thumbnailUrl,
    };
    
    onBookSelect(newBook);
    setSearchResults([]);
    setInputValue("");
  };

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput 
        placeholder="Search books by title or author..."
        value={inputValue}
        onValueChange={(value) => {
          setInputValue(value);
          searchBooks(value);
        }}
      />
      {isSearching ? (
        <div className="p-4 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">Searching books...</p>
        </div>
      ) : (
        <>
          <CommandEmpty>No books found.</CommandEmpty>
          <CommandGroup>
            {searchResults.map((book) => (
              <CommandItem
                key={book.id}
                onSelect={() => handleBookSelect(book)}
                className="flex items-center gap-3 p-2"
              >
                <BookCover
                  imageUrl={book.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:')}
                  thumbnailUrl={book.volumeInfo.imageLinks?.smallThumbnail?.replace('http:', 'https:')}
                  genre={book.volumeInfo.categories?.[0] || "Uncategorized"}
                  title={book.volumeInfo.title}
                  size="sm"
                />
                <div className="flex flex-col">
                  <span className="font-medium">{book.volumeInfo.title}</span>
                  <span className="text-sm text-muted-foreground">
                    by {book.volumeInfo.authors?.[0] || "Unknown Author"}
                  </span>
                  {book.volumeInfo.categories?.[0] && (
                    <span className="text-xs text-muted-foreground">
                      {book.volumeInfo.categories[0]}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </>
      )}
    </Command>
  );
}