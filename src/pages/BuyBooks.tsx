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

interface NYTBook {
  title: string;
  author: string;
  book_image: string;
  description: string;
  primary_isbn13: string;
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

  const { data: nytBooks = [], isLoading: isLoadingNYT } = useQuery({
    queryKey: ['nyt-bestsellers'],
    queryFn: async () => {
      const { data } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'NYT_API_KEY')
        .maybeSingle();

      if (!data?.value) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "NYT API key not found"
        });
        return [];
      }

      try {
        const response = await fetch(
          `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${data.value}`
        );
        const jsonData = await response.json();
        return jsonData.results.books.slice(0, 10) as NYTBook[];
      } catch (error) {
        console.error('Error fetching NYT books:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch bestsellers"
        });
        return [];
      }
    },
    enabled: !!session
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Search functionality will be implemented later
    setIsSearching(false);
  };

  if (!session) {
    return null;
  }

  return (
    <div className="flex-1 container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Buy Books</h1>
      
      {/* Search Section */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Search for books to buy..."
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {nytBooks.map((book) => (
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
            {nytBooks.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground py-8">
                No bestsellers available at the moment
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
