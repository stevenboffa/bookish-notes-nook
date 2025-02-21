import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const googleBooksApiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AMAZON_AFFILIATE_TAG = 'ps4fans06-20'; // Updated with your actual affiliate tag

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

function generateAmazonUrl(title: string, author: string): string {
  const searchQuery = encodeURIComponent(`${title} ${author}`);
  return `https://www.amazon.com/s?k=${searchQuery}&tag=${AMAZON_AFFILIATE_TAG}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { section, category } = await req.json();
    console.log(`Generating ${section} ${category} recommendations...`);

    let systemPrompt = '';
    if (section === 'award-winning') {
      systemPrompt = `You are a knowledgeable book curator. Please recommend 15 award-winning or highly acclaimed ${category} books.
For each book, provide:
- Title
- Author
- Publication year (between 1950 and 2024)
- A brief compelling description (max 150 characters)
- 2-3 major themes
- An estimated rating out of 5 (e.g., 4.5)

Format the response as a JSON array of books with the exact properties: title, author, publicationYear, description, themes, rating.`;
    } else if (section === 'new') {
      systemPrompt = `You are a knowledgeable book curator. Please recommend 15 recent ${category} books from the past 2 years.
For each book, provide:
- Title
- Author
- Publication year (2022-2024 only)
- A brief compelling description (max 150 characters)
- 2-3 major themes
- An estimated rating out of 5 (e.g., 4.5)

Format the response as a JSON array of books with the exact properties: title, author, publicationYear, description, themes, rating.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please recommend ${section} ${category} books.` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI response received:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    let books;
    try {
      books = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.error('Error parsing OpenAI response:', e);
      throw new Error('Failed to parse book recommendations');
    }

    // Validate and format book data
    books = books.map(book => ({
      title: String(book.title || ''),
      author: String(book.author || ''),
      publicationYear: String(book.publicationYear || ''),
      description: String(book.description || ''),
      themes: Array.isArray(book.themes) ? book.themes.map(String) : [],
      rating: String(book.rating || ''),
      amazonUrl: generateAmazonUrl(book.title, book.author)
    }));

    // Fetch book covers in parallel
    const bookCoversPromises = books.map(book => 
      getBookCover(book.title, book.author)
    );
    const bookCovers = await Promise.all(bookCoversPromises);

    // Add cover images and Amazon URLs to books
    books = books.map((book, index) => ({
      ...book,
      imageUrl: bookCovers[index],
    }));

    console.log('Sending response with books:', books);
    return new Response(JSON.stringify({ recommendations: books }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in book-recommendations function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch book recommendations' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
