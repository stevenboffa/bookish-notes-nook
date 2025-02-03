import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/BookCover";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface NYTBookDetail {
  title: string;
  author: string;
  book_image: string;
  description: string;
  publisher: string;
  primary_isbn13: string;
  amazon_product_url: string;
  rank: number;
  rank_last_week: number;
  weeks_on_list: number;
}

export default function NYTBookDetail() {
  const { isbn } = useParams();
  const navigate = useNavigate();

  const { data: book, isLoading } = useQuery({
    queryKey: ['nyt-book-detail', isbn],
    queryFn: async () => {
      const { data: secretData } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'NYT_API_KEY')
        .maybeSingle();

      if (!secretData?.value) {
        throw new Error('NYT API key not found');
      }

      const response = await fetch(
        `https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?isbn=${isbn}&api-key=${secretData.value}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch book details');
      }

      const data = await response.json();
      return data.results[0] as NYTBookDetail;
    },
    enabled: !!isbn,
  });

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
            imageUrl={book.book_image}
            thumbnailUrl={book.book_image}
            genre="Fiction"
            title={book.title}
            size="lg"
            className="mx-auto"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground">by {book.author}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Published by {book.publisher}</p>
            <p className="text-sm">ISBN: {book.primary_isbn13}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">About this Book</h2>
            <p className="text-muted-foreground">{book.description}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">NYT Bestseller Stats</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-accent rounded-lg text-center">
                <p className="text-2xl font-bold">{book.rank}</p>
                <p className="text-sm text-muted-foreground">Current Rank</p>
              </div>
              <div className="p-4 bg-accent rounded-lg text-center">
                <p className="text-2xl font-bold">{book.rank_last_week || "N/A"}</p>
                <p className="text-sm text-muted-foreground">Last Week</p>
              </div>
              <div className="p-4 bg-accent rounded-lg text-center">
                <p className="text-2xl font-bold">{book.weeks_on_list}</p>
                <p className="text-sm text-muted-foreground">Weeks on List</p>
              </div>
            </div>
          </div>

          <a
            href={book.amazon_product_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button className="w-full">View on Amazon</Button>
          </a>
        </div>
      </div>
    </div>
  );
}