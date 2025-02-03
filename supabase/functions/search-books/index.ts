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
    const { searchQuery, bookId } = await req.json()
    
    const apiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY')
    if (!apiKey) {
      throw new Error('Google Books API key not configured')
    }

    let url: string
    let params: URLSearchParams

    if (bookId) {
      console.log('Fetching single book with ID:', bookId)
      url = `https://www.googleapis.com/books/v1/volumes/${bookId}`
      params = new URLSearchParams({ key: apiKey })
    } else if (searchQuery) {
      console.log('Searching books with query:', searchQuery)
      url = 'https://www.googleapis.com/books/v1/volumes'
      params = new URLSearchParams({
        q: searchQuery.trim(),
        key: apiKey,
        maxResults: '10',
        orderBy: 'relevance',
        fields: 'items(id,volumeInfo(title,authors,categories,publishedDate,description,imageLinks,industryIdentifiers))'
      })
    } else {
      throw new Error('Either searchQuery or bookId must be provided')
    }

    const response = await fetch(`${url}?${params.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      console.error('Google Books API error:', data)
      throw new Error(data.error?.message || 'Failed to fetch books')
    }

    // Generate affiliate links
    const book = bookId ? data : data.items?.[0]
    if (book?.volumeInfo?.industryIdentifiers) {
      const isbn = book.volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_13')?.identifier ||
                  book.volumeInfo.industryIdentifiers[0]?.identifier

      if (isbn) {
        // Clean up ISBN by removing leading '9' if present and it's longer than 10 chars
        const cleanIsbn = isbn.length > 10 ? isbn.replace(/^9/, '') : isbn;
        console.log('Using ISBN for affiliate links:', cleanIsbn);

        const affiliateLinks = {
          amazon: `https://www.amazon.com/dp/${cleanIsbn}?tag=ps4fans06-20`,
          goodreads: `https://www.goodreads.com/book/isbn/${isbn}`
        }
        
        if (bookId) {
          data.affiliateLinks = affiliateLinks
        } else {
          data.items = data.items.map((item: any) => ({
            ...item,
            affiliateLinks
          }))
        }
      }
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