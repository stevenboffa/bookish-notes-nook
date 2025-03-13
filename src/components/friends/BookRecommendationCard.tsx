
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatDistance } from "date-fns";
import { FriendAvatar } from "./FriendAvatar";
import { BookCover } from "@/components/BookCover";
import { Book as BookType } from "@/types/books";

interface Recommendation {
  id: string;
  book: BookType;
  sender: {
    id: string;
    email: string;
    username: string | null;
    avatar_url: string | null;
  };
  message: string | null;
  created_at: string;
}

interface BookRecommendationCardProps {
  recommendation: Recommendation;
  onViewBook?: (book: BookType) => void;
  onUpdate: () => void;
}

export function BookRecommendationCard({ recommendation, onViewBook, onUpdate }: BookRecommendationCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();
  const { book, sender, message, created_at } = recommendation;

  const handleAccept = async () => {
    try {
      setIsLoading(true);
      
      // 1. Create a new book entry in the user's library
      const newBook = {
        ...book,
        id: crypto.randomUUID(), // Generate a new ID for the book copy
        user_id: session?.user.id,
        status: "Not started",
        date_read: new Date().toISOString().split('T')[0],
        // Reset some values for the new book copy
        rating: 0,
        notes: [],
        quotes: [],
        isFavorite: false,
        collections: [],
      };
      
      const { error: bookError } = await supabase
        .from('books')
        .insert({
          id: newBook.id,
          title: newBook.title,
          author: newBook.author,
          genre: newBook.genre || "",
          status: "Not started",
          date_read: new Date().toISOString().split('T')[0],
          format: newBook.format || "physical_book",
          image_url: newBook.imageUrl,
          thumbnail_url: newBook.thumbnailUrl,
          description: newBook.description || "",
          user_id: session?.user.id,
        });

      if (bookError) throw bookError;
      
      // 2. Update recommendation status
      const { error: updateError } = await supabase
        .from('book_recommendations')
        .update({ status: 'accepted' })
        .eq('id', recommendation.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Book Added",
        description: `"${book.title}" has been added to your library`,
      });
      
      // Refresh recommendations list
      onUpdate();
      
    } catch (error) {
      console.error('Error accepting recommendation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add this book to your library"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('book_recommendations')
        .update({ status: 'declined' })
        .eq('id', recommendation.id);
        
      if (error) throw error;
      
      toast({
        title: "Recommendation Declined",
        description: "The recommendation has been removed from your list"
      });
      
      // Refresh recommendations list
      onUpdate();
      
    } catch (error) {
      console.error('Error declining recommendation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to decline recommendation"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="animate-fade-in transition-all hover:shadow-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/60"></div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FriendAvatar
              email={sender.email}
              username={sender.username}
              avatarUrl={sender.avatar_url}
              size="sm"
            />
            <div>
              <CardTitle className="text-sm font-medium">
                {sender.username || sender.email}
              </CardTitle>
              <CardDescription className="text-xs">
                {formatDistance(new Date(created_at), new Date(), { addSuffix: true })}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0 w-16">
            <BookCover
              imageUrl={book.imageUrl}
              thumbnailUrl={book.thumbnailUrl}
              title={book.title}
              genre={book.genre || ""}
              size="sm"
              className="w-16 h-20 shadow-md rounded"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{book.title}</h4>
            <p className="text-muted-foreground text-xs italic">by {book.author}</p>
            
            {message && (
              <div className="mt-2 bg-muted/50 p-2 rounded text-xs italic">
                "{message}"
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0 gap-2">
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1 bg-success hover:bg-success/90 text-black font-medium"
          onClick={handleAccept}
          disabled={isLoading}
        >
          <Check className="h-3 w-3 mr-1" />
          Accept
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 hover:bg-destructive/10 hover:text-destructive"
          onClick={handleDecline}
          disabled={isLoading}
        >
          <X className="h-3 w-3 mr-1" />
          Decline
        </Button>
      </CardFooter>
    </Card>
  );
}
