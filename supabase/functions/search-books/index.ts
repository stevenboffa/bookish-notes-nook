
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { searchQuery, maxResults = 16, bookId } = await req.json();
    console.log('Request received:', { searchQuery, maxResults, bookId });
    
    // Check if this is an AI-generated book request
    if (typeof bookId === 'string' && (bookId.startsWith('ai/') || bookId.includes('/ai/'))) {
      console.log('AI book route detected:', bookId);
      // For AI books, we return a success response with null data
      // This allows the frontend to handle AI book details separately
      return new Response(
        JSON.stringify({ success: true, data: null, isAIBook: true }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Only proceed with Google Books API if it's not an AI book request
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching Google Books API key...');
    const { data: secretData, error: secretError } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'GOOGLE_BOOKS_API_KEY')
      .maybeSingle();

    if (secretError || !secretData?.value) {
      console.error('Failed to fetch API key:', secretError || 'No key found');
      throw new Error('Unable to fetch Google Books API key');
    }

    const apiKey = secretData.value.trim();
    console.log('API key retrieved successfully');

    // Handle book search or single book fetch
    let url: string;
    if (bookId) {
      url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;
    } else {
      const params = new URLSearchParams({
        q: searchQuery || 'subject:fiction',
        key: apiKey,
        maxResults: maxResults.toString(),
        langRestrict: 'en',
        printType: 'books'
      });
      url = `https://www.googleapis.com/books/v1/volumes?${params.toString()}`;
    }

    console.log('Making request to Google Books API...');
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('Google Books API error:', data);
      throw new Error(data.error?.message || 'Failed to fetch from Google Books API');
    }

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
