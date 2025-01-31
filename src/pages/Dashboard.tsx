import { useState, useEffect } from "react";
import { BookList, type Book } from "@/components/BookList";
import { NoteSection } from "@/components/NoteSection";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { session } = useAuth();

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

  const handleAddBook = async (book: Book) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert({
          title: book.title,
          author: book.author,
          genre: book.genre,
          date_read: book.dateRead,
          user_id: session?.user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newBook = {
        ...book,
        id: data.id,
      };

      setBooks([newBook, ...books]);
      setSelectedBook(newBook);
      toast({
        title: "Success",
        description: "Book added successfully",
      });
    } catch (error) {
      console.error('Error adding book:', error);
      toast({
        title: "Error",
        description: "Failed to add book",
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

  const handleUpdateBook = async (updatedBook: Book) => {
    try {
      const { error } = await supabase
        .from('books')
        .update({
          rating: updatedBook.rating,
        })
        .eq('id', updatedBook.id);

      if (error) throw error;

      // Handle notes
      for (const note of updatedBook.notes) {
        if (!note.id.includes('temp_')) {
          continue;
        }

        const { error: noteError } = await supabase
          .from('notes')
          .insert({
            content: note.content,
            book_id: updatedBook.id,
          });

        if (noteError) throw noteError;
      }

      setBooks(
        books.map((book) =>
          book.id === updatedBook.id ? updatedBook : book
        )
      );
      setSelectedBook(updatedBook);
      toast({
        title: "Success",
        description: "Book updated successfully",
      });
    } catch (error) {
      console.error('Error updating book:', error);
      toast({
        title: "Error",
        description: "Failed to update book",
        variant: "destructive",
      });
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 container mx-auto my-8 px-4">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
        <div className="bg-book-light rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          <BookList
            books={filteredBooks}
            selectedBook={selectedBook}
            onSelectBook={setSelectedBook}
            onAddBook={handleAddBook}
            onDeleteBook={handleDeleteBook}
          />
        </div>
        <div className="bg-book-light rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          {selectedBook ? (
            <NoteSection
              book={selectedBook}
              onUpdateBook={handleUpdateBook}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-book-accent">
              <p className="font-serif text-lg">Select a book to view and manage notes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;