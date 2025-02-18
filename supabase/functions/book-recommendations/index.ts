
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Expose-Headers': '*'
};

async function searchGoogleBooks(title: string, author: string) {
  try {
    const query = encodeURIComponent(`${title} ${author}`);
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`
    );
    const data = await response.json();
    const book = data.items?.[0]?.volumeInfo;
    
    return {
      thumbnail: book?.imageLinks?.thumbnail,
      amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(`${title} ${author}`)}&tag=your-tag`
    };
  } catch (error) {
    console.error('Google Books API error:', error);
    return {};
  }
}

serve(async (req) => {
  console.log('Request received:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { section } = await req.json();
    console.log('Received section:', section);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Making OpenAI request...');
    
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a book recommendation system. Return recommendations as a JSON array.'
          },
          {
            role: 'user',
            content: `Generate 4 ${section} science fiction books as an array of objects. Each book should have: title, author, publicationYear, description (30 words), rating (out of 10), and themes (array of 2 strings).`
          }
        ],
        temperature: 0.7
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error('Failed to generate recommendations');
    }

    const openAIData = await openAIResponse.json();
    console.log('Received OpenAI response');

    const content = openAIData.choices[0].message.content;
    console.log('Raw OpenAI content:', content);

    let books;
    try {
      books = JSON.parse(content);
      // Ensure we have an array of books
      if (!Array.isArray(books)) {
        books = books.recommendations || books.books || [];
      }
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      books = [];
    }

    console.log('Parsed books:', books);

    // Process books in parallel
    const recommendations = await Promise.all(
      books.map(async (book) => {
        const { thumbnail, amazonUrl } = await searchGoogleBooks(book.title, book.author);
        return {
          ...book,
          imageUrl: thumbnail || undefined,
          amazonUrl: amazonUrl || undefined
        };
      })
    );

    console.log('Final recommendations:', recommendations);

    return new Response(
      JSON.stringify({ recommendations }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
