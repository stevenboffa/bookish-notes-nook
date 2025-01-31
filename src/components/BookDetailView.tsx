import { useState, useEffect } from "react";
import { Book } from "./BookList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Save, Star, StarHalf } from "lucide-react";
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
  const [rating, setRating] = useState(book?.rating || 0);
  const navigate = useNavigate();

  // Update local state when book prop changes
  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setGenre(book.genre);
      setStatus(book.status as BookStatus);
      setRating(book.rating);
    }
  }, [book]);

  const handleSave = () => {
    if (!book) {
      // Creating a new book
      const newBook = {
        id: crypto.randomUUID(),
        title,
        author,
        genre,
        status,
        rating,
        notes: [],
        dateRead: new Date().toISOString().split('T')[0],
        isFavorite: false,
      };
      onSave(newBook);
    } else {
      // Updating existing book - maintain all existing properties
      const updatedBook = {
        ...book,
        title,
        author,
        genre,
        status,
        rating,
      };
      onSave(updatedBook);
    }
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="w-5 h-5 fill-current text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="w-5 h-5 fill-current text-yellow-400" />);
    }

    return stars;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center p-4 border-b bg-gray-100">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-gray-600">by {author}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="default"
            size="icon"
            className="bg-gray-800 text-white hover:bg-gray-900"
            onClick={handleSave}
          >
            <Save className="h-5 w-5" />
          </Button>
          <Button 
            variant="default"
            size="icon"
            className="bg-gray-800 text-white hover:bg-gray-900"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
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

        <div className="space-y-2">
          <Label htmlFor="rating" className="text-sm font-medium">Rating</Label>
          <div className="flex items-center gap-4">
            <Slider
              id="rating"
              min={0}
              max={10}
              step={0.5}
              value={[rating]}
              onValueChange={(value) => setRating(value[0])}
              className="flex-1"
            />
            <span className="min-w-[60px] text-right">{rating}/10</span>
          </div>
          <div className="flex gap-1 mt-2">
            {renderRatingStars(rating)}
          </div>
        </div>

        {book && <NoteSection book={book} onUpdateBook={onSave} />}
      </div>
    </div>
  );
}