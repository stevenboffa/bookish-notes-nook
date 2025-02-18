
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

async function searchGoogleBooks(title: string, author: string): Promise<{ thumbnail?: string, amazonUrl?: string }> {
  try {
    const query = encodeURIComponent(`${title} ${author}`);
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`
    );
    const data = await response.json();
    const book = data.items?.[0]?.volumeInfo;
    
    return {
      thumbnail: book?.imageLinks?.thumbnail,
      // Format Amazon affiliate link (replace YOUR-AFFILIATE-ID with actual ID)
      amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(`${title} ${author}`)}&tag=YOUR-AFFILIATE-ID`
    };
  } catch (error) {
    console.error('Error fetching Google Books data:', error);
    return {};
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const { section } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Simplified prompt for faster generation
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a book recommendation system. Return a brief, focused JSON array.'
          },
          {
            role: 'user',
            content: `Generate 6 ${section} science fiction books. Focus on essential details only. Return as JSON array with: title, author, year, description (50 words max), rating, themes (3 max).`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate recommendations');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const books = JSON.parse(content);
    const recommendations = Array.isArray(books) ? books : books.recommendations || [];

    // Fetch Google Books data for all recommendations in parallel
    const enhancedRecommendations = await Promise.all(
      recommendations.map(async (book) => {
        const { thumbnail, amazonUrl } = await searchGoogleBooks(book.title, book.author);
        return {
          ...book,
          imageUrl: thumbnail,
          amazonUrl
        };
      })
    );

    return new Response(
      JSON.stringify({ recommendations: enhancedRecommendations }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
