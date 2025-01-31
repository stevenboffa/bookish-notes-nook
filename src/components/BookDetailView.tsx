import { useState, useEffect } from "react";
import { Book } from "./BookList";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { X, Save, Star, StarHalf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NoteSection } from "./NoteSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BookStatus = "Not started" | "In Progress" | "Finished";

interface BookDetailViewProps {
  book: Book | null;
  onSave: (book: Book) => void;
  onClose: () => void;
}

export function BookDetailView({ book, onSave, onClose }: BookDetailViewProps) {
  const [status, setStatus] = useState<BookStatus>(book?.status as BookStatus || "Not started");
  const [rating, setRating] = useState(book?.rating || 0);
  const navigate = useNavigate();

  useEffect(() => {
    if (book) {
      setStatus(book.status as BookStatus);
      setRating(parseFloat(String(book.rating)) || 0);
    }
  }, [book]);

  const handleSave = () => {
    if (!book) return;
    
    const updatedBook = {
      ...book,
      status,
      rating: parseFloat(rating.toFixed(1)),
    };
    onSave(updatedBook);
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

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return "bg-emerald-500 text-white";
    if (rating >= 7) return "bg-green-500 text-white";
    if (rating >= 5) return "bg-yellow-500 text-white";
    if (rating >= 3) return "bg-orange-500 text-white";
    return "bg-red-500 text-white";
  };

  if (!book) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{book.title}</h2>
          <p className="text-gray-600">by {book.author}</p>
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
                onValueChange={(value) => setRating(parseFloat(value[0].toFixed(1)))}
                className="flex-1"
              />
              <span className={`min-w-[60px] text-right px-2 py-1 rounded ${getRatingColor(rating)}`}>
                {rating.toFixed(1)}/10
              </span>
            </div>
            <div className="flex gap-1 mt-2">
              {renderRatingStars(rating)}
            </div>
          </div>
        </div>

        <NoteSection book={book} onUpdateBook={onSave} />
      </div>
    </div>
  );
}