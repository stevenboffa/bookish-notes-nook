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
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { searchQuery } = await req.json()
    
    // Get the API key from environment variables
    const apiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY')
    if (!apiKey) {
      throw new Error('Google Books API key not configured')
    }

    // Construct the request URL with increased maxResults
    const baseUrl = 'https://www.googleapis.com/books/v1/volumes'
    const params = new URLSearchParams({
      q: searchQuery.trim(),
      key: apiKey,
      maxResults: '10', // Return up to 10 results
      orderBy: 'relevance', // Sort by relevance to get best matches first
    })

    const response = await fetch(`${baseUrl}?${params.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to search books')
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})