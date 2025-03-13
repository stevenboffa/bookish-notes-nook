
import { useState, useEffect } from "react";
import { Send, Share2 } from "lucide-react";
import { Book } from "@/types/books";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Friend } from "@/components/friends/types";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RecommendBookDialogProps {
  book: Book;
  buttonVariant?: "default" | "outline" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonLabel?: string | null;
  children?: React.ReactNode;
}

export function RecommendBookDialog({
  book,
  buttonVariant = "ghost",
  buttonSize = "icon",
  buttonLabel = null,
  children,
}: RecommendBookDialogProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriendId, setSelectedFriendId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();

  // Fetch friends when dialog is opened
  useEffect(() => {
    if (open) {
      fetchFriends();
    }
  }, [open]);

  // Fetch the current user's friends
  const fetchFriends = async () => {
    try {
      setIsLoading(true);
      
      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select(`
          id,
          status,
          receiver:profiles!friends_receiver_id_fkey(
            id,
            email,
            username,
            avatar_url
          ),
          sender:profiles!friends_sender_id_fkey(
            id,
            email,
            username,
            avatar_url
          )
        `)
        .eq('status', 'accepted')
        .or(`sender_id.eq.${session?.user.id},receiver_id.eq.${session?.user.id}`);

      if (friendsError) throw friendsError;

      const formattedFriends: Friend[] = [];

      for (const friendship of friendsData || []) {
        if (friendship.status === 'accepted') {
          const isSender = friendship.sender.id === session?.user.id;
          const friend = isSender ? friendship.receiver : friendship.sender;
          
          formattedFriends.push({
            id: friend.id,
            email: friend.email || '',
            username: friend.username,
            avatar_url: friend.avatar_url,
            status: friendship.status,
            type: isSender ? 'sent' : 'received',
            books: [],
          });
        }
      }

      setFriends(formattedFriends);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch friends list"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Send book recommendation
  const handleSendRecommendation = async () => {
    if (!selectedFriendId) {
      toast({
        title: "Selection Required",
        description: "Please select a friend to send the recommendation to",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('book_recommendations')
        .insert({
          book_id: book.id,
          from_user_id: session?.user.id,
          to_user_id: selectedFriendId,
          message: message.trim() || null,
          status: 'pending'
        });

      if (error) throw error;
      
      // Success
      toast({
        title: "Recommendation Sent",
        description: "Your book recommendation has been sent successfully!",
      });
      
      // Reset form and close dialog
      setSelectedFriendId("");
      setMessage("");
      setOpen(false);
    } catch (error) {
      console.error('Error sending recommendation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send recommendation. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button 
            variant={buttonVariant} 
            size={buttonSize}
            className="relative group hover:text-primary"
            aria-label="Recommend book"
          >
            {buttonSize === "icon" ? <Share2 className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {buttonLabel && <span className="ml-2">{buttonLabel}</span>}
            <span className="sr-only">Recommend book to a friend</span>
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share This Book</DialogTitle>
          <DialogDescription>
            Share "{book.title}" by {book.author} with a friend.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="friend">Select Friend</Label>
            <Select
              value={selectedFriendId}
              onValueChange={setSelectedFriendId}
              disabled={isLoading || friends.length === 0}
            >
              <SelectTrigger id="friend" className="w-full">
                <SelectValue placeholder="Choose a friend" />
              </SelectTrigger>
              <SelectContent>
                {friends.length > 0 ? (
                  friends.map((friend) => (
                    <SelectItem key={friend.id} value={friend.id}>
                      {friend.username || friend.email}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-friends" disabled>
                    No friends found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
              rows={4}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            onClick={handleSendRecommendation}
            disabled={isLoading || !selectedFriendId}
          >
            {isLoading ? "Sending..." : "Send Recommendation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
