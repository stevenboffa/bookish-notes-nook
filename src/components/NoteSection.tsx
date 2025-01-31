import { useState } from "react";
import { Book, Note } from "./BookList";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pencil, Save, Trash, X } from "lucide-react";

interface NoteSectionProps {
  book: Book;
  onUpdateBook: (book: Book) => void;
}

export function NoteSection({ book, onUpdateBook }: NoteSectionProps) {
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [rating, setRating] = useState(book.rating);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const updatedBook = {
      ...book,
      notes: [
        ...book.notes,
        {
          id: Date.now().toString(),
          content: newNote,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    onUpdateBook(updatedBook);
    setNewNote("");
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedBook = {
      ...book,
      notes: book.notes.filter((note) => note.id !== noteId),
    };
    onUpdateBook(updatedBook);
  };

  const handleUpdateNote = (noteId: string) => {
    const updatedBook = {
      ...book,
      notes: book.notes.map((note) =>
        note.id === noteId
          ? { ...note, content: editedContent }
          : note
      ),
    };
    onUpdateBook(updatedBook);
    setEditingNote(null);
  };

  const handleRatingChange = (newRating: number) => {
    const validRating = Math.max(0, Math.min(10, newRating));
    setRating(validRating);
    const updatedBook = {
      ...book,
      rating: validRating,
    };
    onUpdateBook(updatedBook);
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold">{book.title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm">Rating:</span>
          <Input
            type="number"
            min="0"
            max="10"
            value={rating}
            onChange={(e) => handleRatingChange(Number(e.target.value))}
            className="w-20"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Textarea
          placeholder="Add a new note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAddNote}>Add Note</Button>
      </div>

      <div className="flex-1 overflow-auto">
        {book.notes.map((note) => (
          <Card key={note.id} className="mb-2">
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <CardDescription>
                  {new Date(note.createdAt).toLocaleString()}
                </CardDescription>
                <div className="flex gap-1">
                  {editingNote === note.id ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUpdateNote(note.id)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingNote(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingNote(note.id);
                          setEditedContent(note.content);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              {editingNote === note.id ? (
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="mt-2"
                />
              ) : (
                <CardContent className="p-0 mt-2">
                  {note.content}
                </CardContent>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}