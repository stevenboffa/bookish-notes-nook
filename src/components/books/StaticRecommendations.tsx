import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AIBookRecommendation } from "@/types/books";
import { Star, BookOpen, Users, Award, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StaticRecommendationsProps {
  title: string;
  category: string;
  section: 'award-winning' | 'new';
}

export function StaticRecommendations({ title, category, section }: StaticRecommendationsProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['static-recommendations', category, section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('static_book_recommendations')
        .select('books')
        .eq('category', category)
        .eq('section', section)
        .single();

      if (error) throw error;
      return data.books as AIBookRecommendation[];
    },
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });

  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages(prev => new Set([...prev, imageUrl]));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-6 w-3/4 mt-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations?.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((book, index) => (
          <Card 
            key={index} 
            className="overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="relative aspect-[2/3]">
              {!loadedImages.has(book.imageUrl || '') && (
                <Skeleton className="w-full h-full" />
              )}
              <img
                src={book.imageUrl || '/placeholder-book.jpg'}
                alt={book.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  loadedImages.has(book.imageUrl || '') ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
                onLoad={() => book.imageUrl && handleImageLoad(book.imageUrl)}
              />
              {book.awards && (
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    <Award className="w-4 h-4 mr-1" />
                    {book.awards}
                  </Badge>
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-xl line-clamp-2">{book.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {book.author} • {book.publicationYear}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-4">{book.description}</p>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium">{book.rating}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {book.themes.map((theme, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {theme}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span>{book.readingDifficulty} • {book.pageCount} pages</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{book.targetAudience}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <p className="text-sm font-medium italic line-clamp-1">{book.hook}</p>
              <Button asChild variant="outline" size="sm">
                <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
                  View on Amazon
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 