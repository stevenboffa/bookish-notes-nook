import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/BookCover";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    description: string;
    publisher: string;
    publishedDate: string;
    imageLinks?: {
      thumbnail: string;
      smallThumbnail: string;
    };
    industryIdentifiers: Array<{
      type: string;
      identifier: string;
    }>;
    categories: string[];
    pageCount: number;
    averageRating?: number;
    ratingsCount?: number;
  };
  saleInfo: {
    buyLink?: string;
    saleability: string;
    listPrice?: {
      amount: number;
      currencyCode: string;
    };
  };
}

export default function GoogleBookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['google-book', id],
    queryFn: async ({ signal }) => {
      console.log("Fetching book details for ID:", id);
      
      const { data: secretData } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'GOOGLE_BOOKS_API_KEY')
        .maybeSingle();

      if (!secretData?.value) {
        throw new Error('Google Books API key not found');
      }

      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${id}?key=${secretData.value}`,
        { signal }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch book details');
      }

      const data = await response.json();
      return data as GoogleBook;
    },
    retry: false,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to load book details"
    });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
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

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <BookCover
            imageUrl={book.volumeInfo.imageLinks?.thumbnail || '/placeholder.svg'}
            thumbnailUrl={book.volumeInfo.imageLinks?.smallThumbnail || '/placeholder.svg'}
            genre={book.volumeInfo.categories?.[0] || 'Unknown'}
            title={book.volumeInfo.title}
            size="lg"
            className="mx-auto"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{book.volumeInfo.title}</h1>
            <p className="text-xl text-muted-foreground">
              by {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Published by {book.volumeInfo.publisher || 'Unknown Publisher'} ({book.volumeInfo.publishedDate})
            </p>
            <p className="text-sm">
              ISBN: {
                book.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier ||
                book.volumeInfo.industryIdentifiers?.[0]?.identifier ||
                'N/A'
              }
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">About this Book</h2>
            <p className="text-muted-foreground">{book.volumeInfo.description || 'No description available'}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-accent rounded-lg text-center">
                <p className="text-2xl font-bold">{book.volumeInfo.pageCount || 'N/A'}</p>
                <p className="text-sm text-muted-foreground">Pages</p>
              </div>
              <div className="p-4 bg-accent rounded-lg text-center">
                <p className="text-2xl font-bold">{book.volumeInfo.averageRating || 'N/A'}</p>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
              <div className="p-4 bg-accent rounded-lg text-center">
                <p className="text-2xl font-bold">{book.volumeInfo.ratingsCount || 0}</p>
                <p className="text-sm text-muted-foreground">Reviews</p>
              </div>
            </div>
          </div>

          {book.saleInfo.buyLink && (
            <a
              href={book.saleInfo.buyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full"
            >
              <Button className="w-full">
                Buy Now {book.saleInfo.listPrice && `($${book.saleInfo.listPrice.amount})`}
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}