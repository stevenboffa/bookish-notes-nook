import { useState } from "react";
import { Book } from "./BookList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoteSectionProps {
  book: Book;
  onUpdateBook: (book: Book) => void;
}

export function NoteSection({ book, onUpdateBook }: NoteSectionProps) {
  const [newNote, setNewNote] = useState("");
  const [rating, setRating] = useState(book.rating);
  const [date, setDate] = useState<Date | undefined>(
    book.dateRead ? new Date(book.dateRead) : undefined
  );

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const updatedBook = {
      ...book,
      notes: [
        ...book.notes,
        {
          id: `temp_${Date.now()}`,
          content: newNote,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    onUpdateBook(updatedBook);
    setNewNote("");
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    onUpdateBook({ ...book, rating: newRating });
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      onUpdateBook({ ...book, dateRead: newDate.toISOString().split('T')[0] });
    }
  };

  const handleFavoriteChange = (checked: boolean) => {
    onUpdateBook({ ...book, isFavorite: checked });
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-semibold">{book.title}</h2>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="favorite"
              checked={book.isFavorite}
              onCheckedChange={handleFavoriteChange}
            />
            <label
              htmlFor="favorite"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <Star className={cn(
                "h-4 w-4",
                book.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
              )} />
            </label>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Rating</h3>
          <div className="flex space-x-1">
            {[...Array(10)].map((_, i) => (
              <Button
                key={i}
                variant={rating > i ? "default" : "outline"}
                className="h-8 w-8 p-0"
                onClick={() => handleRatingChange(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Notes</h3>
          <div className="flex space-x-2">
            <Input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              className="flex-1"
            />
            <Button onClick={handleAddNote}>Add Note</Button>
          </div>
          <div className="space-y-2 mt-4">
            {book.notes.map((note) => (
              <div
                key={note.id}
                className="p-3 bg-white rounded-lg shadow animate-fade-in"
              >
                <p className="text-sm">{note.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}