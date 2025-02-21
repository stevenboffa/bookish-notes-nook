import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookCover } from "@/components/BookCover";
import { AIBookRecommendation } from "@/types/books";

interface AIRecommendationsProps {
  title: string;
  books: AIBookRecommendation[];
}

export function AIRecommendations({ title, books }: AIRecommendationsProps) {
  return (
    <div className="space-y-4 mb-12">
      <h3 className="text-xl font-semibold">{title}</h3>
      {books && books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, index) => (
            <Card 
              key={`${book.title}-${index}`} 
              className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => book.amazonUrl ? window.open(book.amazonUrl, '_blank') : null}
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
}
