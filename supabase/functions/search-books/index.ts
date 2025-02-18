
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
    console.log('Received request with:', { searchQuery, maxResults, bookId });
    
    // For AI books, return early before any API validation
    if (bookId?.startsWith('ai/')) {
      console.log('AI book detected, returning null response');
      return new Response(
        JSON.stringify(null),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch Google Books API key from secrets table
    console.log('Fetching Google Books API key...');
    const { data: secretData, error: secretError } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'GOOGLE_BOOKS_API_KEY')
      .single();

    if (secretError) {
      console.error('Error fetching from secrets table:', secretError);
      throw new Error('Failed to fetch Google Books API key from secrets');
    }

    if (!secretData?.value) {
      console.error('No API key found in secrets table');
      throw new Error('Google Books API key not found in secrets');
    }

    const apiKey = secretData.value.trim();
    if (!apiKey) {
      console.error('Empty API key after trimming');
      throw new Error('Invalid Google Books API key format');
    }

    console.log('API key retrieved from secrets, first 4 chars:', apiKey.substring(0, 4));

    // Construct the request URL
    let url: string;
    let finalSearchQuery: string;

    if (bookId) {
      url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;
      console.log('Fetching single book with ID:', bookId);
    } else {
      url = 'https://www.googleapis.com/books/v1/volumes';
      finalSearchQuery = searchQuery || 'subject:fiction';
      
      const params = new URLSearchParams({
        q: finalSearchQuery,
        key: apiKey,
        maxResults: maxResults.toString(),
        langRestrict: 'en',
        printType: 'books'
      });
      
      url = `${url}?${params.toString()}`;
      console.log('Searching books with query:', finalSearchQuery);
    }

    console.log('Making request to Google Books API...');
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('Google Books API error response:', {
        status: response.status,
        statusText: response.statusText,
        data
      });

      // Add specific error handling for API key issues
      if (data.error?.status === 'INVALID_ARGUMENT' && data.error?.message?.includes('API key')) {
        throw new Error('Google Books API key is invalid. Please check the key format and ensure it is enabled for Books API.');
      }

      throw new Error(data.error?.message || 'Failed to fetch from Google Books API');
    }

    console.log('Successfully received response from Google Books API');
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
        status: error.message?.includes('API key') ? 400 : 500,
      }
    );
  }
});
