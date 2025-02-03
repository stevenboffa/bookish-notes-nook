import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { BookCover } from "@/components/BookCover";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { NYTListFilters } from "@/components/NYTListFilters";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface NYTBook {
  title: string;
  author: string;
  book_image: string;
  description: string;
  primary_isbn13: string;
}

export default function BuyBooks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedList, setSelectedList] = useState("hardcover-fiction");
  const [isSearching, setIsSearching] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!session) {
      navigate("/");
    }
  }, [session, navigate]);

  const { data: nytBooks = [], isLoading: isLoadingNYT, error: nytError } = useQuery({
    queryKey: ['nyt-bestsellers', selectedList],
    queryFn: async () => {
      console.log("Starting NYT bestsellers fetch...");
      
      const { data: secretData, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'NYT_API_KEY')
        .maybeSingle();

      if (secretError) {
        console.error('Error fetching NYT API key:', secretError);
        throw new Error('Failed to fetch NYT API key');
      }

      if (!secretData?.value) {
        console.error('NYT API key not found in secrets table');
        throw new Error('NYT API key not found');
      }

      const apiKey = secretData.value;
      console.log("Successfully retrieved NYT API key from secrets");
      
      // Parse the selected list to handle historical and best of year formats
      const [listName, date] = selectedList.split('/');
      let apiUrl = `https://api.nytimes.com/svc/books/v3/lists`;
      
      if (date) {
        // Historical or best of year list
        apiUrl += `/${date}/${listName}.json`;
      } else {
        // Current list
        apiUrl += `/current/${listName}.json`;
      }
      apiUrl += `?api-key=${apiKey}`;
      
      console.log("Fetching from NYT API URL:", apiUrl);
      
      try {
        const response = await fetch(apiUrl);
        
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a few minutes.');
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('NYT API error response:', errorText);
          throw new Error(`NYT API error: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log("NYT API response status:", jsonData.status);
        
        if (!jsonData.results?.books) {
          console.error('Unexpected NYT API response format:', jsonData);
          throw new Error('Unexpected NYT API response format');
        }

        console.log("Successfully fetched", jsonData.results.books.length, "books");
        return jsonData.results.books as NYTBook[];
      } catch (error) {
        console.error('Error fetching NYT books:', error);
        throw error;
      }
    },
    enabled: !!session,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes (renamed from cacheTime)
  });

  useEffect(() => {
    if (nytError) {
      const errorMessage = nytError instanceof Error ? nytError.message : 'Failed to fetch bestsellers';
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage.includes('Rate limit exceeded') 
          ? "We've hit the NYT API rate limit. Please wait a few minutes before trying again."
          : errorMessage
      });
      console.error('NYT Error details:', nytError);
    }
  }, [nytError, toast]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Search functionality will be implemented later
    setIsSearching(false);
  };

  if (!session) {
    return null;
  }

  const filteredBooks = searchQuery.trim()
    ? nytBooks.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : nytBooks;

  return (
    <div className="flex-1 container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Buy Books</h1>
      
      {/* Search and Filter Section */}
      <div className="space-y-4">
        <NYTListFilters 
          selectedList={selectedList}
          onListChange={setSelectedList}
        />
        <div className="flex gap-2">
          <Input
            placeholder="Search in results..."
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

      {/* NYT Bestsellers Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">NYT Bestsellers</h2>
        {isLoadingNYT ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : nytError ? (
          <div className="text-center text-red-500 py-8">
            {nytError instanceof Error && nytError.message.includes('Rate limit exceeded')
              ? "We've hit the API rate limit. Please wait a few minutes before trying again."
              : "Failed to load bestsellers. Please try again later."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBooks.map((book) => (
              <Card key={book.primary_isbn13} className="flex flex-col">
                <CardHeader className="flex-1">
                  <div className="aspect-w-2 aspect-h-3 mb-4">
                    <BookCover
                      imageUrl={book.book_image}
                      thumbnailUrl={book.book_image}
                      genre="Fiction"
                      title={book.title}
                    />
                  </div>
                  <CardTitle className="text-lg">{book.title}</CardTitle>
                  <CardDescription>by {book.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {book.description}
                  </p>
                </CardContent>
              </Card>
            ))}
            {filteredBooks.length === 0 && !nytError && (
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