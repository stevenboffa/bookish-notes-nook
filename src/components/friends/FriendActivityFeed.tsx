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
import { BookPlus, BookOpen, BookCheck, Star, Clock, ChevronDown } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { getBookCoverFallback } from "@/utils/bookCovers";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

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
    image_url?: string;
    thumbnail_url?: string;
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
  const [isOpen, setIsOpen] = useState(true);
  const { session } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

        if (friendIds.length === 0) {
          setActivities([]);
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('friend_activities')
          .select(`
            *,
            profile:profiles(username, email, avatar_url)
          `)
          .in('user_id', friendIds)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        const bookIds = data
          .filter((activity: any) => activity.book_id)
          .map((activity: any) => activity.book_id);

        let booksMap = new Map();
        if (bookIds.length > 0) {
          const { data: booksData, error: booksError } = await supabase
            .from('books')
            .select('id, image_url, thumbnail_url, genre')
            .in('id', bookIds);

          if (booksError) throw booksError;
          
          booksData?.forEach(book => {
            booksMap.set(book.id, book);
          });
        }

        const activitiesWithCovers = data.map((activity: any) => {
          const activityItem = activity as ActivityItem;
          
          if (activity.book_id && booksMap.has(activity.book_id)) {
            const bookData = booksMap.get(activity.book_id);
            activityItem.details.image_url = bookData.image_url || null;
            activityItem.details.thumbnail_url = bookData.thumbnail_url || null;
            activityItem.details.genre = bookData.genre || activityItem.details.genre || 'Fiction';
          }
          
          return activityItem;
        });

        setActivities(activitiesWithCovers);
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
          Promise.all([
            supabase
              .from('profiles')
              .select('username, email, avatar_url')
              .eq('id', payload.new.user_id)
              .single(),
            payload.new.book_id ? supabase
              .from('books')
              .select('image_url, thumbnail_url, genre')
              .eq('id', payload.new.book_id)
              .single() : Promise.resolve({ data: null })
          ]).then(([profileResult, bookResult]) => {
            const activityItem = payload.new as ActivityItem;
            
            if (profileResult.data) {
              activityItem.profile = profileResult.data;
            }
            
            if (bookResult.data) {
              activityItem.details.image_url = bookResult.data.image_url || null;
              activityItem.details.thumbnail_url = bookResult.data.thumbnail_url || null;
              activityItem.details.genre = bookResult.data.genre || activityItem.details.genre || 'Fiction';
            }
            
            setActivities(current => [activityItem, ...current].slice(0, 20));
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
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex justify-between items-center">
          <CardHeader className="pb-3">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>See what your friends are reading</CardDescription>
          </CardHeader>
          <CollapsibleTrigger asChild>
            <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted mr-4">
              <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", {
                "transform rotate-180": isOpen
              })} />
              <span className="sr-only">Toggle activity feed</span>
            </button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <CardContent className={cn("space-y-4", {
            "max-h-[250px] overflow-y-auto": isMobile,
            "max-h-[500px] overflow-y-auto": !isMobile
          })}>
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
                        imageUrl={activity.details.image_url || null}
                        thumbnailUrl={activity.details.thumbnail_url || null}
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
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
