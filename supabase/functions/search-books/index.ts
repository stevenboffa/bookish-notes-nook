import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY');
    if (!apiKey) {
      console.error('GOOGLE_BOOKS_API_KEY is not configured in Edge Function secrets');
      return new Response(
        JSON.stringify({ 
          error: 'Configuration error: Google Books API key is not set up properly. Please check Edge Function secrets.' 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { searchQuery, maxResults = 16, bookId } = await req.json();
    console.log('Request payload:', { searchQuery, maxResults, bookId });

    // If bookId is provided, fetch single book details
    if (bookId) {
      console.log('Fetching single book details for ID:', bookId);
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`
      );
      const data = await response.json();

      if (!response.ok) {
        console.error('Google Books API error:', data);
        throw new Error(data.error?.message || 'Failed to fetch book details');
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Otherwise, perform a search
    console.log('Searching books with query:', searchQuery);
    const url = 'https://www.googleapis.com/books/v1/volumes';
    
    const params = new URLSearchParams();
    params.append('q', searchQuery || 'subject:fiction');
    params.append('key', apiKey);
    params.append('maxResults', maxResults.toString());
    params.append('langRestrict', 'en');
    params.append('printType', 'books');

    console.log('Making request to Google Books API...');
    const response = await fetch(`${url}?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      console.error('Google Books API error:', data);
      throw new Error(data.error?.message || 'Failed to fetch books');
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in search-books function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while processing your request',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
