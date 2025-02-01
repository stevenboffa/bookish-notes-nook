import { useState, useEffect } from "react";
import { BookList, type Book } from "@/components/BookList";
import { BookFilters } from "@/components/BookFilters";
import { BookDetailView } from "@/components/BookDetailView";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
        genre: book.genre,
        dateRead: book.date_read,
        rating: Number(book.rating) || 0,
        status: book.status || 'Not started',
        isFavorite: book.is_favorite || false,
        notes: book.notes.map((note: any) => ({
          id: note.id,
          content: note.content,
          createdAt: note.created_at,
        })),
      }));

      setBooks(formattedBooks);
    } catch (error) {
      toast({
        title: "Error fetching books",
        description: "Please try again later",
        variant: "destructive",
      });
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
      
      toast({
        title: "Book deleted",
        description: "The book has been successfully removed",
      });
    } catch (error) {
      toast({
        title: "Error deleting book",
        description: "Please try again later",
        variant: "destructive",
      });
      console.error('Error deleting book:', error);
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
        })
        .eq('id', updatedBook.id);

      if (error) throw error;

      setBooks(books.map(book => 
        book.id === updatedBook.id ? updatedBook : book
      ));
      
      toast({
        title: "Book updated",
        description: "Changes have been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error updating book",
        description: "Please try again later",
        variant: "destructive",
      });
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
      <div className="flex-1 flex flex-col">
        <BookFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
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

export default Dashboard;