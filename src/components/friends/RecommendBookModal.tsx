
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Friend } from "@/components/friends/types";
import { Book } from "@/components/BookList";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Loader2 } from "lucide-react";

interface RecommendBookModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export function RecommendBookModal({ book, isOpen, onClose }: RecommendBookModalProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const { session } = useAuth();
  const { toast } = useToast();

  // Fetch friends list
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setIsFetching(true);
        if (!session?.user?.id) return;

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
          .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`);

        if (friendsError) throw friendsError;

        const acceptedFriends: Friend[] = [];

        for (const friendship of friendsData || []) {
          if (friendship.status === 'accepted') {
            const isSender = friendship.sender.id === session.user.id;
            const friend = isSender ? friendship.receiver : friendship.sender;
            
            acceptedFriends.push({
              id: friend.id,
              email: friend.email || '',
              username: friend.username,
              avatar_url: friend.avatar_url,
              status: friendship.status,
              type: isSender ? 'sent' : 'received',
              books: [], // We don't need the books for this component
            });
          }
        }

        setFriends(acceptedFriends);
      } catch (error) {
        console.error('Error fetching friends:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch friends list"
        });
      } finally {
        setIsFetching(false);
      }
    };

    if (isOpen) {
      fetchFriends();
    }
  }, [isOpen, session?.user?.id, toast]);

  const handleRecommend = async () => {
    if (!selectedFriend) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a friend to recommend this book to."
      });
      return;
    }

    try {
      setIsLoading(true);

      // Check if recommendation already exists
      const { data: existingRec, error: checkError } = await supabase
        .from('book_recommendations')
        .select('id')
        .eq('book_id', book.id)
        .eq('from_user_id', session?.user.id)
        .eq('to_user_id', selectedFriend)
        .eq('status', 'pending')
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingRec) {
        toast({
          variant: "destructive",
          title: "Already Recommended",
          description: "You have already recommended this book to this friend."
        });
        return;
      }

      // Insert new recommendation
      const { error: insertError } = await supabase
        .from('book_recommendations')
        .insert({
          book_id: book.id,
          from_user_id: session?.user.id,
          to_user_id: selectedFriend,
          message: message.trim() || null,
          status: 'pending'
        });

      if (insertError) throw insertError;

      toast({
        title: "Book Recommended",
        description: "Your book recommendation has been sent successfully!"
      });

      onClose();
      setSelectedFriend("");
      setMessage("");
    } catch (error) {
      console.error('Error recommending book:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send book recommendation. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFriendDisplayName = (friend: Friend) => {
    return friend.username || friend.email;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Recommend Book to a Friend</DialogTitle>
          <DialogDescription>
            Share "{book.title}" by {book.author} with a friend.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {isFetching ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {friends.length === 0 ? (
                <div className="text-center text-muted-foreground py-2">
                  You haven't added any friends yet. Add friends to recommend books to them.
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label htmlFor="friend" className="text-sm font-medium">
                      Select a friend
                    </label>
                    <Select
                      value={selectedFriend}
                      onValueChange={setSelectedFriend}
                    >
                      <SelectTrigger id="friend">
                        <SelectValue placeholder="Select a friend" />
                      </SelectTrigger>
                      <SelectContent>
                        {friends.map((friend) => (
                          <SelectItem key={friend.id} value={friend.id}>
                            {getFriendDisplayName(friend)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Add a personal message (optional)
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Why do you recommend this book?"
                      className="min-h-[100px]"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleRecommend} 
            disabled={isLoading || !selectedFriend || friends.length === 0}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Recommend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
