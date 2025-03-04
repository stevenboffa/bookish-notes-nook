import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookDetailView } from "@/components/BookDetailView";
import { Book } from "@/components/BookList";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, BookPlus } from "lucide-react";
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
import { toast } from "sonner";
import { BookSearchResults } from "@/components/books/BookSearchResults";
import { bookGenres } from "@/components/BookFilters";
import { GoogleBook } from "@/types/books";

type SearchType = "title" | "author";

export default function AddBook() {
  const [book, setBook] = useState<Book | null>(null);
  const [searchResults, setSearchResults] = useState<GoogleBook[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("title");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [openDetailsForManualAdd, setOpenDetailsForManualAdd] = useState(false);
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
      genre: googleBook.volumeInfo.categories?.[0] || "Fiction",
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
      toast.error('You must be logged in to save books');
      return;
    }

    if (!updatedBook.title || !updatedBook.author) {
      toast.error('Book title and author are required');
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
      toast.error('Error saving book. Please try again.');
      return;
    }

    toast.success('Book saved successfully!');
    navigate("/dashboard");
  };

  const handleClose = () => {
    navigate("/dashboard");
  };

  const handleManualAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setShowManualAdd(true);
    setOpenDetailsForManualAdd(true);
    setBook({
      id: crypto.randomUUID(),
      title: "",
      author: "",
      genre: "Fiction",
      dateRead: new Date().toISOString().split('T')[0],
      rating: 0,
      status: "Not started",
      notes: [],
      quotes: [],
      isFavorite: false,
      imageUrl: null,
      thumbnailUrl: null,
      format: "physical_book",
      description: "",
    });
  };

  return (
    <div className="flex-1 md:container">
      {!id && !showManualAdd && (
        <div className="p-4 space-y-6 bg-gradient-to-b from-white via-gray-50 to-white min-h-[calc(100vh-4rem)]">
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-serif tracking-tight">Search for a Book</h2>
              <p className="text-muted-foreground text-sm">
                Search and lookup a book by title or by author in the search bar below
              </p>
            </div>
            
            <div className="space-y-5 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <RadioGroup
                defaultValue="title"
                value={searchType}
                onValueChange={(value) => setSearchType(value as SearchType)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="title" id="title" />
                  <Label htmlFor="title" className="cursor-pointer font-medium">Search by Title</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="author" id="author" />
                  <Label htmlFor="author" className="cursor-pointer font-medium">Search by Author</Label>
                </div>
              </RadioGroup>

              <div className="flex gap-2 relative">
                <div className="relative flex-1 group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent opacity-0 group-focus-within:opacity-100 rounded-lg blur transition duration-300"></div>
                  <Input
                    placeholder={searchType === "author" ? "Enter author name..." : "Enter book title..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchBooks(1)}
                    className="relative border-gray-200 hover:border-primary/40 transition-colors focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button 
                  onClick={() => searchBooks(1)}
                  disabled={isSearching}
                  className="transition-all hover:scale-105 bg-primary hover:bg-primary/90"
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
          </div>

          <div className="flex flex-col items-center justify-center space-y-3 py-8 border-t border-b border-gray-100 my-6 bg-gradient-to-r from-accent/20 to-success/20 rounded-lg p-6 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]">
            <p className="text-text-muted italic">If you cannot find your book, you can add it manually</p>
            <Button 
              onClick={handleManualAdd} 
              variant="outline"
              className="flex items-center gap-2 hover:scale-105 transition-transform shadow-sm hover:shadow bg-white hover:bg-accent/30"
              type="button"
            >
              <BookPlus className="h-4 w-4" />
              Add book manually
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-4 animate-slide-up">
              <h3 className="text-lg font-semibold font-serif tracking-tight">Search Results</h3>
              <BookSearchResults 
                books={searchResults} 
                onBookClick={(bookId) => {
                  const selectedBook = searchResults.find(book => book.id === bookId);
                  if (selectedBook) {
                    selectBook(selectedBook);
                  }
                }} 
              />
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={loadMore}
                    disabled={isSearching}
                    variant="outline"
                    className="group transition-all hover:shadow-md"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      <span className="flex items-center group-hover:translate-y-[-1px] transition-transform">
                        Load More Results
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
          {searchResults.length === 0 && searchQuery && !isSearching && (
            <div className="text-center text-muted-foreground py-10 bg-gray-50/50 rounded-lg border border-gray-100 animate-fade-in">
              <p className="font-serif italic">No books found</p>
              <p className="text-sm mt-2">Try a different search term or add your book manually</p>
            </div>
          )}
        </div>
      )}
      {(book || id || showManualAdd) && (
        <BookDetailView 
          book={book} 
          onSave={handleSave} 
          onClose={handleClose} 
          initialOpenDetails={openDetailsForManualAdd}
        />
      )}
    </div>
  );
}
