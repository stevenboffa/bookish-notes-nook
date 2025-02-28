
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookCover } from "@/components/BookCover";
import { AIBookRecommendation } from "@/types/books";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface AIRecommendationsProps {
  title: string;
  books: AIBookRecommendation[];
  isLoading?: boolean;
}

export function AIRecommendations({ title, books, isLoading }: AIRecommendationsProps) {
  const isMobile = useIsMobile();

  const renderBookCard = (book: AIBookRecommendation, index: number) => (
    <Card 
      key={`${book.title}-${index}`} 
      className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow h-full"
      onClick={() => book.amazonUrl ? window.open(book.amazonUrl, '_blank') : null}
    >
      <CardHeader className="space-y-4">
        <div className="aspect-w-2 aspect-h-3 flex items-center justify-center">
          <BookCover
            imageUrl={book.imageUrl}
            thumbnailUrl={book.imageUrl}
            genre={book.themes?.[0] || "Fiction"}
            title={book.title}
          />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
          <CardDescription className="space-y-1">
            <div>by {book.author}</div>
            <div>({book.publicationYear})</div>
            {book.rating && (
              <div>Rating: {book.rating}/5</div>
            )}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <div className="text-sm text-muted-foreground line-clamp-3">
          {book.description}
        </div>
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
  );

  const renderMobileCarousel = () => (
    <Carousel className="w-full">
      <CarouselContent>
        {books.map((book, index) => (
          <CarouselItem key={`${book.title}-${index}`}>
            {renderBookCard(book, index)}
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-4">
        <CarouselPrevious className="relative static mr-2" />
        <CarouselNext className="relative static ml-2" />
      </div>
    </Carousel>
  );

  const renderDesktopGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book, index) => renderBookCard(book, index))}
    </div>
  );

  const renderLoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="flex flex-col">
          <CardHeader className="space-y-4">
            <div className="aspect-w-2 aspect-h-3">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-4 mb-12">
      {title && <h3 className="text-xl font-semibold">{title}</h3>}
      
      {isLoading ? (
        renderLoadingState()
      ) : books && books.length > 0 ? (
        isMobile ? renderMobileCarousel() : renderDesktopGrid()
      ) : (
        <p className="text-muted-foreground text-center py-4">No books found</p>
      )}
    </div>
  );
}
