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

interface FriendBooksProps {
  books: Book[];
  email: string;
  onBack?: () => void;
}

export function FriendBooks({ books, email, onBack }: FriendBooksProps) {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        {isMobile && onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="flex-shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <h2 className="text-2xl font-bold truncate">{email}'s Books</h2>
      </div>
      
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
      )}>
        {books.map((book) => (
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
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
        {books.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">
            No books in collection
          </p>
        )}
      </div>
    </div>
  );
}