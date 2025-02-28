
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/BookCover";
import { AIBookRecommendation, Book } from "@/types/books";
import { AIRecommendations } from "@/components/books/AIRecommendations";
import { Loader2, BookOpen, RefreshCw } from "lucide-react";

export function BookRecommendationWidget() {
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<AIBookRecommendation[]>([]);
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserBooks();
    }
  }, [session?.user?.id]);

  const fetchUserBooks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('id, title, author, genre')
        .eq('user_id', session?.user?.id);

      if (error) throw error;
      
      setUserBooks(data || []);
      
      if (data && data.length > 0) {
        await generateRecommendations(data);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user books:", error);
      setIsLoading(false);
    }
  };

  const generateRecommendations = async (books: Book[]) => {
    try {
      if (books.length === 0) {
        setIsLoading(false);
        return;
      }

      // Extract genres and authors for recommendation
      const genres = books.map(book => book.genre).filter(Boolean);
      const authors = books.map(book => book.author).filter(Boolean);
      
      // Create sample recommendations based on user's reading history
      // In a real application, this would call an AI service or recommendation algorithm
      const sampleRecommendations: AIBookRecommendation[] = [
        {
          title: "The Midnight Library",
          author: "Matt Haig",
          publicationYear: "2020",
          description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
          themes: ["Fiction", "Fantasy", "Self-Discovery"],
          rating: "4.5",
          imageUrl: "https://m.media-amazon.com/images/I/81tCtHFtOgL._AC_UF1000,1000_QL80_.jpg",
          amazonUrl: "https://www.amazon.com/Midnight-Library-Matt-Haig/dp/0525559477"
        },
        {
          title: "The Song of Achilles",
          author: "Madeline Miller",
          publicationYear: "2012",
          description: "A tale of gods, kings, immortal fame, and the human heart, this is a profoundly moving retelling of the Iliad from the perspective of Patroclus.",
          themes: ["Historical Fiction", "Mythology", "LGBTQ+"],
          rating: "4.7",
          imageUrl: "https://m.media-amazon.com/images/I/81G+l8AhsHL._AC_UF1000,1000_QL80_.jpg",
          amazonUrl: "https://www.amazon.com/Song-Achilles-Madeline-Miller/dp/0062060627"
        },
        {
          title: "Project Hail Mary",
          author: "Andy Weir",
          publicationYear: "2021",
          description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.",
          themes: ["Science Fiction", "Space", "Adventure"],
          rating: "4.8",
          imageUrl: "https://m.media-amazon.com/images/I/91oup5w6Q4L._AC_UF1000,1000_QL80_.jpg",
          amazonUrl: "https://www.amazon.com/Project-Hail-Mary-Andy-Weir/dp/0593135202"
        }
      ];

      setRecommendations(sampleRecommendations);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setIsLoading(false);
    }
  };

  const refreshRecommendations = () => {
    setIsLoading(true);
    generateRecommendations(userBooks);
  };

  if (userBooks.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Book Recommendations
          </CardTitle>
          <CardDescription>
            Add books to your collection to get personalized recommendations
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Recommended for You
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshRecommendations}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <AIRecommendations 
          title="" 
          books={recommendations} 
          isLoading={isLoading} 
        />
      )}
    </div>
  );
}
