import { useState, useEffect, useCallback } from "react";
import { Book, BookWithNotes, Note, Collection } from "@/types/books";
import { BookCover } from "./BookCover";
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
import { X, Save, Star, StarHalf, Check, ChevronDown, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NoteSection } from "./NoteSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RecommendBookDialog } from "./friends/RecommendBookDialog";

const genres = [
  "Fiction", "Non-Fiction", "Mystery", "Science Fiction", "Fantasy", 
  "Romance", "Thriller", "Horror", "Biography", "History", 
  "Self-Help", "Poetry", "Drama", "Adventure", "Children's",
];

interface BookDetailViewProps {
  book: Book | null;
  onSave: (book: Book) => void;
  onClose: () => void;
  initialOpenDetails?: boolean;
  collections: Collection[];
}

type BookStatus = "Not started" | "In progress" | "Finished";
type BookFormat = "physical_book" | "audiobook";

export function BookDetailView({ 
  book, 
  onSave, 
  onClose, 
  initialOpenDetails = false,
  collections = []
}: BookDetailViewProps) {
  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [genre, setGenre] = useState(book?.genre || "");
  const [status, setStatus] = useState<BookStatus>(book?.status as BookStatus || "Not started");
  const [format, setFormat] = useState<BookFormat | "">("");
  const [rating, setRating] = useState(book?.rating || 0);
  const [description, setDescription] = useState(book?.description || "");
  const [selectedCollections, setSelectedCollections] = useState<string[]>(book?.collections || []);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(initialOpenDetails);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const updateBookState = useCallback((bookData: Book | null) => {
    if (bookData) {
      setTitle(bookData.title);
      setAuthor(bookData.author);
      setGenre(bookData.genre);
      setStatus(bookData.status as BookStatus);
      setFormat(bookData.format as BookFormat || "");
      setRating(parseFloat(String(bookData.rating)) || 0);
      setDescription(bookData.description || "");
      setSelectedCollections(bookData.collections || []);
      
      console.log('Book collections loaded:', bookData.collections);
    }
  }, []);

  useEffect(() => {
    if (book) {
      updateBookState(book);
    }
  }, [book, updateBookState]);

  const truncateDescription = (text: string, wordCount = 30) => {
    if (!text) return "";
    const words = text.split(/\s+/);
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(" ") + "...";
  };

  const handleSave = async () => {
    if (!format) {
      return;
    }

    console.log('Collections being saved:', selectedCollections);

    if (!book) {
      const newBook: Book = {
        id: crypto.randomUUID(),
        title,
        author,
        genre,
        status,
        format,
        rating: parseFloat(rating.toFixed(1)),
        notes: [],
        quotes: [],
        dateRead: new Date().toISOString().split('T')[0],
        isFavorite: false,
        imageUrl: null,
        thumbnailUrl: null,
        description: description,
        collections: selectedCollections,
      };
      onSave(newBook);
    } else {
      const updatedBook = {
        ...book,
        title,
        author,
        genre,
        status,
        format,
        rating: parseFloat(rating.toFixed(1)),
        description: description,
        collections: selectedCollections,
      };
      onSave(updatedBook);
    }
    
    setShowSaveConfirmation(true);
    setTimeout(() => {
      setShowSaveConfirmation(false);
    }, 2000);
  };

  const handleCollectionChange = (collectionId: string, isChecked: boolean) => {
    console.log('Collection change:', { collectionId, isChecked });
    
    if (isChecked) {
      const newCollections = [...selectedCollections, collectionId];
      console.log('Updated collections (add):', newCollections);
      setSelectedCollections(newCollections);
    } else {
      const newCollections = selectedCollections.filter(id => id !== collectionId);
      console.log('Updated collections (remove):', newCollections);
      setSelectedCollections(newCollections);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const sanitizedFileName = `${crypto.randomUUID()}.${fileExt}`;
      
      console.log('Uploading image:', {
        fileName: sanitizedFileName,
        fileType: file.type,
        fileSize: file.size
      });

      const { data: uploadedImage, error: uploadError } = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: sanitizedFileName,
          fileType: file.type
        })
      }).then(res => res.json());

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        toast.error('Failed to upload image. Please try again.');
        return;
      }

      if (uploadedImage?.url) {
        console.log('Image uploaded successfully:', {
          url: uploadedImage.url,
          path: sanitizedFileName
        });
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }

    e.target.value = '';
  };

  const handleUpdateBook = (updatedBook: BookWithNotes) => {
    const bookWithUpdatedNotes: Book = {
      ...updatedBook
    };
    onSave(bookWithUpdatedNotes);
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

  const currentBookWithFormat = book ? {
    ...book,
    format: format as BookFormat || book.format,
  } : null;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="flex justify-between items-center p-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-serif font-semibold truncate text-text animate-fade-in">{title}</h2>
          <p className="text-sm text-text-muted truncate italic">{author}</p>
        </div>
        <div className="flex gap-2 ml-2">
          {book && <RecommendBookDialog book={book} />}
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

      <div className={`flex-1 overflow-y-auto pb-20 ${isMobile ? '' : 'px-6'}`}>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label 
                    htmlFor="status" 
                    className="text-sm font-medium text-gray-700 block mb-1 tracking-wide"
                  >
                    Reading Status
                  </Label>
                  <Select value={status} onValueChange={(value: BookStatus) => setStatus(value)}>
                    <SelectTrigger 
                      id="status"
                      className="h-9 text-sm bg-accent/80 text-accent-foreground hover:bg-accent transition-colors"
                    >
                      <SelectValue>{status}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not started">Not started</SelectItem>
                      <SelectItem value="In progress">In progress</SelectItem>
                      <SelectItem value="Finished">Finished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="format" 
                    className="text-sm font-medium text-gray-700 block mb-1 tracking-wide"
                  >
                    Book Type
                  </Label>
                  <Select value={format} onValueChange={(value: BookFormat) => setFormat(value)}>
                    <SelectTrigger 
                      id="format"
                      className="h-9 text-sm bg-accent/80 text-accent-foreground hover:bg-accent transition-colors"
                    >
                      <SelectValue placeholder="Select type">
                        {format === "physical_book" ? "Book" : format === "audiobook" ? "Audiobook" : "Select type"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physical_book">Book</SelectItem>
                      <SelectItem value="audiobook">Audiobook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700 flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    Collections
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs bg-accent/20 text-accent-foreground hover:bg-accent/30"
                      >
                        Manage collections
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4">
                      <h4 className="text-sm font-medium mb-3">Add to collections</h4>
                      {collections.length > 0 ? (
                        <div className="space-y-2">
                          {collections.map((collection) => (
                            <div key={collection.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`collection-${collection.id}`}
                                checked={selectedCollections.includes(collection.id)}
                                onCheckedChange={(checked) => 
                                  handleCollectionChange(collection.id, checked === true)
                                }
                              />
                              <label 
                                htmlFor={`collection-${collection.id}`}
                                className="text-sm text-gray-700 cursor-pointer"
                              >
                                {collection.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No collections created yet. Create collections in the dashboard sidebar.
                        </p>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedCollections.length > 0 ? (
                    selectedCollections.map(collectionId => {
                      const collection = collections.find(c => c.id === collectionId);
                      return collection ? (
                        <Badge 
                          key={collection.id} 
                          variant="outline" 
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          {collection.name}
                          <button 
                            className="ml-1 text-primary/70 hover:text-primary"
                            onClick={() => handleCollectionChange(collection.id, false)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })
                  ) : (
                    <span className="text-xs text-gray-500 italic">
                      No collections assigned
                    </span>
                  )}
                </div>
              </div>

              <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium text-text-muted hover:text-primary transition-all group w-full">
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDetailsOpen ? 'rotate-180' : ''} group-hover:text-primary`} />
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">Edit book details</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-6 px-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50/50 rounded-lg border border-gray-100">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium text-text-muted">Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter book title"
                        className="h-9 text-sm bg-white border-gray-200 hover:border-primary/30 transition-colors focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author" className="text-sm font-medium text-text-muted">Author</Label>
                      <Input
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Enter author name"
                        className="h-9 text-sm bg-white border-gray-200 hover:border-primary/30 transition-colors focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="genre" className="text-sm font-medium text-text-muted">Genre</Label>
                      <Select value={genre} onValueChange={setGenre}>
                        <SelectTrigger className="h-9 text-sm bg-white border-gray-200 hover:border-primary/30 transition-colors">
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

          <div className="mt-6 prose prose-sm max-w-none">
            <div className="text-gray-700 leading-relaxed">
              {showFullDescription ? (
                <p>{description}</p>
              ) : (
                <p>{truncateDescription(description)}</p>
              )}
              {description && description.split(/\s+/).length > 30 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="flex items-center gap-1 text-primary hover:text-primary/80 font-medium mt-2 transition-colors"
                >
                  {showFullDescription ? (
                    <>Show less</>
                  ) : (
                    <>Show more<ChevronDown className="h-4 w-4" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-2 pb-24">
          {currentBookWithFormat && format && (
            <div className="w-full">
              <NoteSection 
                book={{
                  ...currentBookWithFormat,
                  format: format as BookFormat,
                  notes: currentBookWithFormat.notes || []
                }} 
                onUpdateBook={handleUpdateBook} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
