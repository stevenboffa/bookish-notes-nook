
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    categories?: string[];
    publishedDate?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { searchQuery, maxResults = 16 } = await req.json()
    
    const apiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY')
    if (!apiKey) {
      throw new Error('Google Books API key not configured')
    }

    console.log('Searching books with query:', searchQuery)
    const url = 'https://www.googleapis.com/books/v1/volumes'
    
    // Parse existing parameters from searchQuery
    const existingParams = new URLSearchParams(searchQuery);
    const baseQuery = existingParams.get('q') || searchQuery.split('&')[0];

    // Build the query parameters
    const params = new URLSearchParams();
    params.append('q', baseQuery);
    params.append('key', apiKey);
    params.append('maxResults', maxResults.toString());
    params.append('langRestrict', 'en');
    params.append('printType', 'books');
    
    // Add any additional parameters from the original query
    if (existingParams.has('orderBy')) params.append('orderBy', existingParams.get('orderBy')!);
    if (existingParams.has('filter')) params.append('filter', existingParams.get('filter')!);

    const response = await fetch(`${url}?${params.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      console.error('Google Books API error:', data)
      throw new Error(data.error?.message || 'Failed to fetch books')
    }

    // Additional filtering on our end
    if (data.items) {
      data.items = data.items.filter((book: GoogleBook) => 
        book.volumeInfo.description?.length > 100 && 
        book.volumeInfo.imageLinks?.thumbnail && 
        book.volumeInfo.authors?.length > 0 && 
        book.volumeInfo.title?.length > 0
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in search-books function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
