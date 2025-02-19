
import { useState, useCallback } from "react";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BookReaction, ReadingProgress } from "./types";

interface BookInteractionsProps {
  bookId: string;
  ownerId: string;
  reactions: BookReaction[];
  progress?: ReadingProgress;
  onReactionAdded: () => void;
  onProgressUpdated: () => void;
}

export function BookInteractions({
  bookId,
  reactions,
  progress,
  onReactionAdded,
}: BookInteractionsProps) {
  const [isReacting, setIsReacting] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();

  const reactionCounts = {
    like: reactions.filter(r => r.reaction_type === 'like').length,
    dislike: reactions.filter(r => r.reaction_type === 'dislike').length
  };

  const userReaction = reactions.find(r => r.user_id === session?.user.id);

  const handleReaction = useCallback(async (type: 'like' | 'dislike') => {
    if (!session?.user.id) {
      toast({
        title: "Error",
        description: "You must be logged in to react to books",
        variant: "destructive",
      });
      return;
    }

    if (isReacting) return;

    try {
      setIsReacting(true);

      // If we have an existing reaction of the same type, delete it
      if (userReaction?.reaction_type === type) {
        const { error: deleteError } = await supabase
          .from('book_reactions')
          .delete()
          .match({ id: userReaction.id });

        if (deleteError) throw deleteError;

      } else {
        // If we have a different reaction, delete it first
        if (userReaction) {
          const { error: deleteError } = await supabase
            .from('book_reactions')
            .delete()
            .match({ id: userReaction.id });

          if (deleteError) throw deleteError;
        }

        // Then insert the new reaction
        const { error: insertError } = await supabase
          .from('book_reactions')
          .upsert({
            book_id: bookId,
            user_id: session.user.id,
            reaction_type: type
          }, {
            onConflict: 'book_id,user_id',
            ignoreDuplicates: false
          });

        if (insertError) throw insertError;
      }

      // Force refresh of reactions
      await onReactionAdded();

    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your reaction"
      });
    } finally {
      setIsReacting(false);
    }
  }, [bookId, session?.user.id, userReaction, isReacting, toast, onReactionAdded]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          className={userReaction?.reaction_type === 'like' ? 'bg-primary/10' : ''}
          onClick={() => handleReaction('like')}
          disabled={isReacting}
        >
          {isReacting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ThumbsUp className="h-4 w-4 mr-1" />
              {reactionCounts.like}
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={userReaction?.reaction_type === 'dislike' ? 'bg-primary/10' : ''}
          onClick={() => handleReaction('dislike')}
          disabled={isReacting}
        >
          {isReacting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ThumbsDown className="h-4 w-4 mr-1" />
              {reactionCounts.dislike}
            </>
          )}
        </Button>
      </div>

      {progress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Reading Progress</span>
            <span>{progress.progress}%</span>
          </div>
          <Progress value={progress.progress} className="h-2" />
        </div>
      )}
    </div>
  );
}
