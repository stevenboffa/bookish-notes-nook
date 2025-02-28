
import { useState } from "react";
import { Note, BookWithNotes, Book } from "@/types/books";
import { AddNoteForm } from "@/components/AddNoteForm";
import { NoteItem } from "@/components/NoteItem";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StickyNote, Filter } from "lucide-react";

// Convert Book to BookWithNotes to ensure compatibility
const convertBookToBookWithNotes = (book: Book): BookWithNotes => {
  return {
    id: book.id,
    notes: book.notes?.map(note => ({
      id: note.id,
      content: note.content,
      createdAt: note.createdAt,
      pageNumber: note.pageNumber,
      timestampSeconds: note.timestampSeconds,
      chapter: note.chapter,
      category: note.category,
      isPinned: note.isPinned,
      images: note.images
    })) || [],
    format: book.format
  };
};

export const NoteSection = ({ 
  book, 
  onNoteAdded, 
  onNotePinned,
  onNoteEdited,
  onNoteDeleted 
}: { 
  book: Book; 
  onNoteAdded: (book: BookWithNotes) => void;
  onNotePinned: (noteId: string, isPinned: boolean) => void;
  onNoteEdited: (note: Note) => void;
  onNoteDeleted: (noteId: string) => void;
}) => {
  const [showAddNote, setShowAddNote] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "pinned">("newest");

  const handleNoteAdded = (newNote: Note) => {
    const updatedNotes = [...(book.notes || []), newNote];
    
    // Create a BookWithNotes compatible object
    const bookWithNotes: BookWithNotes = {
      id: book.id,
      notes: updatedNotes.map(note => ({
        id: note.id,
        content: note.content,
        createdAt: note.createdAt,
        pageNumber: note.pageNumber,
        timestampSeconds: note.timestampSeconds,
        chapter: note.chapter,
        category: note.category,
        isPinned: note.isPinned,
        images: note.images
      })),
      format: book.format
    };
    
    onNoteAdded(bookWithNotes);
    setShowAddNote(false);
  };

  const sortNotes = (notes: Note[] = []) => {
    if (sortBy === "newest") {
      return [...notes].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "oldest") {
      return [...notes].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sortBy === "pinned") {
      return [...notes].sort((a, b) => {
        // First sort by pinned status
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        // Then by date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }
    
    return notes;
  };

  const filteredNotes = () => {
    if (!book.notes) return [];
    
    if (activeTab === "all") {
      return sortNotes(book.notes);
    } else {
      return sortNotes(book.notes.filter(note => 
        note.category === activeTab
      ));
    }
  };

  const notesByCategory = () => {
    if (!book.notes) return {};
    
    const categories: {[key: string]: number} = {
      all: book.notes.length
    };
    
    book.notes.forEach(note => {
      if (note.category) {
        categories[note.category] = (categories[note.category] || 0) + 1;
      }
    });
    
    return categories;
  };

  const noteCounts = notesByCategory();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Notes</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-1" />
            <select 
              className="text-sm bg-transparent border-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="pinned">Pinned</option>
            </select>
          </div>
          <Button 
            size="sm" 
            onClick={() => setShowAddNote(!showAddNote)}
          >
            {showAddNote ? "Cancel" : "Add Note"}
          </Button>
        </div>
      </div>
      
      {showAddNote && (
        <AddNoteForm 
          bookId={book.id}
          bookFormat={book.format || "physical_book"}
          onSubmit={handleNoteAdded}
        />
      )}
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-2 overflow-x-auto flex w-full justify-start">
          <TabsTrigger value="all" className="flex items-center">
            <StickyNote className="h-4 w-4 mr-1" />
            All ({noteCounts.all || 0})
          </TabsTrigger>
          {Object.entries(noteCounts)
            .filter(([category]) => category !== "all")
            .map(([category, count]) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="flex items-center"
              >
                {category} ({count})
              </TabsTrigger>
            ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotes().length > 0 ? (
            filteredNotes().map(note => (
              <NoteItem
                key={note.id}
                note={note}
                onPin={(isPinned) => onNotePinned(note.id, isPinned)}
                onEdit={() => {}}
                onDelete={() => onNoteDeleted(note.id)}
              />
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No notes found in this category
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
