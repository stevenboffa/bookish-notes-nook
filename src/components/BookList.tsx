import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
      return "bg-[#E5DEFF] text-[#4C1D95]";
    case "In Progress":
      return "bg-[#FEF7CD] text-[#854D0E]";
    case "Finished":
      return "bg-[#F2FCE2] text-[#3F6212]";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getRatingColor = (rating: number) => {
  if (rating >= 9) return "bg-emerald-500 text-white";
  if (rating >= 7) return "bg-green-500 text-white";
  if (rating >= 5) return "bg-yellow-500 text-white";
  if (rating >= 3) return "bg-orange-500 text-white";
  return "bg-red-500 text-white";
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
              ? "bg-[#2C3E50] text-white shadow-lg ring-2 ring-black"
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
                    selectedBook?.id === book.id ? "text-gray-300" : ""
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
                  {book.status === "Finished" && (
                    <span 
                      className={`text-xs px-2 py-1 rounded ${getRatingColor(book.rating)}`}
                    >
                      Rating: {book.rating}/10
                    </span>
                  )}
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={
                      selectedBook?.id === book.id
                        ? "hover:bg-[#34495E] text-white"
                        : ""
                    }
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Book</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{book.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBook(book.id);
                      }}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
        </Card>
      ))}
      {filteredBooks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No books found for this filter</p>
        </div>
      )}
    </div>
  );
}