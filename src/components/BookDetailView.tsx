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
import { X, Save, Star, StarHalf, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NoteSection } from "./NoteSection";
import { QuoteSection } from "./QuoteSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
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
        quotes: [], // Add this line to include the quotes array
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
    
    setShowSaveConfirmation(true);
    setTimeout(() => {
      setShowSaveConfirmation(false);
    }, 2000);
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
    <div className="flex flex-col h-full bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="flex justify-between items-center p-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-serif font-semibold truncate text-text animate-fade-in">{title}</h2>
          <p className="text-sm text-text-muted truncate italic">{author}</p>
        </div>
        <div className="flex gap-2 ml-2">
          <Button 
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="h-9 px-4 bg-gradient-to-r from-success to-success/90 text-success-foreground hover:opacity-90 transition-opacity relative"
          >
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showSaveConfirmation ? 'opacity-100' : 'opacity-0'}`}>
              <Check className="h-4 w-4" />
            </div>
            <div className={`flex items-center transition-opacity duration-300 ${showSaveConfirmation ? 'opacity-0' : 'opacity-100'}`}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </div>
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-9 w-9 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto ${isMobile ? 'pb-20' : ''}`}>
        <div className="p-6 bg-white border-b shadow-sm">
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex justify-center sm:justify-start">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent to-success/20 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-1000"></div>
                <BookCover
                  imageUrl={book?.imageUrl}
                  thumbnailUrl={book?.thumbnailUrl}
                  genre={book?.genre || ""}
                  title={book?.title || ""}
                  size="md"
                  className="relative w-48 h-64 transition-all duration-300 group-hover:scale-105 shadow-lg rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-center pb-4">
                  <p className="text-white text-sm font-medium px-3 py-1 bg-black/40 rounded-full backdrop-blur-sm">
                    {genre || "No genre selected"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Select value={status} onValueChange={(value: BookStatus) => setStatus(value)}>
                  <SelectTrigger className="h-9 text-sm bg-accent/80 text-accent-foreground hover:bg-accent transition-colors">
                    <SelectValue>{status}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not started">Not started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Finished">Finished</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFavorite"
                    checked={isFavorite}
                    onCheckedChange={(checked) => setIsFavorite(checked as boolean)}
                    className="h-4 w-4 text-primary"
                  />
                  <Label htmlFor="isFavorite" className="text-sm cursor-pointer hover:text-primary transition-colors">
                    Favorite
                  </Label>
                </div>
              </div>
              
              <div className="space-y-4 bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                <Label className="text-sm font-medium text-text-muted">Rating</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {renderRatingStars(rating)}
                    <span className="text-sm font-medium text-text-muted ml-2">
                      {rating.toFixed(1)}/10
                    </span>
                  </div>
                  <Slider
                    id="rating"
                    min={0}
                    max={10}
                    step={0.5}
                    value={[rating]}
                    onValueChange={(value) => setRating(parseFloat(value[0].toFixed(1)))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 bg-white">
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-colors">
              <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              Edit book details
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-text-muted">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter book title"
                    className="h-9 text-sm bg-gray-50/50 border-gray-200 hover:border-primary/30 transition-colors focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author" className="text-sm font-medium text-text-muted">Author</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter author name"
                    className="h-9 text-sm bg-gray-50/50 border-gray-200 hover:border-primary/30 transition-colors focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre" className="text-sm font-medium text-text-muted">Genre</Label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger className="h-9 text-sm bg-gray-50/50 border-gray-200 hover:border-primary/30 transition-colors">
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
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="mt-2">
          {book && (
            <Tabs defaultValue="notes" className="w-full">
              <div className="px-6 border-b">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="notes" className="flex-1 sm:flex-none">Notes</TabsTrigger>
                  <TabsTrigger value="quotes" className="flex-1 sm:flex-none">Quotes</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="notes">
                <NoteSection book={book} onUpdateBook={onSave} />
              </TabsContent>
              <TabsContent value="quotes">
                <QuoteSection book={book} onUpdateBook={onSave} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
