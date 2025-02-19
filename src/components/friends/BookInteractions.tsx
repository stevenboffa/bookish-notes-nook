
import { useState } from "react";
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

  // Calculate reaction counts - treat 'like' and 'dislike' exactly the same way
  const reactionCounts = reactions.reduce((acc, reaction) => {
    if (reaction.reaction_type === 'like' || reaction.reaction_type === 'dislike') {
      acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Find user's current reaction, if any
  const userReaction = reactions.find(r => r.user_id === session?.user.id);

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!session?.user.id) {
      toast({
        title: "Error",
        description: "You must be logged in to react to books",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsReacting(true);

      // First, get the current reaction state
      const { data: currentReaction } = await supabase
        .from('book_reactions')
        .select('*')
        .eq('book_id', bookId)
        .eq('user_id', session.user.id)
        .maybeSingle();

      // If clicking the same type as current reaction, just delete it
      if (currentReaction?.reaction_type === type) {
        await supabase
          .from('book_reactions')
          .delete()
          .eq('id', currentReaction.id);
      } else {
        // If there's any existing reaction, delete it
        if (currentReaction) {
          await supabase
            .from('book_reactions')
            .delete()
            .eq('id', currentReaction.id);
        }
        
        // Create the new reaction
        await supabase
          .from('book_reactions')
          .insert({
            book_id: bookId,
            user_id: session.user.id,
            reaction_type: type
          });
      }

      // Refresh the reactions list
      onReactionAdded();
      
      toast({
        title: "Success",
        description: "Your reaction has been saved",
      });
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
  };

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
              {reactionCounts['like'] || 0}
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
              {reactionCounts['dislike'] || 0}
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
