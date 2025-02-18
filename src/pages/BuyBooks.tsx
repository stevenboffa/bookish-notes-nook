import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";
import { BookCover } from "@/components/BookCover";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BookCategoryCard } from "@/components/BookCategoryCard";

interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    description: string;
    imageLinks?: {
      thumbnail: string;
      smallThumbnail: string;
    };
    categories: string[];
  };
}

interface AIBookRecommendation {
  title: string;
  author: string;
  publicationYear: string;
  description: string;
  rating?: string;
  themes: string[];
  imageUrl?: string;
  amazonUrl?: string;
}

const categories = [
  {
    id: "non-fiction",
    title: "Non-fiction",
    description: "Explore real-world stories and knowledge",
    query: "subject:non-fiction&maxResults=16&filter=paid-ebooks",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "science-fiction",
    title: "Science Fiction",
    description: "Journey into imaginative futures",
    query: "subject:science-fiction&maxResults=16&filter=paid-ebooks",
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "biography",
    title: "Biographies",
    description: "Discover remarkable life stories",
    query: "subject:biography+autobiography&maxResults=16&filter=paid-ebooks",
    imageUrl: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "classics",
    title: "Classics",
    description: "Timeless literary masterpieces",
    query: "subject:classic+literature&maxResults=16&filter=paid-ebooks",
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "new-releases",
    title: "New Releases",
    description: "Fresh off the press",
    query: "orderBy=newest&maxResults=16&filter=paid-ebooks",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "mystery",
    title: "Mystery",
    description: "Thrilling tales of suspense",
    query: "subject:mystery+thriller&maxResults=16&filter=paid-ebooks",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60",
  },
];

