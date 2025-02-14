
import { useState, useEffect } from "react";
import { Book } from "./BookList";
import { BookCover } from "./BookCover";
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
  "Fiction", "Non-Fiction", "Mystery", "Science Fiction", "Fantasy", 
  "Romance", "Thriller", "Horror", "Biography", "History", 
  "Self-Help", "Poetry", "Drama", "Adventure", "Children's",
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

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star 
            key={`star-${i}`} 
            className="w-5 h-5 fill-current text-yellow-400 cursor-pointer hover:scale-110 transition-transform" 
            onClick={() => setRating((i + 1) * 2)}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarHalf 
            key={`half-star-${i}`} 
            className="w-5 h-5 fill-current text-yellow-400 cursor-pointer hover:scale-110 transition-transform" 
            onClick={() => setRating(i * 2 + 1)}
          />
        );
      } else {
        stars.push(
          <Star 
            key={`empty-star-${i}`} 
            className="w-5 h-5 text-gray-300 cursor-pointer hover:scale-110 transition-transform" 
            onClick={() => setRating((i + 1) * 2)}
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold truncate text-text">{title}</h2>
          <p className="text-sm text-text-muted truncate">by {author}</p>
        </div>
        <div className="flex gap-2 ml-2">
          <Button 
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="h-9 px-4 bg-success hover:bg-success/90 text-success-foreground"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-9 w-9"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto ${isMobile ? 'pb-20' : ''}`}>
        {/* Book Cover and Quick Info Card */}
        <div className="p-4 bg-white border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex justify-center">
              <BookCover
                imageUrl={book?.imageUrl}
                thumbnailUrl={book?.thumbnailUrl}
                genre={book?.genre || ""}
                title={book?.title || ""}
                size="md"
                className="w-40 h-56"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <Select value={status} onValueChange={(value: BookStatus) => setStatus(value)}>
                  <SelectTrigger className="h-9 text-sm bg-accent text-accent-foreground">
                    <SelectValue>{status}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not started">Not started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Finished">Finished</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2 ml-2">
                  <Checkbox
                    id="isFavorite"
                    checked={isFavorite}
                    onCheckedChange={(checked) => setIsFavorite(checked as boolean)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isFavorite" className="text-sm cursor-pointer">
                    Favorite
                  </Label>
                </div>
              </div>
              
              <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium text-text-muted">Rating</Label>
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {renderRatingStars(rating)}
                  </div>
                  <div className="flex items-center gap-3">
                    <Slider
                      id="rating"
                      min={0}
                      max={10}
                      step={0.5}
                      value={[rating]}
                      onValueChange={(value) => setRating(parseFloat(value[0].toFixed(1)))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium text-text-muted min-w-[45px]">
                      {rating.toFixed(1)}/10
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Book Details Section */}
        <div className="p-4 space-y-4 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm text-text-muted">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                className="h-9 text-sm bg-gray-50 border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author" className="text-sm text-text-muted">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                className="h-9 text-sm bg-gray-50 border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre" className="text-sm text-text-muted">Genre</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="h-9 text-sm bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((g) => (
                    <SelectItem key={g} value={g} className="text-sm">
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mt-2">
          {book && <NoteSection book={book} onUpdateBook={onSave} />}
        </div>
      </div>
    </div>
  );
}
