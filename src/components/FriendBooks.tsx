
import { useState, useEffect } from "react";
import { BookCover } from "@/components/BookCover";
import { Book } from "@/components/BookList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { BookInteractions } from "./friends/BookInteractions";
import { supabase } from "@/integrations/supabase/client";
import { BookReaction, ReadingProgress } from "./friends/types";
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
  const [reactions, setReactions] = useState<Record<string, BookReaction[]>>({});
  const [progress, setProgress] = useState<Record<string, ReadingProgress>>({});
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [genreFilter, setGenreFilter] = useState("all");

  const fetchReactions = async () => {
    const { data } = await supabase
      .from('book_reactions')
      .select('*')
      .in('book_id', books.map(b => b.id));
    
    if (data) {
      const grouped = data.reduce((acc, reaction) => {
        acc[reaction.book_id] = acc[reaction.book_id] || [];
        acc[reaction.book_id].push(reaction);
        return acc;
      }, {} as Record<string, BookReaction[]>);
      setReactions(grouped);
    }
  };

  const fetchProgress = async () => {
    const { data } = await supabase
      .from('reading_progress')
      .select('*')
      .in('book_id', books.map(b => b.id));
    
    if (data) {
      const grouped = data.reduce((acc, prog) => {
        acc[prog.book_id] = prog;
        return acc;
      }, {} as Record<string, ReadingProgress>);
      setProgress(grouped);
    }
  };

  useEffect(() => {
    if (books.length > 0) {
      fetchReactions();
      fetchProgress();
    }
  }, [books]);

  const genres = [...new Set(books.map(book => book.genre))];

  const filteredBooks = books
    .filter(book => {
      if (filter === "all") return true;
      if (filter === "in-progress") return book.status === "In Progress";
      if (filter === "finished") return book.status === "Finished";
      if (filter === "not-started") return book.status === "Not started";
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
        "grid gap-4",
        isMobile ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
      )}>
        {filteredBooks.map((book) => (
          <Card key={book.id} className="h-full">
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
                      "bg-gray-100 text-gray-700"
                    )}>
                      {book.status}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <BookInteractions
                bookId={book.id}
                ownerId={userId}
                reactions={reactions[book.id] || []}
                progress={progress[book.id]}
                onReactionAdded={fetchReactions}
                onProgressUpdated={fetchProgress}
              />
            </CardContent>
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
