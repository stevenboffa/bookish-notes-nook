import { useState, useEffect } from "react";
import { AddNoteForm } from "./AddNoteForm";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Note, BookWithNotes } from "@/types/books";
import { useToast } from "@/hooks/use-toast";
import { NoteItem } from "./NoteItem";

interface NoteSectionProps {
  book: BookWithNotes;
  onUpdateBook: (book: BookWithNotes) => void;
}

export const NoteSection = ({ book, onUpdateBook }: NoteSectionProps) => {
  const [showForm, setShowForm] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (book.notes) {
      const formattedNotes = book.notes.map((note) => ({
        id: note.id,
        content: note.content,
        createdAt: note.createdAt,
        pageNumber: note.pageNumber,
        timestampSeconds: note.timestampSeconds,
        chapter: note.chapter,
        category: note.category,
        isPinned: note.isPinned,
        images: note.images || [],
        book_id: book.id,
      }));
      setNotes(formattedNotes);
    }
  }, [book.notes, book.id]);

  const handleAddNote = async (note: {
    content: string;
    pageNumber?: number;
    timestampSeconds?: number;
    chapter?: string;
    category?: string;
    images?: string[];
  }) => {
    try {
      console.log('Creating note with data:', note);

      const { data: newNote, error: createNoteError } = await supabase
        .from("notes")
        .insert({
          content: note.content,
          book_id: book.id,
          page_number: note.pageNumber,
          timestamp_seconds: note.timestampSeconds,
          chapter: note.chapter,
          category: note.category,
          images: note.images || [],
          is_pinned: false
        })
        .select('*')
        .single();

      if (createNoteError) {
        throw createNoteError;
      }

      console.log('New note created:', newNote);

      const formattedNote = {
        id: newNote.id,
        content: newNote.content,
        createdAt: newNote.created_at,
        pageNumber: newNote.page_number,
        timestampSeconds: newNote.timestamp_seconds,
        chapter: newNote.chapter,
        category: newNote.category,
        isPinned: newNote.is_pinned,
        images: newNote.images || [],
        book_id: newNote.book_id
      };

      setNotes((prevNotes) => [formattedNote, ...prevNotes]);
      setShowForm(false);

      // Update the book's notes in the parent component
      const bookNotes = [formattedNote, ...notes].map(note => ({
        id: note.id,
        content: note.content,
        createdAt: note.createdAt,
        pageNumber: note.pageNumber,
        timestampSeconds: note.timestampSeconds,
        chapter: note.chapter,
        category: note.category,
        isPinned: note.isPinned,
        images: note.images || [],
      }));
      
      onUpdateBook({ ...book, notes: bookNotes });

      toast({
        title: "Success",
        description: "Note added successfully",
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;

      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);

      // Update the book's notes in the parent component
      const bookNotes = updatedNotes.map(note => ({
        id: note.id,
        content: note.content,
        createdAt: note.createdAt,
        pageNumber: note.pageNumber,
        timestampSeconds: note.timestampSeconds,
        chapter: note.chapter,
        category: note.category,
        isPinned: note.isPinned,
        images: note.images || [],
      }));
      
      onUpdateBook({ ...book, notes: bookNotes });

      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const togglePin = async (noteId: string, currentPinned: boolean) => {
    try {
      const { data: updatedNote, error } = await supabase
        .from("notes")
        .update({ is_pinned: !currentPinned })
        .eq("id", noteId)
        .select()
        .single();

      if (error) throw error;

      const updatedNotes = notes.map((note) =>
        note.id === noteId
          ? { ...note, isPinned: updatedNote.is_pinned }
          : note
      );
      setNotes(updatedNotes);

      // Update the book's notes in the parent component
      const bookNotes = updatedNotes.map(note => ({
        id: note.id,
        content: note.content,
        createdAt: note.createdAt,
        pageNumber: note.pageNumber,
        timestampSeconds: note.timestampSeconds,
        chapter: note.chapter,
        category: note.category,
        isPinned: note.isPinned,
        images: note.images || [],
      }));
      
      onUpdateBook({ ...book, notes: bookNotes });

      toast({
        title: "Success",
        description: `Note ${updatedNote.is_pinned ? 'pinned' : 'unpinned'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notes</h3>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Note
        </Button>
      </div>

      {showForm && (
        <AddNoteForm
          bookId={book.id}
          onSubmit={handleAddNote}
          onCancel={() => setShowForm(false)}
        />
      )}

      {notes.length === 0 ? (
        <p className="text-sm text-gray-500">No notes added yet.</p>
      ) : (
        <div className="space-y-2">
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onDelete={deleteNote}
              onTogglePin={togglePin}
            />
          ))}
        </div>
      )}
    </div>
  );
};
