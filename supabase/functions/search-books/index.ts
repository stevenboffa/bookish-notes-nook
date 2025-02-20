
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
    const { searchQuery, page = 1, maxResults = 20, bookId } = await req.json()
    
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
    console.log('Searching books with query:', searchQuery, 'page:', page);
    const url = 'https://www.googleapis.com/books/v1/volumes';
    
    // Calculate startIndex for pagination
    const startIndex = (page - 1) * maxResults;

    // Helper function to check if query looks like an author name
    const isLikelyAuthorName = (query: string) => {
      return query.split(' ').length >= 2 && // Has at least first and last name
             !query.includes(':') && // Doesn't contain special search operators
             !/\d/.test(query); // Doesn't contain numbers
    };
    
    // Build advanced query parameters
    let finalQuery = searchQuery;
    if (!searchQuery.includes(':')) {
      if (isLikelyAuthorName(searchQuery.trim())) {
        // If it looks like an author name, prioritize author search
        finalQuery = `inauthor:"${searchQuery.trim()}"`;
      } else {
        // For general searches, try both title and author with different weights
        finalQuery = `intitle:"${searchQuery}" OR inauthor:"${searchQuery}" OR "${searchQuery}"`;
      }
    }
    
    console.log('Final query:', finalQuery);

    // Build the query parameters
    const params = new URLSearchParams();
    params.append('q', finalQuery);
    params.append('key', apiKey);
    params.append('maxResults', maxResults.toString());
    params.append('startIndex', startIndex.toString());
    params.append('langRestrict', 'en');
    params.append('printType', 'books');
    params.append('orderBy', 'relevance');

    console.log('Final URL parameters:', params.toString());

    const response = await fetch(`${url}?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      console.error('Google Books API error:', data);
      throw new Error(data.error?.message || 'Failed to fetch books');
    }

    // Additional filtering and sorting
    if (data.items) {
      data.items = data.items
        .filter((book: GoogleBook) => 
          // Filter out books without essential information
          book.volumeInfo?.title?.length > 0 &&
          book.volumeInfo?.authors?.length > 0
        )
        .sort((a: GoogleBook, b: GoogleBook) => {
          const scoreA = getBookCompletionScore(a, searchQuery);
          const scoreB = getBookCompletionScore(b, searchQuery);
          return scoreB - scoreA;
        });
    }

    // Add pagination metadata
    const result = {
      items: data.items || [],
      totalItems: data.totalItems || 0,
      currentPage: page,
      hasMore: data.items?.length === maxResults,
    };

    return new Response(JSON.stringify(result), {
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

// Helper function to score book completeness and relevance
function getBookCompletionScore(book: GoogleBook, searchQuery: string): number {
  let score = 0;
  const info = book.volumeInfo;
  const query = searchQuery.toLowerCase();
  
  // Basic completion score
  if (info.imageLinks?.thumbnail) score += 3;
  if (info.description?.length > 100) score += 2;
  if (info.categories?.length > 0) score += 1;
  if (info.publishedDate) score += 1;
  
  // Author matching score (weighted heavily)
  if (info.authors) {
    const authorMatch = info.authors.some(author => 
      author.toLowerCase().includes(query) || 
      query.includes(author.toLowerCase())
    );
    if (authorMatch) score += 10;
  }
  
  // Exact author match gets highest priority
  if (info.authors?.some(author => author.toLowerCase() === query)) {
    score += 20;
  }
  
  return score;
}
