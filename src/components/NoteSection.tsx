import { useState } from "react";
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
      setLocalNotes(prevNotes => [newNoteObject, ...prevNotes]);

      // Update parent component
      const updatedBook = {
        ...book,
        notes: [newNoteObject, ...book.notes],
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
        <h2 className="text-2xl font-serif font-semibold">{book.title}</h2>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Notes</h3>
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