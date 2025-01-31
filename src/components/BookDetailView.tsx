import { useState, useEffect } from "react";
import { Book } from "./BookList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NoteSection } from "./NoteSection";

const genres = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Science Fiction",
  "Fantasy",
  "Romance",
  "Thriller",
  "Horror",
  "Biography",
  "History",
  "Self-Help",
  "Poetry",
  "Drama",
  "Adventure",
  "Children's",
];

interface BookDetailViewProps {
  book: Book | null;
  onSave: (book: Book) => void;
  onClose: () => void;
}

type BookStatus = "Not started" | "In Progress" | "Finished";

export function BookDetailView({ book, onSave, onClose }: BookDetailViewProps) {
  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [genre, setGenre] = useState(book?.genre || "");
  const [status, setStatus] = useState<BookStatus>(book?.status as BookStatus || "Not started");
  const navigate = useNavigate();

  useEffect(() => {
    if (book?.status) {
      setStatus(book.status as BookStatus);
    }
  }, [book?.status]);

  const handleSave = () => {
    const updatedBook = {
      ...book,
      title,
      author,
      genre,
      status,
      id: book?.id || crypto.randomUUID(),
      notes: book?.notes || [],
      dateRead: book?.dateRead || new Date().toISOString().split('T')[0],
      rating: book?.rating || 0,
      isFavorite: book?.isFavorite || false,
    };
    onSave(updatedBook);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center p-4 border-b bg-book-DEFAULT">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-book-accent/20"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        <Button 
          onClick={handleSave}
          className="bg-white text-book-DEFAULT hover:bg-book-light"
        >
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!book && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                className="border-book-DEFAULT/20 focus:border-book-DEFAULT"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author" className="text-sm font-medium">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                className="border-book-DEFAULT/20 focus:border-book-DEFAULT"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre" className="text-sm font-medium">Genre</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="border-book-DEFAULT/20 focus:border-book-DEFAULT">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">Status</Label>
          <Select value={status} onValueChange={(value: BookStatus) => setStatus(value)}>
            <SelectTrigger className="border-book-DEFAULT/20 focus:border-book-DEFAULT">
              <SelectValue>{status}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Not started">Not started</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Finished">Finished</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {book && <NoteSection book={book} onUpdateBook={onSave} />}
      </div>
    </div>
  );
}