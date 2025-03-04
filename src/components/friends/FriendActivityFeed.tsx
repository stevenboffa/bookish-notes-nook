import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BookCover } from "@/components/BookCover";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookPlus, BookOpen, BookCheck, Star, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { getBookCoverFallback } from "@/utils/bookCovers";

interface ActivityItem {
  id: string;
  user_id: string;
  activity_type: 'added_book' | 'started_book' | 'finished_book' | 'rated_book' | 'updated_book_status';
  book_id: string;
  details: {
    title: string;
    author: string;
    status?: string;
    old_status?: string;
    new_status?: string;
    rating?: number;
    genre?: string;
  };
  created_at: string;
  profile?: {
    username?: string;
    email?: string;
    avatar_url?: string;
  };
}

export function FriendActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        if (!session?.user.id) return;

        setLoading(true);
        
        const { data: friendsData, error: friendsError } = await supabase
          .from('friends')
          .select('sender_id, receiver_id')
          .eq('status', 'accepted')
          .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`);

        if (friendsError) throw friendsError;

        const friendIds = friendsData
          .map(friend => 
            friend.sender_id === session.user.id 
              ? friend.receiver_id 
              : friend.sender_id
          );

        const userIds = [...friendIds];
        
        const { data, error } = await supabase
          .from('friend_activities')
          .select(`
            *,
            profile:profiles(username, email, avatar_url)
          `)
          .in('user_id', userIds)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        setActivities(data as ActivityItem[]);
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load friend activities."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    
    const subscription = supabase
      .channel('friend_activities_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'friend_activities'
      }, (payload) => {
        if (payload.new.user_id !== session?.user.id) {
          supabase
            .from('friend_activities')
            .select('*, profile:profiles(username, email, avatar_url)')
            .eq('id', payload.new.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setActivities(current => [data as ActivityItem, ...current].slice(0, 20));
              }
            });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [session?.user.id, toast]);

  const getActivityIcon = (type: ActivityItem['activity_type']) => {
    switch (type) {
      case 'added_book':
        return <BookPlus className="h-4 w-4 text-blue-500" />;
      case 'started_book':
        return <BookOpen className="h-4 w-4 text-indigo-500" />;
      case 'finished_book':
        return <BookCheck className="h-4 w-4 text-green-500" />;
      case 'rated_book':
        return <Star className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    const username = activity.profile?.username || activity.profile?.email?.split('@')[0] || 'A friend';
    
    switch (activity.activity_type) {
      case 'added_book':
        return `${username} added "${activity.details.title}" to their collection`;
      case 'started_book':
        return `${username} started reading "${activity.details.title}"`;
      case 'finished_book':
        return `${username} finished reading "${activity.details.title}"`;
      case 'rated_book':
        return `${username} rated "${activity.details.title}" ${activity.details.rating}/10`;
      case 'updated_book_status':
        return `${username} updated "${activity.details.title}" from ${activity.details.old_status} to ${activity.details.new_status}`;
      default:
        return `${username} did something with "${activity.details.title}"`;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    if ((now.getTime() - date.getTime()) < 7 * 24 * 60 * 60 * 1000) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    return format(date, 'MMM d, yyyy');
  };

  const getGenreFromActivity = (activity: ActivityItem) => {
    if (activity.details.genre) {
      return activity.details.genre;
    }
    
    const title = activity.details.title || "";
    if (title.length % 5 === 0) return "Fantasy";
    if (title.length % 4 === 0) return "Science Fiction";
    if (title.length % 3 === 0) return "Romance";
    if (title.length % 2 === 0) return "Mystery";
    return "Non-Fiction";
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>See what your friends are reading</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>See what your friends are reading</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[500px] overflow-y-auto space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex gap-3 pb-3 border-b last:border-0">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.activity_type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{getActivityText(activity)}</p>
                <span className="text-xs text-muted-foreground">{formatTime(activity.created_at)}</span>
              </div>
              
              {activity.book_id && (
                <div className="flex-shrink-0">
                  <BookCover
                    imageUrl={null}
                    thumbnailUrl={null}
                    genre={getGenreFromActivity(activity)}
                    title={activity.details.title || "Unknown Book"}
                    size="sm"
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center py-6 text-muted-foreground">No recent activity to show</p>
        )}
      </CardContent>
    </Card>
  );
}
