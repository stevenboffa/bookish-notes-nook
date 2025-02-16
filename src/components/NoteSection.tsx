
import { useState, useEffect } from "react";
import { Book } from "./BookList";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface NoteSectionProps {
  book: Book;
  onUpdateBook: (book: Book) => void;
}

export function NoteSection({ book, onUpdateBook }: NoteSectionProps) {
  const [newNote, setNewNote] = useState("");
  const [localNotes, setLocalNotes] = useState(book.notes);

  // Sync local notes with book notes when they change
  useEffect(() => {
    setLocalNotes(book.notes);
  }, [book.notes]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const { data: noteData, error: noteError } = await supabase
        .from('notes')
        .insert({
          content: newNote,
          book_id: book.id,
        })
        .select()
        .single();

      if (noteError) throw noteError;

      const newNoteObject = {
        id: noteData.id,
        content: noteData.content,
        createdAt: noteData.created_at,
      };

      // Update local state immediately
      const updatedNotes = [newNoteObject, ...localNotes];
      setLocalNotes(updatedNotes);

      // Update parent component
      const updatedBook = {
        ...book,
        notes: updatedNotes,
      };

      onUpdateBook(updatedBook);
      setNewNote("");
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground italic">Organize your thoughts and notes for easy reference.</p>
          <div className="flex flex-col space-y-2">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              className="min-h-[100px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.metaKey) {
                  handleAddNote();
                }
              }}
            />
            <Button onClick={handleAddNote}>Add Note</Button>
          </div>
          <div className="space-y-2 mt-4">
            {localNotes.map((note) => (
              <div
                key={note.id}
                className="p-3 bg-white rounded-lg shadow animate-fade-in"
              >
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
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
