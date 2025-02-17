
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
    
    // Build the query parameters
    const params = new URLSearchParams({
      q: searchQuery,
      key: apiKey,
      maxResults: maxResults.toString(),
      langRestrict: 'en', // Restrict to English books
      printType: 'books', // Only return books, no magazines or other content
      fields: 'items(id,volumeInfo(title,authors,categories,publishedDate,description,imageLinks,industryIdentifiers))'
    });

    const response = await fetch(`${url}?${params.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      console.error('Google Books API error:', data)
      throw new Error(data.error?.message || 'Failed to fetch books')
    }

    // Additional filtering on our end
    if (data.items) {
      data.items = data.items.filter((book: GoogleBook) => 
        book.volumeInfo.description?.length > 100 && // Ensure substantial description
        book.volumeInfo.imageLinks?.thumbnail && // Must have cover image
        book.volumeInfo.authors?.length > 0 && // Must have authors
        book.volumeInfo.title?.length > 0 // Must have title
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
