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

      const updatedBook = {
        ...book,
        notes: [
          ...book.notes,
          {
            id: noteData.id,
            content: noteData.content,
            createdAt: noteData.created_at,
          },
        ],
      };

      onUpdateBook(updatedBook);
      setNewNote("");
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Notes</h3>
      <div className="flex flex-col space-y-2">
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          className="min-h-[100px] resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.metaKey) {
              handleAddNote();
            }
          }}
        />
        <Button 
          onClick={handleAddNote}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white"
        >
          Add Note
        </Button>
      </div>
      <div className="space-y-2 mt-4">
        {book.notes.map((note) => (
          <div
            key={note.id}
            className="p-3 bg-gray-50 rounded-lg animate-fade-in"
          >
            <p className="text-sm whitespace-pre-wrap">{note.content}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}