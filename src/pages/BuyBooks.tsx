import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { bookRecommendations } from "@/data/bookRecommendations";
import type { AIBookRecommendation } from "@/types/books";
import { fetchBookCover } from "@/utils/googleBooks";

const categories = {
  fiction: [
    {
        title: "Science Fiction",
      description: "Explore the frontiers of imagination with cutting-edge science fiction.",
      category: "science-fiction",
      },
      {
        title: "Fantasy",
      description: "Journey into magical realms and epic adventures.",
      category: "fantasy",
    },
    {
        title: "Mystery & Thriller",
      description: "Unravel mysteries and experience heart-pounding suspense.",
      category: "mystery-thriller",
    },
    {
      title: "Romance",
      description: "Fall in love with captivating stories of romance and relationships.",
      category: "romance",
    },
    {
      title: "Literary Fiction",
      description: "Dive into thought-provoking works of literary excellence.",
      category: "literary-fiction",
    },
  ],
  nonfiction: [
    {
        title: "Biography & Memoir",
      description: "Discover inspiring life stories and personal journeys.",
      category: "biography-memoir",
      },
      {
        title: "History",
      description: "Travel through time with fascinating historical accounts.",
      category: "history",
    },
    {
      title: "Science & Nature",
      description: "Explore the wonders of science and the natural world.",
      category: "science-nature",
    },
    {
        title: "Business & Economics",
      description: "Learn about markets, entrepreneurship, and economic insights.",
      category: "business-economics",
    },
    {
      title: "Self-Development",
      description: "Grow personally and professionally with transformative books.",
      category: "self-development",
    },
  ],
};

function BookCard({ book }: { book: AIBookRecommendation }) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCover() {
      try {
        setIsLoading(true);
        setError(null);
        console.log(`Loading cover for: ${book.title} by ${book.author}`);
        const url = await fetchBookCover(book.title, book.author);
        console.log(`Cover URL result for ${book.title}:`, url);
        setCoverUrl(url);
      } catch (err) {
        console.error(`Error loading cover for ${book.title}:`, err);
        setError(err instanceof Error ? err.message : 'Failed to load cover');
      } finally {
        setIsLoading(false);
      }
    }
    loadCover();
  }, [book.title, book.author]);

  return (
    <Card className="w-[300px] overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-[2/3] bg-muted">
        {isLoading ? (
          <div className="w-full h-full animate-pulse bg-muted" />
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
            Failed to load cover
          </div>
        ) : (
          <img
            src={coverUrl || '/placeholder-book.jpg'}
            alt={book.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              console.error(`Image load error for ${book.title}:`, e);
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-book.jpg';
            }}
          />
        )}
        {book.awards && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90 text-black">
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
          <span className="text-sm font-medium">{book.rating} ★</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {book.themes.map((theme, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {theme}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
            View on Amazon
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

function BookSection({ title, books }: { title: string; books: AIBookRecommendation[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {books.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>
    </div>
  );
}

export default function BuyBooks() {
  const [activeTab, setActiveTab] = useState("fiction");
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (direction: "left" | "right") => {
    const scrollAmount = 300;
    const newPosition = direction === "left" 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount;
    setScrollPosition(newPosition);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Buy Books</h1>
      
      <Tabs defaultValue="fiction" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start mb-8">
          <TabsTrigger value="fiction">Fiction</TabsTrigger>
          <TabsTrigger value="nonfiction">Non-Fiction</TabsTrigger>
        </TabsList>

        <TabsContent value="fiction" className="space-y-12">
          {categories.fiction.map((category) => (
            <div key={category.category} className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
        <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleScroll("left")}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleScroll("right")}
                    className="rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
              <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex gap-6 p-4" style={{ transform: `translateX(${scrollPosition}px)` }}>
                  {bookRecommendations[category.category] && (
                    <>
                      <BookSection
                        title="Award-Winning Books"
                        books={bookRecommendations[category.category]["award-winning"]}
                      />
                      <BookSection
                        title="New Releases"
                        books={bookRecommendations[category.category]["new"]}
                      />
                    </>
            )}
          </div>
              </ScrollArea>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="nonfiction" className="space-y-12">
          {categories.nonfiction.map((category) => (
            <div key={category.category} className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleScroll("left")}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleScroll("right")}
                    className="rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex gap-6 p-4" style={{ transform: `translateX(${scrollPosition}px)` }}>
                  {bookRecommendations[category.category] && (
                    <>
                      <BookSection
                        title="Award-Winning Books"
                        books={bookRecommendations[category.category]["award-winning"]}
                      />
                      <BookSection
                        title="New Releases"
                        books={bookRecommendations[category.category]["new"]}
                      />
                    </>
          )}
        </div>
              </ScrollArea>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
