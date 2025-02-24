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
  images?: string[];
}

interface NoteSectionProps {
  book: Book;
  onUpdateBook: (bookId: string, updatedBook: Book) => void;
}

export function NoteSection({ book, onUpdateBook }: NoteSectionProps) {
  const [notes, setNotes] = useState<Note[]>(book.notes || []);
  const { toast } = useToast();

  useEffect(() => {
    setNotes(book.notes || []);
  }, [book.notes]);

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
          const { data, error } = await supabase.storage
            .from('note-images')
            .upload(`${book.id}/${Date.now()}-${image.name}`, image, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) {
            console.error("Error uploading image:", error);
            toast({
              title: "Error uploading image",
              description: "Please try again.",
              variant: "destructive",
            });
            return;
          }

          const publicURL = supabase.storage
            .from('note-images')
            .getPublicUrl(data.path).data.publicUrl;
          imageUrls.push(publicURL);
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
        })
        .select("*")
        .single();

      if (createNoteError) {
        console.error("Error creating note:", createNoteError);
        toast({
          title: "Error creating note",
          description: "Please try again.",
          variant: "destructive",
        });
        return;
      }

      const newNotes = [...notes, {
        id: newNote.id,
        content: newNote.content,
        created_at: newNote.created_at,
        page_number: newNote.page_number,
        timestamp_seconds: newNote.timestamp_seconds,
        chapter: newNote.chapter,
        category: newNote.category,
        is_pinned: false,
        images: newNote.images,
      }];
      setNotes(newNotes);

      const updatedBook = { ...book, notes: newNotes };
      onUpdateBook(book.id, updatedBook);

      toast({
        title: "Note added",
        description: "Your note has been successfully added.",
      });
    } catch (error: any) {
      console.error("Error adding note:", error);
      toast({
        title: "Error adding note",
        description: error.message || "Failed to add note. Please try again.",
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

      if (deleteNoteError) {
        console.error("Error deleting note:", deleteNoteError);
        toast({
          title: "Error deleting note",
          description: "Please try again.",
          variant: "destructive",
        });
        return;
      }

      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
      onUpdateBook(book.id, { ...book, notes: updatedNotes });

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
      if (!noteToUpdate) {
        toast({
          title: "Error updating note",
          description: "Note not found.",
          variant: "destructive",
        });
        return;
      }

      const { error: updateNoteError } = await supabase
        .from("notes")
        .update({ is_pinned: !noteToUpdate.is_pinned })
        .eq("id", noteId);

      if (updateNoteError) {
        console.error("Error updating note:", updateNoteError);
        toast({
          title: "Error updating note",
          description: "Please try again.",
          variant: "destructive",
        });
        return;
      }

      const updatedNotes = notes.map((note) =>
        note.id === noteId ? { ...note, is_pinned: !note.is_pinned } : note
      );
      setNotes(updatedNotes);

      const updatedBook = { ...book, notes: updatedNotes };
      onUpdateBook(book.id, updatedBook);

      toast({
        title: "Note updated",
        description: "Your note has been successfully updated.",
      });
    } catch (error: any) {
      console.error("Error updating note:", error);
      toast({
        title: "Error updating note",
        description: error.message || "Failed to update note. Please try again.",
        variant: "destructive",
      });
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
                  {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
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