export default function BuyBooks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!session) {
      navigate("/");
    }
  }, [session, navigate]);

  const generateAmazonLink = (title: string, author: string) => {
    const searchQuery = `${title} ${author}`.trim();
    const encodedQuery = encodeURIComponent(searchQuery);
    return `https://www.amazon.com/s?k=${encodedQuery}&i=stripbooks&tag=ps4fans06-20`;
  };

  const { data: aiRecommendations, isLoading: isLoadingAI } = useQuery({
    queryKey: ['ai-recommendations', selectedCategory],
    queryFn: async () => {
      if (selectedCategory !== 'science-fiction') return { awardWinning: [], new: [] };

      try {
        console.log('Fetching award-winning books...');
        const awardWinningResponse = await supabase.functions.invoke<{ recommendations: AIBookRecommendation[] }>('book-recommendations', {
          body: { section: 'award-winning' }
        });

        console.log('Fetching new books...');
        const newBooksResponse = await supabase.functions.invoke<{ recommendations: AIBookRecommendation[] }>('book-recommendations', {
          body: { section: 'new' }
        });

        if (awardWinningResponse.error) {
          console.error('Award-winning books error:', awardWinningResponse.error);
          throw awardWinningResponse.error;
        }
        if (newBooksResponse.error) {
          console.error('New books error:', newBooksResponse.error);
          throw newBooksResponse.error;
        }

        console.log('Award-winning books:', awardWinningResponse.data);
        console.log('New books:', newBooksResponse.data);

        return {
          awardWinning: awardWinningResponse.data?.recommendations || [],
          new: newBooksResponse.data?.recommendations || []
        };
      } catch (error) {
        console.error('Error fetching AI recommendations:', error);
        throw error;
      }
    },
    enabled: selectedCategory === 'science-fiction',
    retry: 1
  });

  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ['google-books', searchQuery, selectedCategory],
    queryFn: async ({ signal }) => {
      if (selectedCategory === 'science-fiction') return [];
      
      try {
        console.log("Starting Google Books search...");
        
        let queryString = searchQuery.trim();
        if (!queryString && selectedCategory) {
          const category = categories.find(c => c.id === selectedCategory);
          queryString = category?.query || '';
        }
        
        const { data, error } = await supabase.functions.invoke<{ items: GoogleBook[] }>('search-books', {
          body: { 
            searchQuery: queryString || 'subject:fiction&orderBy=relevance&maxResults=16&filter=paid-ebooks',
            maxResults: 16
          }
        });

        if (error) throw error;

        const filteredBooks = (data?.items || []).filter((book: GoogleBook) => 
          book.volumeInfo.imageLinks && 
          book.volumeInfo.title &&
          book.volumeInfo.authors &&
          book.volumeInfo.description
        );

        return filteredBooks.slice(0, 16);
      } catch (error) {
        console.error('Error fetching Google books:', error);
        throw error;
      }
    },
    enabled: !!session && (!!searchQuery || (!!selectedCategory && selectedCategory !== 'science-fiction')),
    staleTime: 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to fetch books.'
      });
    }
  }, [error, toast]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setSelectedCategory(null);
    setIsSearching(true);
    setIsSearching(false);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSearchQuery("");
    setSelectedCategory(categoryId);
  };

  if (!session) return null;

  const renderSciFiSection = (title: string, books: AIBookRecommendation[]) => (
    <div className="space-y-4 mb-12">
      <h3 className="text-xl font-semibold">{title}</h3>
      {books && books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, index) => (
            <Card 
              key={`${book.title}-${index}`} 
              className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/book/ai/${encodeURIComponent(book.title)}`, { 
                state: { 
                  book: {
                    volumeInfo: {
                      title: book.title,
                      authors: [book.author],
                      description: book.description,
                      publishedDate: book.publicationYear,
                      imageLinks: {
                        thumbnail: book.imageUrl || undefined,
                        smallThumbnail: book.imageUrl || undefined
                      },
                      categories: book.themes,
                      averageRating: parseFloat(book.rating || "0") / 2,
                      ratingsCount: 1
                    },
                    saleInfo: {},
                    affiliateLinks: {
                      amazon: generateAmazonLink(book.title, book.author),
                      goodreads: null
                    }
                  }
                }
              })}
            >
              <CardHeader>
                <div className="aspect-w-2 aspect-h-3 mb-4">
                  <BookCover
                    imageUrl={book.imageUrl}
                    thumbnailUrl={book.imageUrl}
                    genre="Science Fiction"
                    title={book.title}
                  />
                </div>
                <CardTitle className="text-lg">{book.title}</CardTitle>
                <CardDescription>
                  by {book.author} ({book.publicationYear})
                  {book.rating && <div className="mt-1">Rating: {book.rating}</div>}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                <p className="text-sm text-muted-foreground">{book.description}</p>
                {book.themes && book.themes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {book.themes.map((theme, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent-foreground"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4">No books found</p>
      )}
    </div>
  );

  return (
    <div className="flex-1 container mx-auto p-4 space-y-8 pb-32">
      <h1 className="text-2xl font-bold">Buy Books</h1>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search by title, author, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {!searchQuery && !selectedCategory ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Browse Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <BookCategoryCard
                key={category.id}
                title={category.title}
                description={category.description}
                imageUrl={category.imageUrl}
                onClick={() => handleCategorySelect(category.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {selectedCategory 
                ? categories.find(c => c.id === selectedCategory)?.title 
                : 'Search Results'}
            </h2>
            {selectedCategory && (
              <Button variant="ghost" onClick={() => setSelectedCategory(null)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
            )}
          </div>
          
          {isLoading || isLoadingAI ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : selectedCategory === 'science-fiction' ? (
            <div className="space-y-12">
              {renderSciFiSection("Award-Winning Science Fiction", aiRecommendations.awardWinning)}
              {renderSciFiSection("New Science Fiction Releases", aiRecommendations.new)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {books.map((book) => (
                <Card 
                  key={book.id} 
                  className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <CardHeader className="flex-1">
                    <div className="aspect-w-2 aspect-h-3 mb-4">
                      <BookCover
                        imageUrl={book.volumeInfo.imageLinks?.thumbnail}
                        thumbnailUrl={book.volumeInfo.imageLinks?.smallThumbnail}
                        genre={book.volumeInfo.categories?.[0] || 'Unknown'}
                        title={book.volumeInfo.title}
                      />
                    </div>
                    <CardTitle className="text-lg">{book.volumeInfo.title}</CardTitle>
                    <CardDescription>
                      by {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {book.volumeInfo.description || 'No description available'}
                    </p>
                  </CardContent>
                </Card>
              ))}
              {books.length === 0 && !error && (
                <p className="col-span-full text-center text-muted-foreground py-8">
                  No books found
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
