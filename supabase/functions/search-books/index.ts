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
    const { searchQuery, maxResults = 16, bookId } = await req.json()
    
    const apiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY')
    if (!apiKey) {
      throw new Error('Google Books API key not configured')
    }

    // If bookId is provided, fetch single book details
    if (bookId) {
      console.log('Fetching single book details for ID:', bookId);
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`);
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
    
    // Safely parse the query parameters
    let query = '';
    let filter = '';
    let orderBy = '';
    
    if (typeof searchQuery === 'string') {
      const parts = searchQuery.split('&');
      parts.forEach(part => {
        if (part.startsWith('subject:')) {
          query = part;
        } else if (part.includes('filter=')) {
          filter = part.split('=')[1];
        } else if (part.includes('orderBy=')) {
          orderBy = part.split('=')[1];
        }
      });
    }
    
    // If no valid query was found, use a default
    if (!query) {
      query = searchQuery || 'subject:fiction';
    }

    // Build the query parameters
    const params = new URLSearchParams();
    params.append('q', query);
    params.append('key', apiKey);
    params.append('maxResults', maxResults.toString());
    params.append('langRestrict', 'en');
    params.append('printType', 'books');
    
    // Add optional parameters if they exist
    if (filter) params.append('filter', filter);
    if (orderBy) params.append('orderBy', orderBy);

    console.log('Final URL parameters:', params.toString());

    const response = await fetch(`${url}?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      console.error('Google Books API error:', data);
      throw new Error(data.error?.message || 'Failed to fetch books');
    }

    // Additional filtering on our end
    if (data.items) {
      data.items = data.items.filter((book: GoogleBook) => 
        book.volumeInfo?.description?.length > 100 && 
        book.volumeInfo?.imageLinks?.thumbnail && 
        book.volumeInfo?.authors?.length > 0 && 
        book.volumeInfo?.title?.length > 0
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in search-books function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
