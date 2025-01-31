import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  author: string;
  genre: string;
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
  const [isOpen, setIsOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
  });

  const handleAddBook = () => {
    if (!newBook.title.trim() || !newBook.author.trim() || !newBook.genre) return;

    const book: Book = {
      id: Date.now().toString(),
      title: newBook.title,
      author: newBook.author,
      genre: newBook.genre,
      dateRead: new Date().toISOString().split("T")[0],
      rating: 0,
      notes: [],
    };

    onAddBook(book);
    setNewBook({ title: "", author: "", genre: "" });
    setIsOpen(false);
  };

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Biography",
    "History",
    "Self-Help",
  ];

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#1A1F2C] hover:bg-[#2C3E50] text-white">
            <Plus className="h-4 w-4 mr-2" /> Add New Book
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Input
                placeholder="Book Title"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                className="font-serif"
              />
            </div>
            <div>
              <Input
                placeholder="Author"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                className="font-serif"
              />
            </div>
            <div>
              <Select
                value={newBook.genre}
                onValueChange={(value) => setNewBook({ ...newBook, genre: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleAddBook}
              className="w-full bg-[#1A1F2C] hover:bg-[#2C3E50] text-white"
            >
              Add Book
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                    by {book.author} • {book.genre}
                  </CardDescription>
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
                <span className="text-sm">Rating: {book.rating}/10</span>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
