
import { useState, useEffect } from "react";
import { Book } from "@/types/books";
import { BookList } from "@/components/BookList";
import { supabase } from "@/integrations/supabase/client";
import { BookDetailView } from "@/components/BookDetailView";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Favorites = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session?.user?.id) {
      fetchFavoriteBooks();
    }
  }, [session?.user?.id]);

  const fetchFavoriteBooks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', session?.user?.id)
        .eq('is_favorite', true)
        .order('title');

      if (error) throw error;

      const favBooks = data.map((book: any) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre || '',
        dateRead: book.date_read,
        rating: book.rating || 0,
        status: book.status || 'Not started',
        isFavorite: book.is_favorite || false,
        imageUrl: book.image_url || null,
        thumbnailUrl: book.thumbnail_url || null,
        format: book.format || 'physical_book',
        description: book.description || ''
      }));

      setBooks(favBooks);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching favorite books:', error);
      setIsLoading(false);
    }
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
  };

  const handleUpdateBook = async (updatedBook: Book) => {
    try {
      const { error } = await supabase
        .from('books')
        .update({
          title: updatedBook.title,
          author: updatedBook.author,
          genre: updatedBook.genre,
          status: updatedBook.status,
          rating: updatedBook.rating,
          date_read: updatedBook.dateRead,
          is_favorite: updatedBook.isFavorite,
          format: updatedBook.format,
          description: updatedBook.description
        })
        .eq('id', updatedBook.id);

      if (error) throw error;

      // If book is no longer a favorite, remove from list
      if (!updatedBook.isFavorite) {
        setBooks(books.filter(book => book.id !== updatedBook.id));
        setSelectedBook(null);
      } else {
        setBooks(books.map(book => 
          book.id === updatedBook.id ? updatedBook : book
        ));
        setSelectedBook(updatedBook);
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-medium mb-2">No favorite books yet</h2>
        <p className="text-muted-foreground mb-4">
          Mark books as favorites to see them here
        </p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Go to my books
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      <div className="w-2/3 p-6">
        <h1 className="text-2xl font-bold mb-6">My Favorite Books</h1>
        <BookList 
          books={books}
          selectedBook={selectedBook}
          onSelectBook={handleSelectBook}
          onDeleteBook={() => {}}
          activeFilter="favorites" 
        />
      </div>
      {selectedBook && (
        <div className="w-1/3 border-l border-gray-200 h-screen sticky top-0">
          <BookDetailView
            book={selectedBook}
            onSave={handleUpdateBook}
            onClose={() => setSelectedBook(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Favorites;
