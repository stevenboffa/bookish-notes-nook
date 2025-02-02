import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserX, BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Friend {
  id: string;
  email: string;
  books: {
    id: string;
    title: string;
    author: string;
    genre: string;
    rating: number;
  }[];
}

export default function Friends() {
  const [email, setEmail] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();

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

      // Fetch books for each friend
      const friendsWithBooks = await Promise.all(
        friendIds.map(async (friendId) => {
          const { data: booksData } = await supabase
            .from('books')
            .select('id, title, author, genre, rating')
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
            books: booksData || [],
          };
        })
      );

      setFriends(friendsWithBooks);
    } catch (error) {
      console.error('Error fetching friends:', error);
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

      if (userError || !userData) {
        console.error('User not found');
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

      setEmail("");
      fetchFriends();
    } catch (error) {
      console.error('Error adding friend:', error);
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

      setFriends(friends.filter(f => f.id !== friendId));
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  useEffect(() => {
    if (session?.user.id) {
      fetchFriends();
    }
  }, [session?.user.id]);

  return (
    <div className="container mx-auto px-4 py-8">
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
          <Card key={friend.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {friend.email}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFriend(friend.id)}
              >
                <UserX className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {friend.books.length} books in collection
              </CardDescription>
              <div className="mt-4 space-y-2">
                {friend.books.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center justify-between p-2 bg-accent/10 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">{book.title}</p>
                        <p className="text-xs text-muted-foreground">
                          by {book.author}
                        </p>
                      </div>
                    </div>
                    {book.rating > 0 && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        {book.rating}/10
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}