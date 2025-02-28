
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
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
        .select('id, title, author, genre, rating, is_favorite, status')
        .eq('user_id', session?.user?.id);

      if (error) throw error;
      
      const formattedBooks: Book[] = data.map((book: any) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre || '',
        rating: book.rating,
        isFavorite: book.is_favorite,
        status: book.status
      }));
      
      setUserBooks(formattedBooks);
      
      if (formattedBooks && formattedBooks.length > 0) {
        await generateRecommendations(formattedBooks);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user books:", error);
      setIsLoading(false);
    }
  };

  // This is the sample book database we'll use for recommendations
  // In a real app, this would come from an API or database
  const bookDatabase: AIBookRecommendation[] = [
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
    },
    {
      title: "The House in the Cerulean Sea",
      author: "TJ Klune",
      publicationYear: "2020",
      description: "A magical island. A dangerous task. A burning secret.",
      themes: ["Fantasy", "LGBTQ+", "Fiction"],
      rating: "4.6",
      imageUrl: "https://m.media-amazon.com/images/I/71atgpkaLSL._AC_UF1000,1000_QL80_.jpg",
      amazonUrl: "https://www.amazon.com/House-Cerulean-Sea-TJ-Klune/dp/1250217288"
    },
    {
      title: "A Gentleman in Moscow",
      author: "Amor Towles",
      publicationYear: "2016",
      description: "In 1922, Count Alexander Rostov is deemed an unrepentant aristocrat and is sentenced to house arrest in the Metropol, a grand hotel across the street from the Kremlin.",
      themes: ["Historical Fiction", "Literary Fiction", "Russia"],
      rating: "4.7",
      imageUrl: "https://m.media-amazon.com/images/I/91LQ1bR6cHL._AC_UF1000,1000_QL80_.jpg",
      amazonUrl: "https://www.amazon.com/Gentleman-Moscow-Novel-Amor-Towles/dp/0143110632"
    },
    {
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      publicationYear: "2018",
      description: "For years, rumors of the 'Marsh Girl' have haunted Barkley Cove, a quiet town on the North Carolina coast.",
      themes: ["Literary Fiction", "Mystery", "Romance"],
      rating: "4.8",
      imageUrl: "https://m.media-amazon.com/images/I/81O1oy0y9eL._AC_UF1000,1000_QL80_.jpg",
      amazonUrl: "https://www.amazon.com/Where-Crawdads-Sing-Delia-Owens/dp/0735219095"
    },
    {
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      publicationYear: "2017",
      description: "Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.",
      themes: ["Historical Fiction", "LGBTQ+", "Romance"],
      rating: "4.6",
      imageUrl: "https://m.media-amazon.com/images/I/717YCGLeUxL._AC_UF1000,1000_QL80_.jpg",
      amazonUrl: "https://www.amazon.com/Seven-Husbands-Evelyn-Hugo-Novel/dp/1501161938"
    },
    {
      title: "Educated",
      author: "Tara Westover",
      publicationYear: "2018",
      description: "An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
      themes: ["Memoir", "Biography", "Education"],
      rating: "4.7",
      imageUrl: "https://m.media-amazon.com/images/I/81NwOj14S6L._AC_UF1000,1000_QL80_.jpg",
      amazonUrl: "https://www.amazon.com/Educated-Memoir-Tara-Westover/dp/0399590501"
    },
    {
      title: "The Invisible Life of Addie LaRue",
      author: "V.E. Schwab",
      publicationYear: "2020",
      description: "A life no one will remember. A story you will never forget.",
      themes: ["Fantasy", "Historical Fiction", "Romance"],
      rating: "4.5",
      imageUrl: "https://m.media-amazon.com/images/I/515Su542DYL._AC_UF1000,1000_QL80_.jpg",
      amazonUrl: "https://www.amazon.com/Invisible-Life-Addie-LaRue/dp/0765387565"
    },
    {
      title: "Circe",
      author: "Madeline Miller",
      publicationYear: "2018",
      description: "In the house of Helios, god of the sun and mightiest of the Titans, a daughter is born. But Circe is a strange child—not powerful like her father, nor viciously alluring like her mother.",
      themes: ["Mythology", "Fantasy", "Historical Fiction"],
      rating: "4.6",
      imageUrl: "https://m.media-amazon.com/images/I/71Xwry1KEzL._AC_UF1000,1000_QL80_.jpg",
      amazonUrl: "https://www.amazon.com/Circe-Madeline-Miller/dp/0316556343"
    }
  ];

  const generateRecommendations = async (books: Book[]) => {
    try {
      if (books.length === 0) {
        setIsLoading(false);
        return;
      }

      // Get the books a user has in any status 
      const userBookKeys = books.map(book => 
        `${book.title.toLowerCase()}|${book.author.toLowerCase()}`
      );
      
      // Analyze user preferences
      const genrePreferences = analyzeGenres(books);
      const authorPreferences = analyzeAuthors(books);
      const highlyRatedGenres = findHighlyRatedGenres(books);
      
      console.log("Genre preferences:", genrePreferences);
      console.log("Author preferences:", authorPreferences);
      console.log("Highly rated genres:", highlyRatedGenres);
      
      // Score each potential recommendation
      const scoredRecommendations = bookDatabase.map(book => {
        // Skip books the user already has (with any status)
        const bookKey = `${book.title.toLowerCase()}|${book.author.toLowerCase()}`;
        if (userBookKeys.includes(bookKey)) {
          return { book, score: -1 }; // Negative score means "don't recommend"
        }
        
        let score = 0;
        
        // 1. Genre matching - if the book's themes match user's preferred genres
        const bookGenres = book.themes.map(theme => theme.toLowerCase());
        for (const genre of bookGenres) {
          const genreScore = genrePreferences[genre.toLowerCase()] || 0;
          score += genreScore;
          
          // Bonus for highly rated genres
          if (highlyRatedGenres.includes(genre.toLowerCase())) {
            score += 2;
          }
        }
        
        // 2. Author matching - if the author matches user's read authors
        const authorScore = authorPreferences[book.author.toLowerCase()] || 0;
        score += authorScore * 3; // Weight author matches more heavily
        
        // 3. Rating boost - books with high ratings get a bonus
        score += parseFloat(book.rating) / 2;
        
        return { book, score };
      });
      
      // Filter out books the user already has
      const validRecommendations = scoredRecommendations.filter(item => item.score >= 0);
      
      // Sort by score and take top 3
      validRecommendations.sort((a, b) => b.score - a.score);
      const topRecommendations = validRecommendations.slice(0, 3).map(item => item.book);
      
      console.log("Top recommendations:", topRecommendations);
      
      setRecommendations(topRecommendations);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setIsLoading(false);
    }
  };
  
  // Analyze which genres the user prefers
  const analyzeGenres = (books: Book[]) => {
    const genreCounts: Record<string, number> = {};
    
    books.forEach(book => {
      if (book.genre) {
        const genre = book.genre.toLowerCase();
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      }
    });
    
    return genreCounts;
  };
  
  // Analyze which authors the user prefers
  const analyzeAuthors = (books: Book[]) => {
    const authorCounts: Record<string, number> = {};
    
    books.forEach(book => {
      const author = book.author.toLowerCase();
      authorCounts[author] = (authorCounts[author] || 0) + 1;
    });
    
    return authorCounts;
  };
  
  // Find genres that the user rated highly
  const findHighlyRatedGenres = (books: Book[]) => {
    const genreRatings: Record<string, { total: number, count: number }> = {};
    
    books.forEach(book => {
      if (book.genre && book.rating && book.rating >= 4) {
        const genre = book.genre.toLowerCase();
        if (!genreRatings[genre]) {
          genreRatings[genre] = { total: 0, count: 0 };
        }
        genreRatings[genre].total += book.rating;
        genreRatings[genre].count += 1;
      }
    });
    
    // Find genres with average rating >= 4
    return Object.entries(genreRatings)
      .filter(([_, { total, count }]) => (total / count) >= 4)
      .map(([genre, _]) => genre);
  };

  const refreshRecommendations = () => {
    setIsLoading(true);
    generateRecommendations(userBooks);
  };

  if (userBooks.length === 0) {
    return (
      <div className="mb-6">
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <div className="flex items-center mb-2">
            <BookOpen className="mr-2 h-5 w-5" />
            <h3 className="text-lg font-semibold">Book Recommendations</h3>
          </div>
          <p className="text-sm text-gray-500">
            Add books to your collection to get personalized recommendations
          </p>
        </div>
      </div>
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
