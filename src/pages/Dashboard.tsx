
import { useState, useEffect } from "react";
import { BookList, type Book } from "@/components/BookList";
import { BookFilters } from "@/components/BookFilters";
import { BookDetailView } from "@/components/BookDetailView";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (session?.user?.id) {
      fetchBooks();
    }
  }, [session?.user?.id]);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          notes (
            id,
            content,
            created_at,
            page_number,
            timestamp_seconds,
            chapter,
            category,
            is_pinned,
            reading_progress
          ),
          quotes (
            id,
            content,
            created_at
          )
        `)
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedBooks = data.map((book: any) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre || 'Unknown',
        dateRead: book.date_read,
        rating: Number(book.rating) || 0,
        status: book.status || 'Not started',
        isFavorite: book.is_favorite || false,
        imageUrl: book.image_url || null,
        thumbnailUrl: book.thumbnail_url || null,
        format: book.format || 'physical_book',
        description: book.description || '',
        notes: book.notes.map((note: any) => ({
          id: note.id,
          content: note.content,
          createdAt: note.created_at,
          pageNumber: note.page_number,
          timestampSeconds: note.timestamp_seconds,
          chapter: note.chapter,
          category: note.category,
          isPinned: note.is_pinned,
          readingProgress: note.reading_progress,
        })),
        quotes: book.quotes.map((quote: any) => ({
          id: quote.id,
          content: quote.content,
          createdAt: quote.created_at,
        })) || [],
      }));

      setBooks(formattedBooks);
      
      // Update selected book if it exists
      if (selectedBook) {
        const updatedSelectedBook = formattedBooks.find(book => book.id === selectedBook.id);
        if (updatedSelectedBook) {
          setSelectedBook(updatedSelectedBook);
        }
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;

      setBooks(books.filter((book) => book.id !== bookId));
      if (selectedBook?.id === bookId) {
        setSelectedBook(null);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
  };

  const handleUpdateBook = async (updatedBook: Book) => {
    try {
      console.log('Updating book with status:', updatedBook.status); // Debug log
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
        })
        .eq('id', updatedBook.id);

      if (error) {
        console.error('Supabase error:', error); // Debug log
        throw error;
      }

      // Update books state immediately
      setBooks(books.map(book => 
        book.id === updatedBook.id ? updatedBook : book
      ));
      
      // Update selected book
      setSelectedBook(updatedBook);
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
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">No books yet</h2>
        <p className="text-gray-600 mb-6">Start by adding your first book to your collection</p>
        <button
          onClick={() => navigate('/add-book')}
          className="bg-black text-white px-6 py-2 rounded-full hover:bg-black/90 transition-colors"
        >
          Add your first book
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white border-b sticky top-0 z-20">
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-text">My Books</h1>
              <p className="text-sm text-text-muted">{books.length} books in your collection</p>
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
          <BookFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
        <div className="flex-1 overflow-auto pb-20">
          <BookList
            books={books}
            selectedBook={selectedBook}
            onSelectBook={handleSelectBook}
            onDeleteBook={handleDeleteBook}
            activeFilter={activeFilter}
          />
        </div>
      </div>
      
      {isMobile ? (
        <Sheet open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
          <SheetContent 
            side="bottom" 
            className="h-[100dvh] p-0 mt-0"
          >
            {selectedBook && (
              <BookDetailView
                book={selectedBook}
                onSave={handleUpdateBook}
                onClose={() => setSelectedBook(null)}
              />
            )}
          </SheetContent>
        </Sheet>
      ) : (
        selectedBook && (
          <div className="w-1/3 border-l border-gray-200 h-screen sticky top-0">
            <BookDetailView
              book={selectedBook}
              onSave={handleUpdateBook}
              onClose={() => setSelectedBook(null)}
            />
          </div>
        )
      )}
    </div>
  );
};

export default Dashboard;
