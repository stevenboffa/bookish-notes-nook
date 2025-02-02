import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { FriendBooks } from "@/components/FriendBooks";
import { Book } from "@/components/BookList";
import { supabase } from "@/integrations/supabase/client";
import { FriendCard } from "@/components/friends/FriendCard";
import { AddFriendSection } from "@/components/friends/AddFriendSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export interface Friend {
  id: string;
  email: string;
  books: Book[];
}

export default function Friends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const { session } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const fetchFriends = async () => {
    try {
      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select(`
          receiver:profiles!friends_receiver_id_fkey(
            id,
            email
          ),
          sender:profiles!friends_sender_id_fkey(
            id,
            email
          )
        `)
        .or(`sender_id.eq.${session?.user.id},receiver_id.eq.${session?.user.id}`);

      if (friendsError) throw friendsError;

      const friendIds = friendsData.map(f => 
        f.sender.id === session?.user.id ? f.receiver.id : f.sender.id
      );

      const friendsWithBooks = await Promise.all(
        friendIds.map(async (friendId) => {
          const { data: booksData, error: booksError } = await supabase
            .from('books')
            .select(`
              id,
              title,
              author,
              genre,
              rating,
              status,
              date_read,
              image_url,
              thumbnail_url,
              notes (
                id,
                content,
                created_at
              )
            `)
            .eq('user_id', friendId);

          if (booksError) throw booksError;

          const friendData = friendsData.find(f => 
            f.sender.id === friendId || f.receiver.id === friendId
          );
          
          const friendEmail = friendData?.sender.id === friendId 
            ? friendData.sender.email 
            : friendData?.receiver.email;

          return {
            id: friendId,
            email: friendEmail || '',
            books: (booksData || []).map(book => ({
              id: book.id,
              title: book.title,
              author: book.author,
              genre: book.genre,
              rating: book.rating || 0,
              status: (book.status || 'Not started') as "Not started" | "In Progress" | "Finished",
              dateRead: book.date_read,
              imageUrl: book.image_url,
              thumbnailUrl: book.thumbnail_url,
              notes: book.notes.map(note => ({
                id: note.id,
                content: note.content,
                createdAt: note.created_at,
              })),
            })),
          };
        })
      );

      setFriends(friendsWithBooks);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch friends list"
      });
    }
  };

  const addFriend = async (email: string) => {
    try {
      setIsLoading(true);
      
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (userError) throw userError;

      if (!userData) {
        toast({
          variant: "destructive",
          title: "User not found",
          description: "No user found with this email address"
        });
        return;
      }

      const { data: existingFriend } = await supabase
        .from('friends')
        .select()
        .or(`and(sender_id.eq.${session?.user.id},receiver_id.eq.${userData.id}),and(sender_id.eq.${userData.id},receiver_id.eq.${session?.user.id})`)
        .maybeSingle();

      if (existingFriend) {
        toast({
          variant: "destructive",
          title: "Already friends",
          description: "You are already friends with this user"
        });
        return;
      }

      const { error: friendError } = await supabase
        .from('friends')
        .insert({
          sender_id: session?.user.id,
          receiver_id: userData.id,
          status: 'accepted'
        });

      if (friendError) throw friendError;

      toast({
        title: "Success",
        description: "Friend added successfully"
      });

      fetchFriends();
    } catch (error) {
      console.error('Error adding friend:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add friend"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFriend = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .or(`and(sender_id.eq.${session?.user.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${session?.user.id})`);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Friend removed successfully"
      });

      if (selectedFriend?.id === friendId) {
        setSelectedFriend(null);
      }
      setFriends(friends.filter(f => f.id !== friendId));
    } catch (error) {
      console.error('Error removing friend:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove friend"
      });
    }
  };

  useEffect(() => {
    if (session?.user.id) {
      fetchFriends();
    }
  }, [session?.user.id]);

  const handleBack = () => {
    setSelectedFriend(null);
  };

  if (isMobile && selectedFriend) {
    return (
      <div className="container mx-auto px-4 py-8">
        <FriendBooks 
          books={selectedFriend.books} 
          email={selectedFriend.email}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8 animate-fade-in">Friends</h1>
      
      <AddFriendSection onAddFriend={addFriend} isLoading={isLoading} />

      <div className={cn(
        "grid gap-6 animate-fade-in",
        isMobile ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
      )}>
        {friends.map((friend) => (
          <FriendCard
            key={friend.id}
            friend={friend}
            isSelected={selectedFriend?.id === friend.id}
            onSelect={setSelectedFriend}
            onRemove={removeFriend}
          />
        ))}
        {friends.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No friends added yet. Add your first friend above!
          </div>
        )}
      </div>

      {!isMobile && selectedFriend && (
        <div className="mt-8 animate-fade-in">
          <FriendBooks books={selectedFriend.books} email={selectedFriend.email} />
        </div>
      )}
    </div>
  );
}
