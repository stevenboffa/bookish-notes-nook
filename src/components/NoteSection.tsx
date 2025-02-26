
import { useState, useEffect } from "react";
import { AddNoteForm } from "./AddNoteForm";
import { supabase } from "@/integrations/supabase/client";
import { Note, BookWithNotes } from "@/types/books";
import { useToast } from "@/hooks/use-toast";
import { NoteItem } from "./NoteItem";

interface NoteSectionProps {
  book: BookWithNotes;
  onUpdateBook: (book: BookWithNotes) => void;
}

export const NoteSection = ({ book, onUpdateBook }: NoteSectionProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadNotes = async () => {
      if (book.id) {
        const { data: notesData, error } = await supabase
          .from("notes")
          .select("*")
          .eq("book_id", book.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error('Error loading notes:', error);
          toast({
            title: "Error",
            description: "Failed to load notes. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (notesData) {
          const formattedNotes = notesData.map((note) => ({
            id: note.id,
            content: note.content,
            createdAt: note.created_at,
            pageNumber: note.page_number,
            timestampSeconds: note.timestamp_seconds,
            chapter: note.chapter,
            category: note.category,
            isPinned: note.is_pinned,
            images: note.images || [],
            noteType: note.note_type,
            book_id: note.book_id,
          }));
          setNotes(formattedNotes);
          onUpdateBook({ ...book, notes: formattedNotes });
        }
      }
    };

    loadNotes();
  }, [book.id]);

  const handleAddNote = async (note: {
    content: string;
    pageNumber?: number;
    timestampSeconds?: number;
    chapter?: string;
    category?: string;
    images?: string[];
    noteType?: string;
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
          note_type: note.noteType,
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
        noteType: newNote.note_type,
        book_id: newNote.book_id
      };

      setNotes((prevNotes) => [formattedNote, ...prevNotes]);

      onUpdateBook({
        ...book,
        notes: [formattedNote, ...notes],
      });

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
      // First, get the note to retrieve its images
      const { data: noteToDelete, error: fetchError } = await supabase
        .from("notes")
        .select('images')
        .eq("id", noteId)
        .single();

      if (fetchError) throw fetchError;

      // Delete the images from storage if they exist
      if (noteToDelete?.images && noteToDelete.images.length > 0) {
        const imagePaths = noteToDelete.images.map(url => {
          try {
            const path = new URL(url).pathname.split('/').pop();
            return path;
          } catch (e) {
            console.error('Invalid image URL:', url);
            return null;
          }
        }).filter(Boolean);

        if (imagePaths.length > 0) {
          const { error: storageError } = await supabase.storage
            .from('note-images')
            .remove(imagePaths);

          if (storageError) {
            console.error('Error deleting images:', storageError);
          }
        }
      }

      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;

      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);

      onUpdateBook({
        ...book,
        notes: updatedNotes,
      });

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

      onUpdateBook({
        ...book,
        notes: updatedNotes,
      });

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
    <div className="space-y-6 px-4 sm:px-6">
      <h3 className="text-lg font-normal text-gray-900 tracking-tight">Organize your thoughts and notes.</h3>
      
      <AddNoteForm
        bookId={book.id}
        onSubmit={handleAddNote}
      />

      {notes.length === 0 ? (
        <p className="text-sm text-gray-500 font-normal">No notes added yet.</p>
      ) : (
        <div className="space-y-4">
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

