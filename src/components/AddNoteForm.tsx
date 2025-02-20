
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book } from "./BookList";

interface AddNoteFormProps {
  book: Book;
  onSubmit: (note: {
    content: string;
    pageNumber?: number;
    timestampSeconds?: number;
    chapter?: string;
    category?: string;
  }) => void;
}

export function AddNoteForm({ book, onSubmit }: AddNoteFormProps) {
  const [content, setContent] = useState("");
  const [pageNumber, setPageNumber] = useState<string>("");
  const [timestamp, setTimestamp] = useState<string>("");
  const [chapter, setChapter] = useState("");
  const [category, setCategory] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const note: any = { content };
    
    if (book.format === "physical_book" && pageNumber) {
      note.pageNumber = parseInt(pageNumber);
    } else if (book.format === "audiobook" && timestamp) {
      // Convert MM:SS to seconds
      const [minutes, seconds] = timestamp.split(":").map(Number);
      note.timestampSeconds = minutes * 60 + seconds;
    }
    
    if (chapter) note.chapter = chapter;
    if (category) note.category = category;

    onSubmit(note);
    
    // Reset form
    setContent("");
    setPageNumber("");
    setTimestamp("");
    setChapter("");
    setCategory("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note..."
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {book.format === "physical_book" && (
          <div>
            <Input
              type="number"
              placeholder="Page number"
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              min="1"
            />
          </div>
        )}

        {book.format === "audiobook" && (
          <div>
            <Input
              type="text"
              placeholder="Timestamp (MM:SS)"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              pattern="[0-9]{1,2}:[0-9]{2}"
              title="Format: MM:SS (eg: 12:34)"
            />
          </div>
        )}

        <Input
          placeholder="Chapter"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
        />

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="plot">Plot</SelectItem>
            <SelectItem value="character">Character</SelectItem>
            <SelectItem value="theme">Theme</SelectItem>
            <SelectItem value="quote">Quote</SelectItem>
            <SelectItem value="vocabulary">Vocabulary</SelectItem>
            <SelectItem value="question">Question</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={!content.trim()}>Add Note</Button>
    </form>
  );
}
