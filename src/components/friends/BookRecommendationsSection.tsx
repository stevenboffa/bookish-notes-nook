
import { useState, useEffect } from "react";
import { ChevronDown, BookPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Book } from "@/types/books";
import { BookDetailView } from "@/components/BookDetailView";
import { BookRecommendationCard } from "./BookRecommendationCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface Recommendation {
  id: string;
  book: Book;
  sender: {
    id: string;
    email: string;
    username: string | null;
    avatar_url: string | null;
  };
  message: string | null;
  created_at: string;
}

export function BookRecommendationsSection() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user.id) {
      fetchRecommendations();
    }
  }, [session?.user.id]);

  const fetchRecommendations = async () => {
    if (!session?.user.id) return;
    
    try {
      setIsLoading(true);
      console.log('Fetching recommendations for user:', session.user.id);
      
      // Get all pending recommendations for the current user
      const { data, error } = await supabase
        .from('book_recommendations')
        .select(`
          id,
          message,
          created_at,
          book_id,
          from_user_id,
          status
        `)
        .eq('to_user_id', session.user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
      }
      
      console.log('Fetched recommendations:', data);
      
      if (!data || data.length === 0) {
        setRecommendations([]);
        setIsLoading(false);
        return;
      }
      
      // Fetch the sender profiles separately
      const senderIds = [...new Set(data.map(item => item.from_user_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, username, avatar_url')
        .in('id', senderIds);
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      // Map profiles by ID for easy lookup
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
      
      // Fetch the book details for each recommendation
      const recommendationsWithBooks = await Promise.all(
        data.map(async (rec) => {
          const { data: bookData, error: bookError } = await supabase
            .from('books')
            .select('*')
            .eq('id', rec.book_id)
            .single();
            
          if (bookError) {
            console.error('Error fetching book details:', bookError);
            return null;
          }
          
          const senderProfile = profilesMap.get(rec.from_user_id);
          
          return {
            id: rec.id,
            message: rec.message,
            created_at: rec.created_at,
            sender: {
              id: senderProfile?.id || '',
              email: senderProfile?.email || '',
              username: senderProfile?.username,
              avatar_url: senderProfile?.avatar_url
            },
            book: {
              id: bookData.id,
              title: bookData.title,
              author: bookData.author,
              genre: bookData.genre || "",
              status: bookData.status || "Not started",
              format: bookData.format,
              rating: bookData.rating || 0,
              imageUrl: bookData.image_url,
              thumbnailUrl: bookData.thumbnail_url,
              description: bookData.description || "",
              dateRead: bookData.date_read,
              isFavorite: bookData.is_favorite || false,
              notes: [],
              quotes: [],
              collections: bookData.collections || [],
            } as Book
          };
        })
      );
      
      // Filter out any null values (failed book fetches)
      const filteredRecommendations = recommendationsWithBooks.filter(Boolean) as Recommendation[];
      console.log('Setting recommendations to:', filteredRecommendations);
      setRecommendations(filteredRecommendations);
      
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load book recommendations"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendationAction = async (recommendationId: string) => {
    console.log('Recommendation action for ID:', recommendationId);
    
    // 1. Remove the recommendation from the local state immediately for better UX
    setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
    
    // 2. Refresh recommendations from the server to ensure we're in sync
    // Delay this slightly to ensure the database has time to update
    setTimeout(() => {
      fetchRecommendations();
    }, 500);
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
  };

  const handleSaveBook = async (book: Book) => {
    toast({
      title: "Book Updated",
      description: "Your changes have been saved"
    });
    setSelectedBook(null);
  };

  return (
    <>
      {selectedBook ? (
        <BookDetailView
          book={selectedBook}
          onSave={handleSaveBook}
          onClose={() => setSelectedBook(null)}
          collections={[]}
        />
      ) : (
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full mb-6 border rounded-lg overflow-hidden bg-card"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <BookPlus className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Book Recommendations</h3>
              {recommendations.length > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                  {recommendations.length}
                </span>
              )}
            </div>
            <CollapsibleTrigger asChild>
              <button className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-muted">
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                <span className="sr-only">Toggle recommendations</span>
              </button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <div className="p-4">
              {isLoading ? (
                // Loading skeletons
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <Skeleton className="h-16 w-12 rounded" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <BookRecommendationCard
                      key={rec.id}
                      recommendation={rec}
                      onViewBook={setSelectedBook}
                      onUpdate={() => handleRecommendationAction(rec.id)}
                    />
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    You don't have any book recommendations right now.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </>
  );
}
