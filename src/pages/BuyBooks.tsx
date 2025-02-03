import { useState } from "react";
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
import { Book } from "@/components/BookList";
import { useToast } from "@/hooks/use-toast";

interface NYTBook {
  title: string;
  author: string;
  book_image: string;
  description: string;
  primary_isbn13: string;
}

interface FriendBook extends Book {
  userEmail: string;
}

export default function BuyBooks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  if (!session) {
    navigate("/");
    return null;
  }

  const { data: nytBooks = [], isLoading: isLoadingNYT } = useQuery({
    queryKey: ['nyt-bestsellers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'NYT_API_KEY')
        .maybeSingle();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch NYT API key"
        });
        throw error;
      }

      if (!data) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "NYT API key not found"
        });
        return [];
      }

      const response = await fetch(
        `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${data.value}`
      );
      const jsonData = await response.json();
      return jsonData.results.books.slice(0, 10) as NYTBook[];
    },
  });

  const { data: friendBooks = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ['friend-top-books'],
    queryFn: async () => {
      // First get friend IDs
      const { data: friendships } = await supabase
        .from('friends')
        .select('sender_id, receiver_id')
        .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
        .eq('status', 'accepted');

      if (!friendships?.length) return [];

      const friendIds = friendships.map(f => 
        f.sender_id === session.user.id ? f.receiver_id : f.sender_id
      );

      // Then get books from friends
      const { data: books, error } = await supabase
        .from('books')
        .select('*, user:user_id(email)')
        .in('user_id', friendIds)
        .order('rating', { ascending: false })
        .limit(10);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch friend books"
        });
        throw error;
      }

      if (!books) return [];

      return books.map(book => ({
        ...book,
        userEmail: book.user?.email || '',
        dateRead: book.date_read,
        isFavorite: book.is_favorite,
        notes: [],
      })) as FriendBook[];
    },
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Search functionality will be implemented later
    setIsSearching(false);
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
          </div>
        )}
      </div>

      {/* Friends' Top Rated Books Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Friends' Top Rated Books</h2>
        {isLoadingFriends ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {friendBooks.map((book) => (
              <Card key={book.id} className="flex flex-col">
                <CardHeader className="flex-1">
                  <div className="aspect-w-2 aspect-h-3 mb-4">
                    <BookCover
                      imageUrl={book.imageUrl}
                      thumbnailUrl={book.thumbnailUrl}
                      genre={book.genre}
                      title={book.title}
                    />
                  </div>
                  <CardTitle className="text-lg">{book.title}</CardTitle>
                  <CardDescription>by {book.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">Rating: {book.rating}/10</p>
                    <p className="text-sm text-muted-foreground">
                      Recommended by: {book.userEmail}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
