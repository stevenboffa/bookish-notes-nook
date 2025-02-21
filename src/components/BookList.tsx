
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/BookCover";
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
  status: 'Not started' | 'In Progress' | 'Finished' | 'Future Reads';
  isFavorite: boolean;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  format: 'physical_book' | 'audiobook' | 'ebook';
  notes: {
    id: string;
    content: string;
    createdAt: string;
    pageNumber?: number;
    timestampSeconds?: number;
    chapter?: string;
    category?: string;
    isPinned: boolean;
    readingProgress?: number;
  }[];
  quotes: {
    id: string;
    content: string;
    createdAt: string;
  }[];
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export interface Quote {
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
      return "bg-accent text-accent-foreground";
    case "In Progress":
      return "bg-primary/20 text-primary";
    case "Finished":
      return "bg-success text-success-foreground";
    case "Future Reads":
      return "bg-purple-100 text-purple-700";
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
      case "future-reads":
        return book.status === "Future Reads";
      default:
        return true;
    }
  });

  return (
    <div className="space-y-4 px-4 pb-safe-bottom">
      {filteredBooks.map((book) => (
        <Card
          key={book.id}
          className={`transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-card-hover animate-slide-up ${
            selectedBook?.id === book.id
              ? "bg-primary text-white shadow-lg ring-2 ring-primary"
              : "hover:shadow-md bg-white shadow-card"
          }`}
          onClick={() => onSelectBook(book)}
        >
          <CardHeader className="p-4">
            <div className="flex gap-4">
              <BookCover
                imageUrl={book.imageUrl}
                thumbnailUrl={book.thumbnailUrl}
                genre={book.genre}
                title={book.title}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="font-serif text-book-title mb-1 leading-tight">
                      {book.title}
                    </CardTitle>
                    <CardDescription
                      className={
                        selectedBook?.id === book.id ? "text-white/80" : "text-text-muted"
                      }
                    >
                      by {book.author}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-text">
                        {book.genre}
                      </span>
                      <span 
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(book.status)}`}
                      >
                        {book.status}
                      </span>
                      {book.status === "Finished" && (
                        <span 
                          className={`text-xs px-2 py-1 rounded-full ${getRatingColor(book.rating)}`}
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
                            ? "hover:bg-white/20 text-white"
                            : "hover:bg-accent/20"
                        }
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="animate-fade-in">
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
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
      {filteredBooks.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-text-muted">No books found for this filter</p>
        </div>
      )}
    </div>
  );
}
