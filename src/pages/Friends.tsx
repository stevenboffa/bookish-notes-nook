import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { FriendBooks } from "@/components/FriendBooks";
import { Book } from "@/components/BookList";
import { supabase } from "@/integrations/supabase/client";
import { FriendCard } from "@/components/friends/FriendCard";
import { FriendRequestCard } from "@/components/friends/FriendRequestCard";
import { AddFriendSection } from "@/components/friends/AddFriendSection";
import { FriendSearch } from "@/components/friends/FriendSearch";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Friend, FriendRequest } from "@/components/friends/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const formatBooks = (books: any[]): Book[] => {
  return books.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    dateRead: book.date_read,
    rating: book.rating,
    status: book.status,
    isFavorite: book.is_favorite || false,
    imageUrl: book.image_url || null,
    thumbnailUrl: book.thumbnail_url || null,
    format: book.format || 'physical_book',
    notes: book.notes || [],
    quotes: book.quotes || [],
  }));
};

export default function Friends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const { session } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
        .or(`sender_id.eq.${session?.user.id},receiver_id.eq.${session?.user.id}`);

      if (friendsError) throw friendsError;

      const requests: FriendRequest[] = [];
      const acceptedFriends: Friend[] = [];

      for (const friendship of friendsData || []) {
        if (friendship.status === 'pending' && friendship.receiver.id === session?.user.id) {
          requests.push(friendship as FriendRequest);
        } else if (friendship.status === 'accepted') {
          const isSender = friendship.sender.id === session?.user.id;
          const friend = isSender ? friendship.receiver : friendship.sender;
          
          const { data: booksData } = await supabase
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
              ),
              quotes (
                id,
                content,
                created_at
              )
            `)
            .eq('user_id', friend.id);

          acceptedFriends.push({
            id: friend.id,
            email: friend.email || '',
            username: friend.username,
            avatar_url: friend.avatar_url,
            status: friendship.status,
            type: isSender ? 'sent' : 'received',
            books: formatBooks((booksData || []).map(book => ({
              id: book.id,
              title: book.title,
              author: book.author,
              genre: book.genre,
              rating: book.rating || 0,
              status: (book.status || 'Not started') as "Not started" | "In Progress" | "Finished",
              dateRead: book.date_read,
              imageUrl: book.image_url,
              thumbnailUrl: book.thumbnail_url,
              notes: (book.notes || []).map(note => ({
                id: note.id,
                content: note.content,
                createdAt: note.created_at,
              })),
              quotes: (book.quotes || []).map(quote => ({
                id: quote.id,
                content: quote.content,
                createdAt: quote.created_at,
              })),
            }))),
          });
        }
      }

      setPendingRequests(requests);
      setFriends(acceptedFriends);
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

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Friend request accepted"
      });

      fetchFriends();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept friend request"
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Friend request rejected"
      });

      fetchFriends();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject friend request"
      });
    }
  };

  const addFriend = async (email: string) => {
    try {
      setIsLoading(true);
      
      if (email === session?.user.email) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You cannot add yourself as a friend"
        });
        return;
      }

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
          title: "Request exists",
          description: "A friend request already exists with this user"
        });
        return;
      }

      const { error: friendError } = await supabase
        .from('friends')
        .insert({
          sender_id: session?.user.id,
          receiver_id: userData.id,
          status: 'pending'
        });

      if (friendError) throw friendError;

      toast({
        title: "Success",
        description: "Friend request sent"
      });

      fetchFriends();
    } catch (error) {
      console.error('Error adding friend:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send friend request"
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

  const filteredFriends = friends
    .filter(friend => {
      const searchLower = searchTerm.toLowerCase();
      return (
        friend.email.toLowerCase().includes(searchLower) ||
        (friend.username?.toLowerCase() || '').includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const aName = a.username?.toLowerCase() || a.email.toLowerCase();
          const bName = b.username?.toLowerCase() || b.email.toLowerCase();
          return aName.localeCompare(bName);
        case 'books':
          return b.books.length - a.books.length;
        case 'recent':
        default:
          return 0; // Keep original order
      }
    });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8 animate-fade-in">Friends</h1>
      
      <AddFriendSection onAddFriend={addFriend} isLoading={isLoading} />

      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pending Requests</h2>
          <div className={cn(
            "grid gap-4",
            isMobile ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
          )}>
            {pendingRequests.map((request) => (
              <FriendRequestCard
                key={request.id}
                request={request}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
              />
            ))}
          </div>
        </div>
      )}

      <FriendSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {isMobile && selectedFriend ? (
        <div className="container mx-auto px-4 py-8">
          <FriendBooks 
            books={selectedFriend.books} 
            email={selectedFriend.email}
            userId={selectedFriend.id}
            onBack={handleBack}
          />
        </div>
      ) : (
        <div className="grid gap-6 animate-fade-in grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <>
              {filteredFriends.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  isSelected={selectedFriend?.id === friend.id}
                  onSelect={setSelectedFriend}
                  onRemove={removeFriend}
                />
              ))}
              {!isLoading && filteredFriends.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  {searchTerm ? 'No friends match your search' : 'No friends added yet. Add your first friend above!'}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!isMobile && selectedFriend && (
        <div className="mt-8 animate-fade-in">
          <FriendBooks 
            books={selectedFriend.books} 
            email={selectedFriend.email}
            userId={selectedFriend.id}
          />
        </div>
      )}
    </div>
  );
}
