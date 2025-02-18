import { useState } from "react";
import { Heart, ThumbsUp, ThumbsDown, Share2, Lightbulb, PartyPopper, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BookReaction, BookRecommendation, ReadingProgress } from "./types";

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
  ownerId,
  reactions,
  progress,
  onReactionAdded,
  onProgressUpdated,
}: BookInteractionsProps) {
  const [isReacting, setIsReacting] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const { session } = useAuth();
  const { toast } = useToast();

  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const userReaction = reactions.find(r => r.user_id === session?.user.id);

  const handleReaction = async (type: BookReaction['reaction_type']) => {
    if (!session?.user.id) return;

    try {
      setIsReacting(true);

      if (userReaction) {
        if (userReaction.reaction_type === type) {
          await supabase
            .from('book_reactions')
            .delete()
            .eq('id', userReaction.id);
        } else {
          await supabase
            .from('book_reactions')
            .update({ reaction_type: type })
            .eq('id', userReaction.id);
        }
      } else {
        await supabase
          .from('book_reactions')
          .insert({
            book_id: bookId,
            user_id: session.user.id,
            reaction_type: type,
          });
      }

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
        description: "Failed to save your reaction",
      });
    } finally {
      setIsReacting(false);
    }
  };

  const handleRecommend = async () => {
    if (!session?.user.id) return;

    try {
      setIsRecommending(true);
      
      if (!ownerId) {
        throw new Error("Cannot recommend book: missing recipient");
      }

      const { error } = await supabase
        .from('book_recommendations')
        .insert({
          book_id: bookId,
          from_user_id: session.user.id,
          to_user_id: ownerId,
          message: recommendation || null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Book recommendation sent!",
      });
      setRecommendation("");
      setIsRecommending(false);
    } catch (error) {
      console.error('Error sending recommendation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send recommendation",
      });
    }
  };

  const updateProgress = async (newProgress: number) => {
    if (!session?.user.id) return;

    try {
      if (progress) {
        await supabase
          .from('reading_progress')
          .update({ progress: newProgress })
          .eq('id', progress.id);
      } else {
        await supabase
          .from('reading_progress')
          .insert({
            book_id: bookId,
            user_id: session.user.id,
            progress: newProgress,
          });
      }

      onProgressUpdated();
      toast({
        title: "Success",
        description: "Reading progress updated",
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update reading progress",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
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
          className={userReaction?.reaction_type === 'love' ? 'bg-primary/10' : ''}
          onClick={() => handleReaction('love')}
          disabled={isReacting}
        >
          <Heart className="h-4 w-4 mr-1" />
          {reactionCounts['love'] || 0}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={userReaction?.reaction_type === 'thinking' ? 'bg-primary/10' : ''}
          onClick={() => handleReaction('thinking')}
          disabled={isReacting}
        >
          <Lightbulb className="h-4 w-4 mr-1" />
          {reactionCounts['thinking'] || 0}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={userReaction?.reaction_type === 'celebrate' ? 'bg-primary/10' : ''}
          onClick={() => handleReaction('celebrate')}
          disabled={isReacting}
        >
          <PartyPopper className="h-4 w-4 mr-1" />
          {reactionCounts['celebrate'] || 0}
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Recommend
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Recommend this book</DialogTitle>
              <DialogDescription>
                Add a personal message with your recommendation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Textarea
                placeholder="Why do you recommend this book?"
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
              />
              <Button 
                onClick={handleRecommend}
                disabled={isRecommending}
                className="w-full"
              >
                {isRecommending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Send Recommendation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
