
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

    if (secretError || !secretData?.value) {
      console.error('Error fetching API key:', secretError || 'No key found');
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch Google Books API key',
          details: secretError 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const apiKey = secretData.value.trim();
    console.log('Successfully retrieved Google Books API key');

    // If bookId is provided, fetch single book details
    if (bookId) {
      console.log('Fetching single book details for ID:', bookId);
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`
      );
      
      const data = await response.json();
      console.log('Google Books API response status:', response.status);

      if (!response.ok) {
        console.error('Google Books API error:', data);
        return new Response(
          JSON.stringify({ 
            error: data.error?.message || 'Failed to fetch book details',
            details: data 
          }),
          {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Perform a search
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
      return new Response(
        JSON.stringify({ 
          error: data.error?.message || 'Failed to fetch books',
          details: data 
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
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
