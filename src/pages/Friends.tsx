
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
import { FriendActivityFeed } from "@/components/friends/FriendActivityFeed";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Friend, FriendRequest } from "@/components/friends/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock } from "lucide-react";

const formatBooks = (books: any[]): Book[] => {
  return books.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    genre: book.genre || 'Unknown',
    dateRead: book.date_read,
    rating: book.rating || 0,
    status: book.status || 'Not started',
    isFavorite: book.is_favorite || false,
    imageUrl: book.image_url || null,
    thumbnailUrl: book.thumbnail_url || null,
    format: book.format || 'physical_book',
    description: book.description || '',  // Add the description field
    notes: book.notes || [],
    quotes: book.quotes || [],
    collections: book.collections || []
  }));
};

export default function Friends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [lastSentRequest, setLastSentRequest] = useState<{ email: string; timestamp: number } | null>(null);
  const { session } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const fetchFriends = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching friends data...');
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
          
          console.log('Fetching books for friend:', friend.email);
          const { data: booksData, error: booksError } = await supabase
            .from('books')
            .select('*, notes(*), quotes(*)')
            .eq('user_id', friend.id);

          if (booksError) {
            console.error('Error fetching books for friend:', booksError);
            continue;
          }

          console.log('Books data for friend:', booksData);
          
          acceptedFriends.push({
            id: friend.id,
            email: friend.email || '',
            username: friend.username,
            avatar_url: friend.avatar_url,
            status: friendship.status,
            type: isSender ? 'sent' : 'received',
            books: formatBooks(booksData || []),
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
      setIsLoading(true);
      console.log('Accepting request:', requestId);

      const { data: request, error: requestError } = await supabase
        .from('friends')
        .select('*, sender:profiles!friends_sender_id_fkey(username, email)')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      const { error: updateError } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      toast({
        title: "Friend Request Accepted",
        description: `You are now friends with ${request.sender.username || request.sender.email}!`,
        duration: 5000,
      });

      await fetchFriends();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept friend request. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addFriend = async (email: string) => {
    try {
      setIsLoading(true);
      
      if (!email || !email.trim()) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter a valid email address"
        });
        return;
      }

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
        .select('id, username, email')
        .eq('email', email.toLowerCase().trim())
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

      const { data: existingFriend, error: existingError } = await supabase
        .from('friends')
        .select('*, sender:profiles!friends_sender_id_fkey(username, email), receiver:profiles!friends_receiver_id_fkey(username, email)')
        .or(`and(sender_id.eq.${session?.user.id},receiver_id.eq.${userData.id}),and(sender_id.eq.${userData.id},receiver_id.eq.${session?.user.id})`)
        .maybeSingle();

      if (existingError) throw existingError;

      if (existingFriend) {
        if (existingFriend.status === 'pending') {
          const isPendingSent = existingFriend.sender_id === session?.user.id;
          const otherUser = isPendingSent ? existingFriend.receiver : existingFriend.sender;
          toast({
            title: "Pending Request",
            description: isPendingSent 
              ? `Your friend request to ${otherUser.username || otherUser.email} is still pending their approval.`
              : `${otherUser.username || otherUser.email} has already sent you a friend request. Check your pending requests above.`
          });
        } else {
          toast({
            variant: "destructive",
            title: "Already Friends",
            description: `You are already friends with ${userData.username || userData.email}`
          });
        }
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

      setLastSentRequest({
        email: userData.email,
        timestamp: Date.now()
      });

      toast({
        title: "Friend Request Sent",
        description: `Your friend request has been sent to ${userData.username || userData.email}. They will need to approve it.`,
        duration: 5000,
      });

      await fetchFriends();
    } catch (error) {
      console.error('Error adding friend:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send friend request. Please try again."
      });
    } finally {
      setIsLoading(false);
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
      const searchLower = searchTerm.toLowerCase().trim();
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
          return 0;
      }
    });

  return (
    <div className="container mx-auto px-4 py-8 pb-32 space-y-8">
      <h1 className="text-3xl font-bold mb-8 animate-fade-in">Friends</h1>
      
      <AddFriendSection onAddFriend={addFriend} isLoading={isLoading} />

      {lastSentRequest && (
        <Alert className="mt-4 bg-muted">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            You sent a friend request to <span className="font-medium">{lastSentRequest.email}</span>. They will need to approve it.
          </AlertDescription>
        </Alert>
      )}

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

      {/* Activity Feed Section (Desktop - side panel, Mobile - full width) */}
      {!isMobile && !selectedFriend ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <FriendSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
            
            <div className="grid gap-6 animate-fade-in grid-cols-1 sm:grid-cols-2 mt-6">
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
          </div>
          
          <div className="col-span-1 animate-fade-in">
            <FriendActivityFeed />
          </div>
        </div>
      ) : isMobile && !selectedFriend ? (
        <>
          <div className="mt-6">
            <FriendActivityFeed />
          </div>
        
          <FriendSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          
          <div className="grid gap-6 animate-fade-in grid-cols-1">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
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
                  <div className="text-center py-12 text-muted-foreground">
                    {searchTerm ? 'No friends match your search' : 'No friends added yet. Add your first friend above!'}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      ) : null}

      {isMobile && selectedFriend ? (
        <div className="container mx-auto px-4 py-8 pb-32">
          <FriendBooks 
            books={selectedFriend.books} 
            email={selectedFriend.email}
            userId={selectedFriend.id}
            onBack={handleBack}
          />
        </div>
      ) : null}

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
