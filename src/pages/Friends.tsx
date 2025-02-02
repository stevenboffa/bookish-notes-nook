import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserX, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FriendBooks } from "@/components/FriendBooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Book } from "@/components/BookList";

interface Friend {
  id: string;
  email: string;
  books: Book[];
}

export default function Friends() {
  const [email, setEmail] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const { session } = useAuth();
  const { toast } = useToast();

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
          const { data: booksData } = await supabase
            .from('books')
            .select('id, title, author, genre, rating, status, date_read, notes, image_url, thumbnail_url')
            .eq('user_id', friendId);

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
              ...book,
              imageUrl: book.image_url,
              thumbnailUrl: book.thumbnail_url,
              dateRead: book.date_read,
              notes: book.notes || [],
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

  const addFriend = async () => {
    try {
      setIsLoading(true);
      
      // First find the user by email
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

      // Check if friendship already exists
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

      // Add friend relationship
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

      setEmail("");
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Friends</h1>
        
        <div className="flex gap-4 mb-8">
          <Input
            type="email"
            placeholder="Enter friend's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button 
            onClick={addFriend}
            disabled={isLoading || !email}
          >
            Add Friend
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {friends.map((friend) => (
            <Card 
              key={friend.id}
              className={`cursor-pointer transition-all duration-300 ${
                selectedFriend?.id === friend.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedFriend(friend)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {friend.email}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFriend(friend.id);
                  }}
                >
                  <UserX className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <CardDescription className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {friend.books.length} books in collection
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedFriend && (
        <div className="mt-8">
          <FriendBooks books={selectedFriend.books} email={selectedFriend.email} />
        </div>
      )}
    </div>
  );
}