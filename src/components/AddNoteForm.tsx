
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

const NOTE_TYPES = [
  "plot",
  "character",
  "theme",
  "vocabulary",
  "question"
];

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {book.format === "physical_book" ? (
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Page number"
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              min="1"
              className="w-full"
            />
          </div>
        ) : book.format === "audiobook" ? (
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Time (MM:SS)"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              pattern="[0-9]{1,2}:[0-9]{2}"
              title="Format: MM:SS (eg: 12:34)"
              className="w-full"
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <Input
            placeholder="Chapter"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Note type" />
            </SelectTrigger>
            <SelectContent>
              {NOTE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={!content.trim()}>Add Note</Button>
    </form>
  );
}
