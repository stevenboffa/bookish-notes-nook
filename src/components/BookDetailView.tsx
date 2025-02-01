import { useState, useEffect } from "react";
import { Book } from "./BookList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [isFavorite, setIsFavorite] = useState(book?.isFavorite || false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setGenre(book.genre);
      setStatus(book.status as BookStatus);
      setRating(parseFloat(String(book.rating)) || 0);
      setIsFavorite(book.isFavorite || false);
    }
  }, [book]);

  const handleSave = () => {
    if (!book) {
      const newBook = {
        id: crypto.randomUUID(),
        title,
        author,
        genre,
        status,
        rating: parseFloat(rating.toFixed(1)),
        notes: [],
        dateRead: new Date().toISOString().split('T')[0],
        isFavorite,
      };
      onSave(newBook);
    } else {
      const updatedBook = {
        ...book,
        title,
        author,
        genre,
        status,
        rating: parseFloat(rating.toFixed(1)),
        isFavorite,
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
    <div className="flex flex-col h-full bg-white">
      <div className="flex justify-between items-center p-4 border-b bg-gray-100 sticky top-0 z-10">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold truncate">{title}</h2>
          <p className="text-gray-600 truncate">by {author}</p>
        </div>
        <div className="flex gap-2 ml-2">
          <Button 
            variant="ghost"
            size="icon"
            onClick={handleSave}
          >
            <Save className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto p-4 space-y-6 ${isMobile ? 'pb-20' : ''}`}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              className="border-book-DEFAULT/20 focus:border-book-DEFAULT"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              className="border-book-DEFAULT/20 focus:border-book-DEFAULT"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
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
          <Label htmlFor="status">Status</Label>
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
          <Label htmlFor="rating">Rating</Label>
          <div className="flex items-center gap-4">
            <Slider
              id="rating"
              min={0}
              max={10}
              step={0.5}
              value={[rating]}
              onValueChange={(value) => setRating(parseFloat(value[0].toFixed(1)))}
              className="flex-1"
            />
            <span className="min-w-[60px] text-right">{rating.toFixed(1)}/10</span>
          </div>
          <div className="flex gap-1 mt-2">
            {renderRatingStars(rating)}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isFavorite"
            checked={isFavorite}
            onCheckedChange={(checked) => setIsFavorite(checked as boolean)}
          />
          <Label htmlFor="isFavorite" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Add to favorites
          </Label>
        </div>

        {book && <NoteSection book={book} onUpdateBook={onSave} />}
      </div>
    </div>
  );
}