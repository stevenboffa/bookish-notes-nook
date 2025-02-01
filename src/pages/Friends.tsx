import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Check, X, User } from "lucide-react";

type Profile = {
  id: string;
  email: string | null;
};

type Friend = {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted';
  created_at: string;
  sender_profile: Profile;
  receiver_profile: Profile;
};

const Friends = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchFriends();
      subscribeToFriendRequests();
    }
  }, [session?.user?.id]);

  const subscribeToFriendRequests = () => {
    const channel = supabase
      .channel('friends_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friends'
        },
        () => {
          fetchFriends();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchFriends = async () => {
    try {
      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select(`
          *,
          sender_profile:profiles!friends_sender_id_fkey (id, email),
          receiver_profile:profiles!friends_receiver_id_fkey (id, email)
        `)
        .or(`sender_id.eq.${session?.user?.id},receiver_id.eq.${session?.user?.id}`);

      if (friendsError) throw friendsError;

      const accepted = friendsData.filter(f => f.status === 'accepted');
      const pending = friendsData.filter(f => 
        f.status === 'pending' && f.receiver_id === session?.user?.id
      );

      setFriends(accepted);
      setPendingRequests(pending);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast({
        title: "Error",
        description: "Failed to load friends",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async () => {
    try {
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (userError || !userProfile) {
        toast({
          title: "User not found",
          description: "Please check the email address",
          variant: "destructive",
        });
        return;
      }

      const { error: requestError } = await supabase
        .from('friends')
        .insert({
          sender_id: session?.user?.id,
          receiver_id: userProfile.id,
          status: 'pending'
        });

      if (requestError) throw requestError;

      toast({
        title: "Success",
        description: "Friend request sent!",
      });
      setEmail("");
    } catch (error: any) {
      if (error?.code === '23505') {
        toast({
          title: "Request already sent",
          description: "You've already sent a request to this user",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send friend request",
          variant: "destructive",
        });
      }
    }
  };

  const handleFriendRequest = async (friendId: string, accept: boolean) => {
    try {
      if (accept) {
        await supabase
          .from('friends')
          .update({ status: 'accepted' })
          .eq('id', friendId);

        toast({
          title: "Success",
          description: "Friend request accepted!",
        });
      } else {
        await supabase
          .from('friends')
          .delete()
          .eq('id', friendId);

        toast({
          title: "Success",
          description: "Friend request declined",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process friend request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {pendingRequests.length > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {pendingRequests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter friend's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={sendFriendRequest}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Friend
              </Button>
            </div>
          </Card>

          <div className="space-y-2">
            {friends.map((friend) => (
              <Card key={friend.id} className="p-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>
                    {friend.sender_id === session?.user?.id
                      ? friend.receiver_profile?.email
                      : friend.sender_profile?.email}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-2">
          {pendingRequests.map((request) => (
            <Card key={request.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>{request.sender_profile?.email}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFriendRequest(request.id, true)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFriendRequest(request.id, false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Friends;