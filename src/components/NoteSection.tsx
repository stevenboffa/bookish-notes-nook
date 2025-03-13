
import { useState, useEffect, useMemo } from "react";
import { AddNoteForm } from "./AddNoteForm";
import { supabase } from "@/integrations/supabase/client";
import { Note, BookWithNotes } from "@/types/books";
import { useToast } from "@/hooks/use-toast";
import { NoteItem } from "./NoteItem";
import { FilterNotes } from "./FilterNotes";

interface NoteSectionProps {
  book: BookWithNotes;
  onUpdateBook: (book: BookWithNotes) => void;
}

export const NoteSection = ({ book, onUpdateBook }: NoteSectionProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filter, setFilter] = useState<{
    type?: string;
    chapter?: string;
    timestampStart?: number;
    timestampEnd?: number;
  }>({});
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
            variant: "destructive"
          });
          return;
        }

        if (notesData) {
          const formattedNotes = notesData.map(note => ({
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
            book_id: note.book_id
          }));
          setNotes(formattedNotes);
          onUpdateBook({
            ...book,
            notes: formattedNotes
          });
        }
      }
    };

    loadNotes();
  }, [book.id]);

  // Extract unique note types and chapters for filter options
  const noteTypes = useMemo(() => {
    const types = new Set<string>();
    notes.forEach(note => {
      if (note.noteType) types.add(note.noteType);
    });
    return Array.from(types);
  }, [notes]);

  const chapters = useMemo(() => {
    const chapterSet = new Set<string>();
    notes.forEach(note => {
      if (note.chapter) chapterSet.add(note.chapter);
    });
    return Array.from(chapterSet);
  }, [notes]);

  // Apply filters to notes
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      // Filter by note type
      if (filter.type && note.noteType !== filter.type) {
        return false;
      }
      
      // Filter by chapter
      if (filter.chapter && note.chapter !== filter.chapter) {
        return false;
      }
      
      // Filter by timestamp range (for audiobooks)
      if (filter.timestampStart !== undefined && 
          (note.timestampSeconds === undefined || note.timestampSeconds < filter.timestampStart)) {
        return false;
      }
      
      if (filter.timestampEnd !== undefined && 
          (note.timestampSeconds === undefined || note.timestampSeconds > filter.timestampEnd)) {
        return false;
      }
      
      return true;
    });
  }, [notes, filter]);

  const handleAddNote = async (note: {
    content: string;
    pageNumber?: number;
    timestampSeconds?: number;
    chapter?: string;
    images?: string[];
    noteType?: string;
  }) => {
    try {
      console.log('Creating note with data:', note);
      
      // Use empty string for content if only images are provided
      const content = note.content.trim() || (note.images && note.images.length > 0 ? "" : null);
      
      // Validate that at least images or content is provided
      if (!content && (!note.images || note.images.length === 0)) {
        toast({
          title: "Error",
          description: "Please add text or at least one image to create a note.",
          variant: "destructive"
        });
        return;
      }
      
      const { data: newNote, error: createNoteError } = await supabase
        .from("notes")
        .insert({
          content: content,
          book_id: book.id,
          page_number: note.pageNumber,
          timestamp_seconds: note.timestampSeconds,
          chapter: note.chapter,
          images: note.images || [],
          note_type: note.noteType,
          is_pinned: false
        })
        .select('*')
        .single();

      if (createNoteError) throw createNoteError;

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

      setNotes(prevNotes => [formattedNote, ...prevNotes]);
      onUpdateBook({
        ...book,
        notes: [formattedNote, ...notes]
      });

      toast({
        title: "Success",
        description: "Note added successfully"
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    try {
      console.log('Updating note with data:', updates);
      
      const updatePayload: any = {};
      if (updates.content !== undefined) updatePayload.content = updates.content;
      if (updates.noteType !== undefined) updatePayload.note_type = updates.noteType;
      if (updates.pageNumber !== undefined) updatePayload.page_number = updates.pageNumber;
      if (updates.timestampSeconds !== undefined) updatePayload.timestamp_seconds = updates.timestampSeconds;
      if (updates.chapter !== undefined) updatePayload.chapter = updates.chapter;
      
      const { data, error } = await supabase
        .from("notes")
        .update(updatePayload)
        .eq("id", noteId)
        .select('*')
        .single();

      if (error) throw error;

      console.log('Updated note:', data);
      const updatedNotes = notes.map(note => {
        if (note.id === noteId) {
          return {
            ...note,
            content: updates.content !== undefined ? updates.content : note.content,
            noteType: updates.noteType !== undefined ? updates.noteType : note.noteType,
            pageNumber: updates.pageNumber !== undefined ? updates.pageNumber : note.pageNumber,
            timestampSeconds: updates.timestampSeconds !== undefined ? updates.timestampSeconds : note.timestampSeconds,
            chapter: updates.chapter !== undefined ? updates.chapter : note.chapter,
          };
        }
        return note;
      });

      setNotes(updatedNotes);
      onUpdateBook({
        ...book,
        notes: updatedNotes
      });

      toast({
        title: "Success",
        description: "Note updated successfully"
      });
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { data: noteToDelete, error: fetchError } = await supabase
        .from("notes")
        .select('images, audio_url')
        .eq("id", noteId)
        .single();

      if (fetchError) throw fetchError;

      // Delete images if any
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

      // Delete audio if any
      if (noteToDelete?.audio_url) {
        try {
          const audioPath = new URL(noteToDelete.audio_url).pathname.split('/').pop();
          if (audioPath) {
            const { error: audioStorageError } = await supabase.storage
              .from('note-audios')
              .remove([audioPath]);

            if (audioStorageError) {
              console.error('Error deleting audio:', audioStorageError);
            }
          }
        } catch (e) {
          console.error('Invalid audio URL:', noteToDelete.audio_url);
        }
      }

      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;

      const updatedNotes = notes.filter(note => note.id !== noteId);
      setNotes(updatedNotes);
      onUpdateBook({
        ...book,
        notes: updatedNotes
      });

      toast({
        title: "Success",
        description: "Note deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive"
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

      const updatedNotes = notes.map(note =>
        note.id === noteId ? { ...note, isPinned: updatedNote.is_pinned } : note
      );

      setNotes(updatedNotes);
      onUpdateBook({
        ...book,
        notes: updatedNotes
      });

      toast({
        title: "Success",
        description: `Note ${updatedNote.is_pinned ? 'pinned' : 'unpinned'} successfully`
      });
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive"
      });
    }
  };

  const hasFiltersApplied = Object.values(filter).some(Boolean);
  const clearFilters = () => setFilter({});

  return (
    <div className="space-y-5 px-4 sm:px-6">
      <h3 className="text-gray-900 tracking-tight text-base text-center font-medium">
        Add meaningful notes, quotes, and upload images you find interesting
      </h3>
      
      <AddNoteForm bookId={book.id} bookFormat={book.format} onSubmit={handleAddNote} />

      {notes.length > 0 && (
        <FilterNotes
          filter={filter}
          onFilterChange={setFilter}
          noteTypes={noteTypes}
          chapters={chapters}
          bookFormat={book.format}
          hasFiltersApplied={hasFiltersApplied}
          onClearFilters={clearFilters}
        />
      )}

      {filteredNotes.length === 0 ? (
        <p className="text-sm text-gray-500 font-normal">
          {notes.length === 0 ? "No notes added yet." : "No notes match your filters."}
        </p>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map(note => (
            <NoteItem 
              key={note.id} 
              note={note} 
              onDelete={deleteNote} 
              onTogglePin={togglePin} 
              onUpdateNote={updateNote}
              bookFormat={book.format}
            />
          ))}
        </div>
      )}
    </div>
  );
};
