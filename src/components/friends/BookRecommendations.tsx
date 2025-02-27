
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/BookCover";
import { Check, X, Loader2, BookPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Book } from "@/components/BookList";

interface Recommendation {
  id: string;
  book: Book;
  from_user: {
    id: string;
    username: string;
    email: string;
    avatar_url: string | null;
  };
  message: string | null;
  status: string;
  created_at: string;
}

interface BookRecommendationsProps {
  onAddToLibrary?: (book: Book) => void;
}

export function BookRecommendations({ onAddToLibrary }: BookRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const { session } = useAuth();
  const { toast } = useToast();

  const fetchRecommendations = async () => {
    if (!session?.user?.id) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('book_recommendations')
        .select(`
          id,
          status,
          message,
          created_at,
          book_id,
          books:book_id(
            id,
            title,
            author,
            genre,
            image_url,
            thumbnail_url,
            status,
            format,
            date_read
          ),
          from_user:profiles!book_recommendations_from_user_id_fkey(
            id,
            username,
            email,
            avatar_url
          )
        `)
        .eq('to_user_id', session.user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRecommendations: Recommendation[] = (data || []).map(item => {
        // Format the book object to match the Book type
        const book: Book = {
          id: item.books.id,
          title: item.books.title,
          author: item.books.author,
          genre: item.books.genre || 'Unknown',
          status: item.books.status || 'Not started',
          dateRead: item.books.date_read,
          rating: 0, // Default value
          format: item.books.format || 'physical_book',
          isFavorite: false, // Default value
          notes: [],
          quotes: [],
          imageUrl: item.books.image_url,
          thumbnailUrl: item.books.thumbnail_url,
        };

        return {
          id: item.id,
          book,
          from_user: item.from_user,
          message: item.message,
          status: item.status,
          created_at: item.created_at,
        };
      });

      setRecommendations(formattedRecommendations);
    } catch (error) {
      console.error('Error fetching book recommendations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load book recommendations.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const handleAccept = async (recommendation: Recommendation) => {
    if (processingIds.has(recommendation.id)) return;
    
    try {
      setProcessingIds(prev => new Set(prev).add(recommendation.id));
      
      // Check if book already exists in user's library
      const { data: existingBook, error: checkError } = await supabase
        .from('books')
        .select('id')
        .eq('user_id', session?.user.id)
        .eq('title', recommendation.book.title)
        .eq('author', recommendation.book.author)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      // If book doesn't exist in user's library, add it
      if (!existingBook) {
        if (onAddToLibrary) {
          onAddToLibrary(recommendation.book);
        } else {
          // Add to Future Reads by default
          const { error: insertError } = await supabase
            .from('books')
            .insert({
              title: recommendation.book.title,
              author: recommendation.book.author,
              genre: recommendation.book.genre,
              image_url: recommendation.book.imageUrl,
              thumbnail_url: recommendation.book.thumbnailUrl,
              user_id: session?.user.id,
              format: recommendation.book.format,
              status: 'Future Reads',
              date_read: new Date().toISOString().split('T')[0]
            });
          
          if (insertError) throw insertError;
        }
      }
      
      // Update recommendation status
      const { error: updateError } = await supabase
        .from('book_recommendations')
        .update({ status: 'accepted' })
        .eq('id', recommendation.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Recommendation Accepted",
        description: `"${recommendation.book.title}" has been added to your library.`,
      });
      
      // Remove from list
      setRecommendations(prev => prev.filter(r => r.id !== recommendation.id));
    } catch (error) {
      console.error('Error accepting recommendation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept recommendation. Please try again.",
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(recommendation.id);
        return newSet;
      });
    }
  };
  
  const handleDecline = async (recommendationId: string) => {
    if (processingIds.has(recommendationId)) return;
    
    try {
      setProcessingIds(prev => new Set(prev).add(recommendationId));
      
      const { error } = await supabase
        .from('book_recommendations')
        .update({ status: 'declined' })
        .eq('id', recommendationId);
      
      if (error) throw error;
      
      toast({
        title: "Recommendation Declined",
        description: "The recommendation has been declined.",
      });
      
      // Remove from list
      setRecommendations(prev => prev.filter(r => r.id !== recommendationId));
    } catch (error) {
      console.error('Error declining recommendation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to decline recommendation. Please try again.",
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(recommendationId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Book Recommendations</h2>
        <div className="space-y-3">
          {[1, 2].map(i => (
            <Card key={i} className="overflow-hidden">
              <div className="flex p-4 gap-4">
                <Skeleton className="h-24 w-16 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex gap-2 mt-3">
                    <Skeleton className="h-9 w-16" />
                    <Skeleton className="h-9 w-16" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (recommendations.length === 0) {
    return null; // Don't render the component if there are no recommendations
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Book Recommendations</h2>
      <div className="space-y-3">
        {recommendations.map((recommendation) => (
          <Card key={recommendation.id} className="overflow-hidden">
            <div className="flex md:flex-row flex-col">
              <div className="flex p-4 gap-4 flex-1">
                <BookCover
                  imageUrl={recommendation.book.imageUrl}
                  thumbnailUrl={recommendation.book.thumbnailUrl}
                  genre={recommendation.book.genre}
                  title={recommendation.book.title}
                  size="sm"
                />
                <div className="space-y-2 min-w-0 flex-1">
                  <CardTitle className="font-serif line-clamp-1 text-book-title">
                    {recommendation.book.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    by {recommendation.book.author}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {recommendation.book.genre}
                    </Badge>
                  </div>
                  {recommendation.message && (
                    <CardContent className="p-0 pt-2">
                      <blockquote className="border-l-2 pl-3 italic text-muted-foreground text-sm line-clamp-2">
                        "{recommendation.message}"
                      </blockquote>
                    </CardContent>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>
                      Recommended by{" "}
                      <span className="font-medium">
                        {recommendation.from_user.username || recommendation.from_user.email}
                      </span>
                    </span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(recommendation.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
              <CardFooter className="flex justify-end p-4 pt-0 md:pt-4 gap-2">
                <Button
                  variant="outline"
                  size="sm" 
                  onClick={() => handleDecline(recommendation.id)}
                  disabled={processingIds.has(recommendation.id)}
                >
                  {processingIds.has(recommendation.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4 mr-1" />
                  )}
                  Decline
                </Button>
                <Button
                  variant="default"
                  size="sm" 
                  onClick={() => handleAccept(recommendation)}
                  disabled={processingIds.has(recommendation.id)}
                >
                  {processingIds.has(recommendation.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <BookPlus className="h-4 w-4 mr-1" />
                  )}
                  Add to Library
                </Button>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
