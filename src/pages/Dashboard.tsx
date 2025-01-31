import { useState } from "react";
import { BookList, type Book } from "@/components/BookList";
import { NoteSection } from "@/components/NoteSection";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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