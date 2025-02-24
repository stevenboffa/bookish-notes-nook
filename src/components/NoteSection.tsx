
import { useState, useEffect } from "react";
import { Book } from "./BookList";
import { Button } from "@/components/ui/button";
import { AddNoteForm } from "./AddNoteForm";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Pin, Clock, BookOpen, Image } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NoteSectionProps {
  book: Book;
  onUpdateBook: (book: Book) => void;
}

export function NoteSection({ book, onUpdateBook }: NoteSectionProps) {
  const [localNotes, setLocalNotes] = useState(book.notes);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'page' | 'chapter'>('newest');

  useEffect(() => {
    setLocalNotes(book.notes);
  }, [book.notes]);

  const handleAddNote = async (noteData: {
    content: string;
    pageNumber?: number;
    timestampSeconds?: number;
    chapter?: string;
    category?: string;
    images?: File[];
  }) => {
    try {
      const { data: noteRecord, error: noteError } = await supabase
        .from('notes')
        .insert({
          content: noteData.content,
          book_id: book.id,
          page_number: noteData.pageNumber,
          timestamp_seconds: noteData.timestampSeconds,
          chapter: noteData.chapter,
          category: noteData.category,
          reading_progress: 0,
        })
        .select()
        .single();

      if (noteError) throw noteError;

      // Handle image uploads if any
      const uploadedImageUrls = [];
      if (noteData.images && noteData.images.length > 0) {
        for (const image of noteData.images) {
          const fileExt = image.name.split('.').pop();
          const filePath = `${noteRecord.id}/${crypto.randomUUID()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('book-notes-images')
            .upload(filePath, image);

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            toast.error('Failed to upload image');
            continue;
          }

          const { data: publicUrl } = supabase.storage
            .from('book-notes-images')
            .getPublicUrl(filePath);

          uploadedImageUrls.push(publicUrl.publicUrl);
        }
      }

      const newNoteObject = {
        id: noteRecord.id,
        content: noteRecord.content,
        createdAt: noteRecord.created_at,
        pageNumber: noteRecord.page_number,
        timestampSeconds: noteRecord.timestamp_seconds,
        chapter: noteRecord.chapter,
        category: noteRecord.category,
        isPinned: noteRecord.is_pinned,
        readingProgress: noteRecord.reading_progress,
        images: uploadedImageUrls,
      };

      const updatedNotes = [newNoteObject, ...localNotes];
      setLocalNotes(updatedNotes);

      onUpdateBook({
        ...book,
        notes: updatedNotes,
      });

      if (uploadedImageUrls.length > 0) {
        toast.success(`Note and ${uploadedImageUrls.length} image(s) added successfully`);
      } else {
        toast.success('Note added successfully');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      // Delete associated images from storage
      const { data: files } = await supabase.storage
        .from('book-notes-images')
        .list(noteId);

      if (files && files.length > 0) {
        const filesToDelete = files.map(file => `${noteId}/${file.name}`);
        await supabase.storage
          .from('book-notes-images')
          .remove(filesToDelete);
      }

      const updatedNotes = localNotes.filter(note => note.id !== noteId);
      setLocalNotes(updatedNotes);

      onUpdateBook({
        ...book,
        notes: updatedNotes,
      });

      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const togglePinNote = async (noteId: string, currentPinned: boolean) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ is_pinned: !currentPinned })
        .eq('id', noteId);

      if (error) throw error;

      const updatedNotes = localNotes.map(note =>
        note.id === noteId ? { ...note, isPinned: !currentPinned } : note
      );
      setLocalNotes(updatedNotes);

      onUpdateBook({
        ...book,
        notes: updatedNotes,
      });

      toast.success(currentPinned ? 'Note unpinned' : 'Note pinned');
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('Failed to update note');
    }
  };

  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const sortNotes = (notes: typeof localNotes) => {
    const pinnedNotes = notes.filter(note => note.isPinned);
    const unpinnedNotes = notes.filter(note => !note.isPinned);

    const sortFn = (a: typeof notes[0], b: typeof notes[0]) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'page':
          if (!a.pageNumber) return 1;
          if (!b.pageNumber) return -1;
          return a.pageNumber - b.pageNumber;
        case 'chapter':
          if (!a.chapter) return 1;
          if (!b.chapter) return -1;
          return a.chapter.localeCompare(b.chapter);
        default: // newest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    };

    return [...pinnedNotes.sort(sortFn), ...unpinnedNotes.sort(sortFn)];
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground italic">
            Organize your thoughts and notes for easy reference.
          </p>
          
          <AddNoteForm book={book} onSubmit={handleAddNote} />

          <div className="flex justify-end space-x-2 my-4">
            <Select value={sortBy} onValueChange={(value: typeof sortBy) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                {book.format === "physical_book" && (
                  <SelectItem value="page">Page Number</SelectItem>
                )}
                <SelectItem value="chapter">Chapter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 mt-4">
            {sortNotes(localNotes).map((note) => (
              <div
                key={note.id}
                className={`p-3 bg-white rounded-lg shadow animate-fade-in group relative ${
                  note.isPinned ? 'border-l-4 border-primary' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {note.category && (
                      <span className="bg-secondary px-2 py-1 rounded-full">
                        {note.category}
                      </span>
                    )}
                    {note.chapter && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        Chapter {note.chapter}
                      </span>
                    )}
                    {note.pageNumber && (
                      <span>Page {note.pageNumber}</span>
                    )}
                    {note.timestampSeconds && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(note.timestampSeconds)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${note.isPinned ? 'text-primary' : ''}`}
                      onClick={() => togglePinNote(note.id, note.isPinned)}
                    >
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                {note.images && note.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {note.images.map((imageUrl, index) => (
                      <a 
                        key={index} 
                        href={imageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img 
                          src={imageUrl} 
                          alt={`Note image ${index + 1}`} 
                          className="rounded-md w-full h-32 object-cover hover:opacity-90 transition-opacity"
                        />
                      </a>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
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
