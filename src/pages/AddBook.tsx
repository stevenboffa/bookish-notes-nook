
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookDetailView } from "@/components/BookDetailView";
import { Book } from "@/types/books";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { BookCover } from "@/components/BookCover";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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

interface GoogleBooksResponse {
  items?: GoogleBook[];
  totalItems: number;
  currentPage: number;
  hasMore: boolean;
}

type SearchType = "title" | "author";

export default function AddBook() {
  const [book, setBook] = useState<Book | null>(null);
  const [searchResults, setSearchResults] = useState<GoogleBook[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("title");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();

  const searchBooks = async (page = 1) => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    if (page === 1) {
      setSearchResults([]);
    }
    
    try {
      const queryString = searchType === "author" 
        ? `inauthor:"${searchQuery.trim()}"` 
        : `intitle:"${searchQuery.trim()}"`;

      const { data, error } = await supabase.functions.invoke<GoogleBooksResponse>('search-books', {
        body: { 
          searchQuery: queryString,
          page,
          maxResults: 20
        }
      });

      if (error) {
        throw error;
      }

      if (data?.items && Array.isArray(data.items)) {
        if (page === 1) {
          setSearchResults(data.items);
        } else {
          setSearchResults(prev => [...prev, ...data.items]);
        }
        setHasMore(data.hasMore);
        setCurrentPage(data.currentPage);
        console.log('Search results:', data);
      }
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const loadMore = () => {
    searchBooks(currentPage + 1);
  };

  const selectBook = (googleBook: GoogleBook) => {
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
      quotes: [],
      isFavorite: false,
      imageUrl,
      thumbnailUrl,
      format: "physical_book",
      description: googleBook.volumeInfo.description || "",
    };
    setBook(newBook);
    setSearchResults([]);
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
      image_url: updatedBook.imageUrl,
      thumbnail_url: updatedBook.thumbnailUrl,
      format: updatedBook.format,
      description: updatedBook.description,
    };

    if (updatedBook.id && updatedBook.id !== "") {
      bookData["id"] = updatedBook.id;
    }

    const { error } = await supabase
      .from("books")
      .upsert(bookData);

    if (error) {
      console.error('Error saving book:', error);
      return;
    }

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
          <div className="space-y-4">
            <RadioGroup
              defaultValue="title"
              value={searchType}
              onValueChange={(value) => setSearchType(value as SearchType)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="title" id="title" />
                <Label htmlFor="title">Search by Title</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="author" id="author" />
                <Label htmlFor="author">Search by Author</Label>
              </div>
            </RadioGroup>

            <div className="flex gap-2">
              <Input
                placeholder={searchType === "author" ? "Enter author name..." : "Enter book title..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchBooks(1)}
              />
              <Button 
                onClick={() => searchBooks(1)}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>

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
                    <CardHeader className="flex flex-row gap-4">
                      <BookCover
                        imageUrl={result.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:')}
                        thumbnailUrl={result.volumeInfo.imageLinks?.smallThumbnail?.replace('http:', 'https:')}
                        genre={result.volumeInfo.categories?.[0] || "Uncategorized"}
                        title={result.volumeInfo.title}
                        size="sm"
                      />
                      <div>
                        <CardTitle className="text-lg">{result.volumeInfo.title}</CardTitle>
                        <CardDescription>
                          by {result.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {result.volumeInfo.description || 'No description available'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={loadMore}
                    disabled={isSearching}
                    variant="outline"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      'Load More Results'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
          {searchResults.length === 0 && searchQuery && !isSearching && (
            <p className="text-center text-muted-foreground py-8">
              No books found
            </p>
          )}
        </div>
      )}
      <BookDetailView book={book} onSave={handleSave} onClose={handleClose} />
    </div>
  );
}

