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
import { supabase } from "@/integrations/supabase/client";

const Favorites = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('user_id', session?.user?.id)
          .eq('is_favorite', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedBooks = data.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          genre: book.genre,
          dateRead: book.date_read,
          rating: book.rating,
          status: book.status,
          isFavorite: book.is_favorite,
          imageUrl: book.image_url || null,
          thumbnailUrl: book.thumbnail_url || null,
          format: book.format || 'physical_book',
          notes: [],
          quotes: [],
        }));

        setBooks(formattedBooks);
      } catch (error) {
        console.error('Error fetching favorite books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteBooks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-text">Favorite Books</h1>
            <p className="text-sm text-text-muted">
              {books.length} favorite books
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
          {books.map((book) => (
            <Card key={book.id} className="animate-fade-in hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-serif">{book.title}</CardTitle>
                    <CardDescription>by {book.author}</CardDescription>
                  </div>
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Genre: {book.genre}</p>
                  <p className="text-sm text-gray-600">
                    Rating: {book.rating}/10
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {book.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    Notes: {book.notes.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          {books.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8 animate-fade-in">
              No favorite books yet. Mark some books as favorites to see them here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
