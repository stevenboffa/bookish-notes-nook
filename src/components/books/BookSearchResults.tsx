import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookCover } from "@/components/BookCover";
import { GoogleBook } from "@/types/books";

interface BookSearchResultsProps {
  books: GoogleBook[];
  onBookClick: (bookId: string) => void;
}

export function BookSearchResults({ books, onBookClick }: BookSearchResultsProps) {
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
      {books.length === 0 && (
        <p className="col-span-full text-center text-muted-foreground py-8">
          No books found
        </p>
      )}
    </div>
  );
}
