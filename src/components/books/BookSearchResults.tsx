
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookCover } from "@/components/BookCover";
import { GoogleBook } from "@/types/books";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookSearchResultsProps {
  books: GoogleBook[];
  onBookClick: (bookId: string) => void;
  isLoading?: boolean;
  existingBooks?: Set<string>;
}

export function BookSearchResults({ books, onBookClick, isLoading, existingBooks = new Set() }: BookSearchResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader className="flex-1">
              <div className="aspect-w-2 aspect-h-3 mb-4">
                <Skeleton className="w-full h-full" />
              </div>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {books.map((book, index) => {
        const bookExists = existingBooks.has(`${book.volumeInfo.title}-${book.volumeInfo.authors?.[0] || 'Unknown Author'}`);
        
        return (
          <Card 
            key={book.id} 
            className={cn(
              "flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] group overflow-hidden border-gray-200 animate-slide-up",
              bookExists ? "border-amber-200 bg-amber-50/50" : ""
            )}
            onClick={() => onBookClick(book.id)}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="flex-1">
              <div className="aspect-w-2 aspect-h-3 mb-4 relative overflow-hidden rounded-md">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/20 via-transparent to-gray-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <BookCover
                  imageUrl={book.volumeInfo.imageLinks?.thumbnail}
                  thumbnailUrl={book.volumeInfo.imageLinks?.smallThumbnail}
                  genre={book.volumeInfo.categories?.[0] || 'Unknown'}
                  title={book.volumeInfo.title}
                  className="transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardTitle className="text-lg font-serif group-hover:text-primary transition-colors">{book.volumeInfo.title}</CardTitle>
              <CardDescription className="italic">
                by {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
              </CardDescription>
              
              {bookExists && (
                <div className="mt-2 flex items-center text-amber-600 text-xs font-medium bg-amber-50 p-1.5 px-2 rounded">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  Already in your library
                </div>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {book.volumeInfo.description || 'No description available'}
              </p>
            </CardContent>
          </Card>
        );
      })}
      {books.length === 0 && !isLoading && (
        <p className="col-span-full text-center text-muted-foreground py-8 font-serif italic">
          No books found
        </p>
      )}
    </div>
  );
}
