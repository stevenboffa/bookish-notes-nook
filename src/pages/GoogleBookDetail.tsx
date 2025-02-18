import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/BookCover";
import { ArrowLeft, Loader, ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GoogleBook {
  id?: string;
  volumeInfo: {
    title: string;
    authors: string[];
    description: string;
    publisher?: string;
    publishedDate: string;
    imageLinks?: {
      thumbnail: string;
      smallThumbnail: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    categories?: string[];
    pageCount?: number;
    averageRating?: number;
    ratingsCount?: number;
  };
  saleInfo?: {
    buyLink?: string;
    saleability?: string;
    listPrice?: {
      amount: number;
      currencyCode: string;
    };
  };
  affiliateLinks?: {
    amazon?: string;
    goodreads?: string;
  };
}

function createAmazonLink(book: GoogleBook | undefined): string | null {
  if (!book?.volumeInfo?.industryIdentifiers?.length) {
    if (book?.affiliateLinks?.amazon) {
      return book.affiliateLinks.amazon;
    }
    
    if (book?.volumeInfo?.title && book?.volumeInfo?.authors?.[0]) {
      const searchQuery = `${book.volumeInfo.title} ${book.volumeInfo.authors[0]}`.trim();
      const encodedQuery = encodeURIComponent(searchQuery);
      return `https://www.amazon.com/s?k=${encodedQuery}&i=stripbooks&tag=ps4fans06-20`;
    }
    return null;
  }

  const isbn13 = book.volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_13')?.identifier;
  const isbn10 = book.volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_10')?.identifier;
  const identifier = isbn13 || isbn10;

  if (!identifier) return null;

  const searchQuery = `${book.volumeInfo.title} ${book.volumeInfo.authors?.[0] || ''}`.trim();
  const encodedQuery = encodeURIComponent(searchQuery);
  return `https://www.amazon.com/s?k=${encodedQuery}&i=stripbooks&rh=p_66:${identifier}&tag=ps4fans06-20`;
}

export default function GoogleBookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  if (id?.startsWith('ai/')) {
    const bookData = location.state?.book;
    if (!bookData) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Book details not found. Please try again."
      });
      return (
        <div className="container mx-auto p-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Book details not found</p>
          </div>
        </div>
      );
    }
    return renderBookDetail(bookData);
  }

  const { data: book, isLoading } = useQuery({
    queryKey: ['google-book', id],
    queryFn: async () => {
      try {
        console.log("Fetching book details for ID:", id);
        
        const { data, error } = await supabase.functions.invoke<GoogleBook>('search-books', {
          body: { bookId: id }
        });

        if (error) {
          console.error('Error fetching book details:', error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Error fetching Google book:', error);
        throw error;
      }
    },
    retry: false,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto p-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Book details not found</p>
        </div>
      </div>
    );
  }

  function renderBookDetail(book: GoogleBook) {
    return (
      <div className="container mx-auto p-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <BookCover
              imageUrl={book.volumeInfo?.imageLinks?.thumbnail}
              thumbnailUrl={book.volumeInfo?.imageLinks?.smallThumbnail}
              genre={book.volumeInfo?.categories?.[0] || 'Science Fiction'}
              title={book.volumeInfo?.title || 'Unknown Title'}
              size="lg"
              className="mx-auto"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{book.volumeInfo?.title}</h1>
              <p className="text-xl text-muted-foreground">
                by {book.volumeInfo?.authors?.join(', ') || 'Unknown Author'}
              </p>
            </div>

            <div className="space-y-2">
              {book.volumeInfo?.publisher && (
                <p className="text-sm text-muted-foreground">
                  Published by {book.volumeInfo.publisher} ({book.volumeInfo.publishedDate})
                </p>
              )}
              {!book.volumeInfo?.publisher && book.volumeInfo?.publishedDate && (
                <p className="text-sm text-muted-foreground">
                  Published: {book.volumeInfo.publishedDate}
                </p>
              )}
              {book.volumeInfo?.industryIdentifiers && (
                <p className="text-sm">
                  ISBN: {
                    book.volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_13')?.identifier ||
                    book.volumeInfo.industryIdentifiers[0]?.identifier ||
                    'N/A'
                  }
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">About this Book</h2>
              <p className="text-muted-foreground">{book.volumeInfo?.description || 'No description available'}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Details</h2>
              <div className="grid grid-cols-3 gap-4">
                {book.volumeInfo?.pageCount && (
                  <div className="p-4 bg-accent rounded-lg text-center">
                    <p className="text-2xl font-bold">{book.volumeInfo.pageCount}</p>
                    <p className="text-sm text-muted-foreground">Pages</p>
                  </div>
                )}
                {book.volumeInfo?.averageRating && (
                  <div className="p-4 bg-accent rounded-lg text-center">
                    <p className="text-2xl font-bold">{book.volumeInfo.averageRating}</p>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                )}
                {book.volumeInfo?.ratingsCount && (
                  <div className="p-4 bg-accent rounded-lg text-center">
                    <p className="text-2xl font-bold">{book.volumeInfo.ratingsCount}</p>
                    <p className="text-sm text-muted-foreground">Reviews</p>
                  </div>
                )}
              </div>
            </div>

            {(book.volumeInfo?.categories || book.volumeInfo?.categories?.[0]) && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Themes</h2>
                <div className="flex flex-wrap gap-2">
                  {(book.volumeInfo.categories || []).map((theme, i) => (
                    <span
                      key={i}
                      className="text-sm px-3 py-1 rounded-full bg-accent/20 text-accent-foreground"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Buy this Book</h2>
              <div className="flex flex-col gap-3">
                {createAmazonLink(book) && (
                  <a
                    href={createAmazonLink(book)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full" variant="default">
                      <ShoppingCart className="mr-2" />
                      Find on Amazon
                    </Button>
                  </a>
                )}
                {book.affiliateLinks?.goodreads && (
                  <a
                    href={book.affiliateLinks.goodreads}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full" variant="outline">
                      View on Goodreads
                    </Button>
                  </a>
                )}
                {book.saleInfo?.buyLink && (
                  <a
                    href={book.saleInfo.buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full" variant="secondary">
                      Buy on Google Books {book.saleInfo.listPrice && `($${book.saleInfo.listPrice.amount})`}
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return renderBookDetail(book);
}
