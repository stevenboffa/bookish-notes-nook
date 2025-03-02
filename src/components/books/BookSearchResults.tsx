
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookCover } from "@/components/BookCover";
import { GoogleBook } from "@/types/books";
import { Skeleton } from "@/components/ui/skeleton";

interface BookSearchResultsProps {
  books: GoogleBook[];
  onBookClick: (bookId: string) => void;
  isLoading?: boolean;
}

export function BookSearchResults({ books, onBookClick, isLoading }: BookSearchResultsProps) {
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
      {books.map((book) => (
        <Card 
          key={book.id} 
          className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onBookClick(book.id)}
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
      {books.length === 0 && !isLoading && (
        <p className="col-span-full text-center text-muted-foreground py-8">
          No books found
        </p>
      )}
    </div>
  );
}
