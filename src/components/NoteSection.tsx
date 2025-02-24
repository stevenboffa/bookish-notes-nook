
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Pin, Trash2 } from "lucide-react";
import { Book } from "@/components/BookList";
import { AddNoteForm } from "@/components/AddNoteForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Note {
  id: string;
  content: string;
  created_at: string;
  page_number?: number;
  timestamp_seconds?: number;
  chapter?: string;
  category?: string;
  is_pinned: boolean;
  book_id: string;
  tags?: string[];
  reading_progress?: number;
  images?: string[];
}

interface NoteSectionProps {
  book: Book;
  onUpdateBook: (book: Book) => void;
}

export function NoteSection({ book, onUpdateBook }: NoteSectionProps) {
  const [notes, setNotes] = useState<Note[]>([]); // Initialize as empty array
  const { toast } = useToast();

  useEffect(() => {
    if (book.notes) {
      const formattedNotes: Note[] = book.notes.map(note => ({
        id: note.id,
        content: note.content,
        created_at: note.createdAt,
        page_number: note.pageNumber,
        timestamp_seconds: note.timestampSeconds,
        chapter: note.chapter,
        category: note.category,
        is_pinned: note.isPinned,
        book_id: book.id,
        images: note.images,
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
    images?: File[];
  }) => {
    try {
      const imageUrls: string[] = [];
      
      if (note.images && note.images.length > 0) {
        for (const image of note.images) {
          const fileName = `${book.id}/${Date.now()}-${image.name}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('note-images')
            .upload(fileName, image);

          if (uploadError) {
            console.error("Error uploading image:", uploadError);
            throw new Error('Failed to upload image');
          }

          const { data: { publicUrl } } = supabase.storage
            .from('note-images')
            .getPublicUrl(fileName);

          imageUrls.push(publicUrl);
        }
      }

      const { data: newNote, error: createNoteError } = await supabase
        .from("notes")
        .insert({
          book_id: book.id,
          content: note.content,
          page_number: note.pageNumber,
          timestamp_seconds: note.timestampSeconds,
          chapter: note.chapter,
          category: note.category,
          images: imageUrls,
          is_pinned: false
        })
        .select()
        .single();

      if (createNoteError) {
        console.error("Error creating note:", createNoteError);
        throw new Error('Failed to create note');
      }

      const newNoteFormatted: Note = {
        id: newNote.id,
        content: newNote.content,
        created_at: newNote.created_at,
        page_number: newNote.page_number,
        timestamp_seconds: newNote.timestamp_seconds,
        chapter: newNote.chapter,
        category: newNote.category,
        is_pinned: newNote.is_pinned,
        images: newNote.images,
        book_id: newNote.book_id
      };

      const updatedNotes = [...notes, newNoteFormatted];
      setNotes(updatedNotes);
      
      // Convert Note[] to Book's note format for the parent component
      const bookNotes = updatedNotes.map(note => ({
        id: note.id,
        content: note.content,
        createdAt: note.created_at,
        pageNumber: note.page_number,
        timestampSeconds: note.timestamp_seconds,
        chapter: note.chapter,
        category: note.category,
        isPinned: note.is_pinned,
        images: note.images,
      }));
      
      onUpdateBook({ ...book, notes: bookNotes });

      toast({
        title: "Note added",
        description: "Your note has been successfully added.",
      });
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Error adding note",
        description: error instanceof Error ? error.message : "Failed to add note",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error: deleteNoteError } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId);

      if (deleteNoteError) throw deleteNoteError;

      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
      
      const bookNotes = updatedNotes.map(note => ({
        id: note.id,
        content: note.content,
        createdAt: note.created_at,
        pageNumber: note.page_number,
        timestampSeconds: note.timestamp_seconds,
        chapter: note.chapter,
        category: note.category,
        isPinned: note.is_pinned,
        images: note.images,
      }));
      
      onUpdateBook({ ...book, notes: bookNotes });

      toast({
        title: "Note deleted",
        description: "Your note has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error deleting note",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePin = async (noteId: string) => {
    try {
      const noteToUpdate = notes.find((note) => note.id === noteId);
      if (!noteToUpdate) throw new Error('Note not found');

      const { error: updateNoteError } = await supabase
        .from("notes")
        .update({ is_pinned: !noteToUpdate.is_pinned })
        .eq("id", noteId);

      if (updateNoteError) throw updateNoteError;

      const updatedNotes = notes.map((note) =>
        note.id === noteId ? { ...note, is_pinned: !note.is_pinned } : note
      );
      setNotes(updatedNotes);

      const bookNotes = updatedNotes.map(note => ({
        id: note.id,
        content: note.content,
        createdAt: note.created_at,
        pageNumber: note.page_number,
        timestampSeconds: note.timestamp_seconds,
        chapter: note.chapter,
        category: note.category,
        isPinned: note.is_pinned,
        images: note.images,
      }));
      
      onUpdateBook({ ...book, notes: bookNotes });

      toast({
        title: "Note updated",
        description: "Your note has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating note:", error);
      toast({
        title: "Error updating note",
        description: error instanceof Error ? error.message : "Failed to update note",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return 'Invalid date';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-4">
      <AddNoteForm book={book} onSubmit={handleAddNote} />
      
      <div className="space-y-4">
        {sortedNotes.map((note) => (
          <Card key={note.id} className="relative">
            <CardContent className="p-4 space-y-4">
              {note.is_pinned && (
                <div className="absolute top-2 right-2">
                  <Pin className="w-4 h-4 text-primary" />
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1">
                    <p className="whitespace-pre-wrap">{note.content}</p>
                    {note.images && note.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {note.images.map((imageUrl, index) => (
                          <img
                            key={index}
                            src={imageUrl}
                            alt={`Note image ${index + 1}`}
                            className="w-full h-40 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    )}
                    {(note.page_number || note.timestamp_seconds || note.chapter) && (
                      <div className="flex gap-2 text-sm text-muted-foreground mt-2">
                        {note.page_number && <span>Page {note.page_number}</span>}
                        {note.timestamp_seconds && (
                          <span>
                            {Math.floor(note.timestamp_seconds / 60)}:
                            {(note.timestamp_seconds % 60).toString().padStart(2, "0")}
                          </span>
                        )}
                        {note.chapter && <span>Chapter: {note.chapter}</span>}
                      </div>
                    )}
                    {note.category && (
                      <Badge variant="secondary" className="mt-2">
                        {note.category}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleTogglePin(note.id)}
                      className={note.is_pinned ? "text-primary" : ""}
                    >
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {formatDate(note.created_at)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {notes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No notes yet. Add your first note above!
          </div>
        )}
      </div>
    </div>
  );
}
