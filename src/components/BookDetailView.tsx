
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BookCover } from "@/components/BookCover";
import { Rating } from "@/components/Rating";
import { FormatBadge } from "@/components/FormatBadge";
import { Book } from "@/components/BookList";
import { ReadingStatusDropdown } from "@/components/ReadingStatusDropdown";
import { Button } from "@/components/ui/button";
import { AddNoteForm } from "@/components/AddNoteForm";
import { NoteItem } from "@/components/NoteItem";
import { Note } from "@/types/books";
import { NoteSection } from "@/components/NoteSection";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  MoreHorizontal,
  ChevronLeft,
  Edit3,
} from "lucide-react";
import {
  BookPlus,
  Share2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RecommendBookModal } from "./friends/RecommendBookModal";

type BookDetailViewProps = {
  book: Book;
  onReturn: () => void;
  isMobile?: boolean;
  isInReadingList?: boolean;
};

export function BookDetailView({
  book,
  onReturn,
  isMobile = false,
  isInReadingList = false,
}: BookDetailViewProps) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);

  const handleDeleteBook = async () => {
    try {
      const { error } = await supabase
        .from("books")
        .delete()
        .eq("id", book.id);

      if (error) throw error;

      toast({
        title: "Book Deleted",
        description: "Book has been removed from your library",
      });

      onReturn();
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete book. Please try again.",
      });
    }
  };

  const renderQuotes = () => {
    if (!book.quotes || book.quotes.length === 0) return null;

    return (
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-medium">Quotes</h3>
        <div className="space-y-3">
          {book.quotes.map((quote) => (
            <div
              key={quote.id}
              className="p-4 bg-muted/50 rounded-md border border-border"
            >
              <blockquote className="italic">{quote.content}</blockquote>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-300 pb-safe-bottom">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2"
          onClick={onReturn}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="-mr-2">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigate(`/edit-book/${book.id}`)}
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Book Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDeleteBook}
            >
              Delete Book
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-shrink-0 flex justify-center">
          <BookCover
            imageUrl={book.imageUrl}
            thumbnailUrl={book.thumbnailUrl}
            title={book.title}
            genre={book.genre}
            size={isMobile ? "md" : "lg"}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-serif text-book-title leading-tight">
            {book.title}
          </h1>
          
          <p className="mt-1 text-lg text-muted-foreground">
            by {book.author}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <FormatBadge format={book.format} />
            <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {book.genre}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Rating:</span>
              <Rating rating={book.rating || 0} maxRating={10} />
              <span className="text-sm text-muted-foreground">
                {book.rating}/10
              </span>
            </div>
          </div>

          <div className="mt-4">
            <ReadingStatusDropdown
              bookId={book.id}
              currentStatus={book.status}
              isInReadingList={isInReadingList}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRecommendModalOpen(true)}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Recommend to Friend
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            My Notes
          </h2>
          {(book.notes && book.notes.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingNotes(prev => !prev)}
            >
              {isEditingNotes ? "Done" : "Edit Notes"}
            </Button>
          )}
        </div>
        
        <AddNoteForm bookId={book.id} bookFormat={book.format} />
        
        {book.notes && book.notes.length > 0 ? (
          <div className="mt-4 space-y-3">
            {book.notes
              .slice()
              .sort((a, b) => {
                // Sort by pinned first, then by date (newest first)
                if (a.is_pinned && !b.is_pinned) return -1;
                if (!a.is_pinned && b.is_pinned) return 1;
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
              })
              .map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  isEditing={isEditingNotes}
                />
              ))}
          </div>
        ) : (
          <p className="mt-4 text-muted-foreground text-sm">
            No notes added yet. Add your first note above.
          </p>
        )}
      </div>

      {renderQuotes()}
      
      <RecommendBookModal 
        book={book}
        isOpen={isRecommendModalOpen}
        onClose={() => setIsRecommendModalOpen(false)}
      />
    </div>
  );
}
