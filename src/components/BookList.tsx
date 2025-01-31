import { useState } from "react";
import { Plus, Trash, Search } from "lucide-react";
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
          className="font-serif"
        />
        <Button 
          onClick={handleAddBook} 
          className="bg-[#1A1F2C] hover:bg-[#2C3E50] text-white"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto space-y-3">
        {books.map((book) => (
          <Card
            key={book.id}
            className={`transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
              selectedBook?.id === book.id
                ? "bg-[#2C3E50] text-white shadow-lg"
                : "hover:shadow-md bg-white"
            }`}
            onClick={() => onSelectBook(book)}
          >
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-serif text-xl">
                    {book.title}
                  </CardTitle>
                  <CardDescription
                    className={
                      selectedBook?.id === book.id ? "text-book-light" : ""
                    }
                  >
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
                  className={
                    selectedBook?.id === book.id
                      ? "hover:bg-[#34495E] text-white"
                      : ""
                  }
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex items-center">
                <span className="text-sm">Rating: </span>
                <div className="ml-2 flex">
                  {[...Array(10)].map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full mx-0.5 ${
                        i < book.rating
                          ? selectedBook?.id === book.id
                            ? "bg-book-light"
                            : "bg-[#2C3E50]"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}