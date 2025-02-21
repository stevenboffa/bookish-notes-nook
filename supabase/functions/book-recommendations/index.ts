
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const googleBooksApiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Book {
  title: string;
  author: string;
  publicationYear: number;
  description: string;
  themes?: string[];
  imageUrl?: string;
  amazonUrl?: string;
  rating?: number;
}

async function getBookCover(title: string, author: string): Promise<string | undefined> {
  try {
    const query = encodeURIComponent(`${title} ${author}`);
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${googleBooksApiKey}`
    );
    const data = await response.json();
    if (data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail) {
      return data.items[0].volumeInfo.imageLinks.thumbnail;
    }
  } catch (error) {
    console.error('Error fetching book cover:', error);
  }
  return undefined;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { genre } = await req.json();

    const prompt = `You are a knowledgeable book curator. Please recommend 6 fantasy books based on these criteria:
- 3 award-winning or highly acclaimed books
- 3 recent releases from the past 2 years
For each book, provide:
- Title
- Author
- Publication year (between 1950 and 2024)
- A brief compelling description
- 2-3 major themes
- An estimated rating out of 5 (e.g., 4.5)

Format the response as a JSON array of books. Do not include any additional text or explanation.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a knowledgeable book curator who provides accurate, well-researched book recommendations.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    let books: Book[] = JSON.parse(data.choices[0].message.content);

    // Fetch book covers in parallel
    const bookCoversPromises = books.map(book => 
      getBookCover(book.title, book.author)
    );
    const bookCovers = await Promise.all(bookCoversPromises);

    // Add cover images to books
    books = books.map((book, index) => ({
      ...book,
      imageUrl: bookCovers[index],
    }));

    return new Response(JSON.stringify({ books }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in book-recommendations function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch book recommendations' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
