import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  isFavorite?: boolean;
  status: 'Not started' | 'In Progress' | 'Finished';
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
  onDeleteBook: (bookId: string) => void;
  activeFilter: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Not started":
      return "bg-[#E5DEFF] text-[#4C1D95]"; // Soft purple
    case "In Progress":
      return "bg-[#FEF7CD] text-[#854D0E]"; // Soft yellow
    case "Finished":
      return "bg-[#F2FCE2] text-[#3F6212]"; // Soft green
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getRatingColor = (rating: number) => {
  if (rating >= 9) return "bg-emerald-500 text-white"; // Bright green for excellent
  if (rating >= 7) return "bg-green-500 text-white"; // Green for very good
  if (rating >= 5) return "bg-yellow-500 text-white"; // Yellow for average
  if (rating >= 3) return "bg-orange-500 text-white"; // Orange for below average
  return "bg-red-500 text-white"; // Red for poor
};

export function BookList({
  books,
  selectedBook,
  onSelectBook,
  onDeleteBook,
  activeFilter,
}: BookListProps) {
  const filteredBooks = books.filter((book) => {
    switch (activeFilter) {
      case "in-progress":
        return book.status === "In Progress";
      case "not-started":
        return book.status === "Not started";
      case "finished":
        return book.status === "Finished";
      default:
        return true;
    }
  });

  return (
    <div className="space-y-3 px-4">
      {filteredBooks.map((book) => (
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
              <div className="flex-1">
                <CardTitle className="font-serif text-lg mb-1">
                  {book.title}
                </CardTitle>
                <CardDescription
                  className={
                    selectedBook?.id === book.id ? "text-book-light" : ""
                  }
                >
                  by {book.author}
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-opacity-20 bg-gray-500 rounded">
                    {book.genre}
                  </span>
                  <span 
                    className={`text-xs px-2 py-1 rounded ${getStatusColor(book.status)}`}
                  >
                    {book.status}
                  </span>
                  <span 
                    className={`text-xs px-2 py-1 rounded ${getRatingColor(book.rating)}`}
                  >
                    Rating: {book.rating}/10
                  </span>
                </div>
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
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}