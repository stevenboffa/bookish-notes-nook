import { useState } from "react";
import { BookCover } from "@/components/BookCover";
import { Book } from "@/types/books";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, BookPlus, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FriendBooksProps {
  books: Book[];
  email: string;
  userId: string;
  onBack?: () => void;
}

export function FriendBooks({ books, email, userId, onBack }: FriendBooksProps) {
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [genreFilter, setGenreFilter] = useState("all");
  const { toast } = useToast();
  const { session } = useAuth();
  const [addedBooks, setAddedBooks] = useState<Set<string>>(new Set());

  const genres = [...new Set(books.map(book => book.genre))];

  const addToCollection = async (book: Book) => {
    try {
      // Check if the book already exists in user's collection
      const { data: existingBook, error: checkError } = await supabase
        .from('books')
        .select('id, status')
        .eq('user_id', session?.user.id)
        .eq('title', book.title)
        .eq('author', book.author)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingBook) {
        // If book exists but isn't in Not started, update its status
        if (existingBook.status !== 'Not started') {
          const { error: updateError } = await supabase
            .from('books')
            .update({ 
              status: 'Not started',
              date_read: new Date().toISOString().split('T')[0]
            })
            .eq('id', existingBook.id);

          if (updateError) throw updateError;

          toast({
            title: "Status Updated",
            description: `"${book.title}" has been moved to your Not started list.`,
          });
        } else {
          toast({
            title: "Already in Collection",
            description: `"${book.title}" is already in your Not started list.`,
          });
        }
      } else {
        // If book doesn't exist, add it to the user's collection
        const { error: insertError } = await supabase
          .from('books')
          .insert({
            title: book.title,
            author: book.author,
            genre: book.genre,
            status: 'Not started',
            user_id: session?.user.id,
            image_url: book.imageUrl,
            thumbnail_url: book.thumbnailUrl,
            date_read: new Date().toISOString().split('T')[0],
            format: book.format || 'physical_book'
          });

        if (insertError) throw insertError;

        toast({
          title: "Book Added",
          description: `"${book.title}" has been added to your Not started list.`,
        });
      }
      
      // Add book to the added set to show checkmark
      setAddedBooks(prev => new Set(prev).add(book.id));
    } catch (error) {
      console.error('Error adding to collection:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add book to your collection. Please try again.",
      });
    }
  };

  const filteredBooks = books
    .filter(book => {
      if (filter === "all") return true;
      if (filter === "in-progress") return book.status === "In Progress";
      if (filter === "finished") return book.status === "Finished";
      if (filter === "not-started") return book.status === "Not started";
      if (filter === "future-reads") return book.status === "Future Reads";
      return true;
    })
    .filter(book => {
      if (genreFilter === "all") return true;
      return book.genre === genreFilter;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0; // recent
    });

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="mb-6 bg-accent/10">
        <CardHeader className="py-3">
          <div className="flex items-center gap-2">
            {isMobile && onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="flex-shrink-0 -ml-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="min-w-0 flex-1">
              <CardDescription className="text-sm font-medium text-muted-foreground mb-0.5">
                Viewing Collection
              </CardDescription>
              <CardTitle className="text-lg font-semibold truncate">
                {email}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Books</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="finished">Finished</SelectItem>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="future-reads">Future Reads</SelectItem>
          </SelectContent>
        </Select>

        <Select value={genreFilter} onValueChange={setGenreFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map(genre => (
              <SelectItem key={genre} value={genre}>{genre}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Added</SelectItem>
            <SelectItem value="rating">Highest Rating</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className={cn(
        "grid gap-4 pb-safe-bottom",
        isMobile ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
      )}>
        {filteredBooks.map((book) => (
          <Card key={book.id}>
            <CardHeader className="p-4">
              <div className="flex gap-4">
                <BookCover
                  imageUrl={book.imageUrl}
                  thumbnailUrl={book.thumbnailUrl}
                  genre={book.genre}
                  title={book.title}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <CardTitle className="font-serif text-book-title mb-1 leading-tight text-lg line-clamp-2">
                    {book.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">by {book.author}</CardDescription>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-accent/20 truncate">
                      {book.genre}
                    </span>
                    {book.rating > 0 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                        Rating: {book.rating}/10
                      </span>
                    )}
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      book.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                      book.status === "Finished" ? "bg-green-100 text-green-700" :
                      book.status === "Future Reads" ? "bg-purple-100 text-purple-700" :
                      "bg-gray-100 text-gray-700"
                    )}>
                      {book.status}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCollection(book);
                    }}
                  >
                    {addedBooks.has(book.id) ? (
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <BookPlus className="mr-2 h-4 w-4" />
                    )}
                    {addedBooks.has(book.id) ? 'Added to Collection' : 'Add Book'}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
        {filteredBooks.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">
            No books match the selected filters
          </p>
        )}
      </div>
    </div>
  );
}
