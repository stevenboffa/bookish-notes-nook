import { useState } from "react";
import { Book } from "./BookList";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NoteSectionProps {
  book: Book;
  onUpdateBook: (book: Book) => void;
}

export function NoteSection({ book, onUpdateBook }: NoteSectionProps) {
  const [newNote, setNewNote] = useState("");
  const { toast } = useToast();

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
      
      toast({
        title: "Note added",
        description: "Your note has been saved successfully",
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error adding note",
        description: "Please try again later",
        variant: "destructive",
      });
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
            {[...book.notes].reverse().map((note) => (
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