import { BookCover } from "@/components/BookCover";
import { Book } from "@/components/BookList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FriendBooksProps {
  books: Book[];
  email: string;
}

export function FriendBooks({ books, email }: FriendBooksProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{email}'s Books</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
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
                  <CardTitle className="font-serif text-book-title mb-1 leading-tight text-lg">
                    {book.title}
                  </CardTitle>
                  <CardDescription>by {book.author}</CardDescription>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-accent/20">
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