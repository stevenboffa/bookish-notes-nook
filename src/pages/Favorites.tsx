import { useState, useEffect } from "react";
import { Book } from "@/components/BookList";
import { Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // In the future, this will fetch from Supabase
    const storedBooks = []; // We'll implement this with Supabase later
    setBooks(storedBooks);
  }, []);

  const favoriteBooks = books.filter((book) => book.rating >= 8);

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-text">Favorite Books</h1>
            <p className="text-sm text-text-muted">
              {favoriteBooks.length} highly rated books
            </p>
          </div>
          <Button
            onClick={() => navigate('/add-book')}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Book
          </Button>
        </div>
      </div>

      <div className="container mx-auto p-4 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteBooks.map((book) => (
            <Card key={book.id} className="animate-fade-in">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-serif">{book.title}</CardTitle>
                    <CardDescription>
                      Rating: {book.rating}/10
                    </CardDescription>
                  </div>
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
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
            <div className="col-span-full text-center text-gray-500 py-8 animate-fade-in">
              No favorite books yet. Rate a book 8 or higher to see it here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;