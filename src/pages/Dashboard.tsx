import { useState, useEffect } from "react";
import { BookList, type Book } from "@/components/BookList";
import { BookFilters } from "@/components/BookFilters";
import { BookDetailView } from "@/components/BookDetailView";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session?.user?.id) {
      fetchBooks();
    }
  }, [session?.user?.id]);

  const fetchBooks = async () => {
    try {
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
      console.error('Error fetching books:', error);
      toast.error("Failed to fetch books");
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
      toast.success("Book deleted successfully");
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error("Failed to delete book");
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
          status: updatedBook.status,
          rating: updatedBook.rating,
          is_favorite: updatedBook.isFavorite,
        })
        .eq('id', updatedBook.id);

      if (error) throw error;

      setBooks(books.map(book => 
        book.id === updatedBook.id ? updatedBook : book
      ));
      setSelectedBook(updatedBook);
      toast.success("Book updated successfully");
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error("Failed to update book");
    }
  };

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
        <div className="w-1/3 border-l border-gray-200 h-screen">
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