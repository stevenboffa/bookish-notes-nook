import { useState } from "react";
import { BookList, type Book } from "@/components/BookList";
import { NoteSection } from "@/components/NoteSection";

const Dashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleAddBook = (book: Book) => {
    setBooks([...books, book]);
    setSelectedBook(book);
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks(books.filter((book) => book.id !== bookId));
    if (selectedBook?.id === bookId) {
      setSelectedBook(null);
    }
  };

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks(
      books.map((book) =>
        book.id === updatedBook.id ? updatedBook : book
      )
    );
    setSelectedBook(updatedBook);
  };

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 container mx-auto my-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <BookList
          books={books}
          selectedBook={selectedBook}
          onSelectBook={setSelectedBook}
          onAddBook={handleAddBook}
          onDeleteBook={handleDeleteBook}
        />
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {selectedBook ? (
          <NoteSection
            book={selectedBook}
            onUpdateBook={handleUpdateBook}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a book to view and manage notes
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;