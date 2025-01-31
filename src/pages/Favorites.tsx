import { useState, useEffect } from "react";
import { Book } from "@/components/BookList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Favorites = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    // In the future, this will fetch from Supabase
    const storedBooks = []; // We'll implement this with Supabase later
    setBooks(storedBooks);
  }, []);

  const favoriteBooks = books.filter((book) => book.rating >= 8);

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-serif font-bold mb-6">Favorite Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favoriteBooks.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle className="font-serif">{book.title}</CardTitle>
              <CardDescription>
                Rating: {book.rating}/10
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Read on: {new Date(book.dateRead).toLocaleDateString()}
              </p>
              <p className="mt-2">
                {book.notes.length} note{book.notes.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        ))}
        {favoriteBooks.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-8">
            No favorite books yet. Rate a book 8 or higher to see it here!
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;