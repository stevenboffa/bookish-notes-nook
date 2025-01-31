import { useState, useEffect } from "react";
import { BookList, type Book } from "@/components/BookList";
import { BookFilters } from "@/components/BookFilters";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();
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
          id,
          title,
          author,
          genre,
          date_read,
          rating,
          status,
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
        rating: book.rating || 0,
        status: book.status || 'Not started',
        notes: book.notes.map((note: any) => ({
          id: note.id,
          content: note.content,
          createdAt: note.created_at,
        })),
      }));

      setBooks(formattedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: "Error",
        description: "Failed to fetch books",
        variant: "destructive",
      });
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
        title: "Success",
        description: "Book deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    }
  };

  const handleSelectBook = (book: Book) => {
    navigate(`/edit-book/${book.id}`);
  };

  return (
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
  );
};

export default Dashboard;