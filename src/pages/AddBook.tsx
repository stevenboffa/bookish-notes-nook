import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookDetailView } from "@/components/BookDetailView";
import { Book } from "@/components/BookList";
import { BookSearch } from "@/components/BookSearch";

export default function AddBook() {
  const [book, setBook] = useState<Book | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBookSelect = (selectedBook: Book) => {
    setBook(selectedBook);
  };

  const handleClose = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex-1 md:container">
      {!id && (
        <div className="p-4 space-y-4">
          <h2 className="text-2xl font-bold">Search for a Book</h2>
          <BookSearch onBookSelect={handleBookSelect} />
          <p className="text-sm text-muted-foreground">
            Search for a book to auto-fill the details, or fill them in manually below.
          </p>
        </div>
      )}
      <BookDetailView book={book} onClose={handleClose} />
    </div>
  );
}