import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface Book {
  id: string;
  title: string;
  dateRead: string;
  rating: number;
  notes: Note[];
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
}

interface BookListProps {
  books: Book[];
  selectedBook: Book | null;
  onSelectBook: (book: Book) => void;
  onAddBook: (book: Book) => void;
  onDeleteBook: (bookId: string) => void;
}

export function BookList({
  books,
  selectedBook,
  onSelectBook,
  onAddBook,
  onDeleteBook,
}: BookListProps) {
  const [newBookTitle, setNewBookTitle] = useState("");

  const handleAddBook = () => {
    if (!newBookTitle.trim()) return;

    const newBook: Book = {
      id: Date.now().toString(),
      title: newBookTitle,
      dateRead: new Date().toISOString().split("T")[0],
      rating: 0,
      notes: [],
    };

    onAddBook(newBook);
    setNewBookTitle("");
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add new book..."
          value={newBookTitle}
          onChange={(e) => setNewBookTitle(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddBook()}
        />
        <Button onClick={handleAddBook}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {books.map((book) => (
          <Card
            key={book.id}
            className={`mb-2 cursor-pointer transition-colors ${
              selectedBook?.id === book.id ? "bg-book-accent text-white" : ""
            }`}
            onClick={() => onSelectBook(book)}
          >
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-serif">{book.title}</CardTitle>
                  <CardDescription className={selectedBook?.id === book.id ? "text-gray-200" : ""}>
                    Read on: {new Date(book.dateRead).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBook(book.id);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2">
                Rating: {book.rating}/10
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}