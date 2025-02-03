import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { BookCover } from "@/components/BookCover";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    description: string;
    imageLinks?: {
      thumbnail: string;
      smallThumbnail: string;
    };
    categories: string[];
  };
}

export default function BuyBooks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!session) {
      navigate("/");
    }
  }, [session, navigate]);

  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ['google-books', searchQuery],
    queryFn: async ({ signal }) => {
      try {
        console.log("Starting Google Books search...");
        
        const { data, error } = await supabase.functions.invoke<{ items: GoogleBook[] }>('search-books', {
          body: { 
            searchQuery: searchQuery.trim() || 'subject:fiction orderBy:newest'
          }
        });

        if (error) {
          console.error('Error fetching books:', error);
          throw error;
        }

        // Filter out books without thumbnails or essential info
        const filteredBooks = (data?.items || []).filter((book: GoogleBook) => 
          book.volumeInfo.imageLinks && 
          book.volumeInfo.title &&
          book.volumeInfo.authors
        );

        return filteredBooks;
      } catch (error) {
        console.error('Error fetching Google books:', error);
        throw error;
      }
    },
    enabled: !!session,
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
    retry: 1, // Only retry once to avoid excessive API calls
  });

  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch books. Please try again later.';
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
    }
  }, [error, toast]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setIsSearching(false);
  };

  if (!session) {
    return null;
  }

  return (
    <div className="flex-1 container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Buy Books</h1>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search by title, author, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {searchQuery ? 'Search Results' : 'Popular Fiction Books'}
        </h2>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            Failed to load books. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {books.map((book) => (
              <Card 
                key={book.id} 
                className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <CardHeader className="flex-1">
                  <div className="aspect-w-2 aspect-h-3 mb-4">
                    <BookCover
                      imageUrl={book.volumeInfo.imageLinks?.thumbnail}
                      thumbnailUrl={book.volumeInfo.imageLinks?.smallThumbnail}
                      genre={book.volumeInfo.categories?.[0] || 'Unknown'}
                      title={book.volumeInfo.title}
                    />
                  </div>
                  <CardTitle className="text-lg">{book.volumeInfo.title}</CardTitle>
                  <CardDescription>
                    by {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {book.volumeInfo.description || 'No description available'}
                  </p>
                </CardContent>
              </Card>
            ))}
            {books.length === 0 && !error && (
              <p className="col-span-full text-center text-muted-foreground py-8">
                No books found matching your search
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}