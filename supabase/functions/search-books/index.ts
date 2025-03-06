
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
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Google Books API error: Status ${response.status}, Response:`, errorText);
        
        // Return a more descriptive error
        return new Response(JSON.stringify({
          error: `Failed to fetch book details. Status: ${response.status}`,
          bookId: bookId,
          message: errorText
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status,
        });
      }
      
      const data = await response.json();
      console.log('Successfully retrieved book details. Title:', data.volumeInfo?.title);

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    console.log('Searching books with query:', searchQuery, 'page:', page);
    const url = 'https://www.googleapis.com/books/v1/volumes';
    
    // Calculate startIndex for pagination
    const startIndex = (page - 1) * maxResults;
    
    // Use the search query as is since it now comes with the proper operator
    const finalQuery = searchQuery;
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
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google Books API search error: Status ${response.status}, Response:`, errorText);
      throw new Error(`Failed to fetch books. Status: ${response.status}`);
    }
    
    const data = await response.json();

    // Log some information about the search results
    console.log(`Found ${data.totalItems || 0} total items`);
    if (data.items) {
      console.log(`Returned ${data.items.length} books in this page`);
      // Log the first few books with their IDs for debugging
      data.items.slice(0, 3).forEach((book: GoogleBook, index: number) => {
        console.log(`Book ${index + 1}: ID=${book.id}, Title="${book.volumeInfo?.title}"`);
      });
    } else {
      console.log('No books found in the response');
    }

    // Additional filtering and sorting
    if (data.items) {
      data.items = data.items
        .filter((book: GoogleBook) => 
          // Filter out books without essential information
          book.volumeInfo?.title?.length > 0
        )
        .sort((a: GoogleBook, b: GoogleBook) => {
          const scoreA = getBookCompletionScore(a);
          const scoreB = getBookCompletionScore(b);
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

// Helper function to score book completeness
function getBookCompletionScore(book: GoogleBook): number {
  let score = 0;
  const info = book.volumeInfo;
  
  // Basic completion score
  if (info.imageLinks?.thumbnail) score += 3;
  if (info.description?.length > 100) score += 2;
  if (info.categories?.length > 0) score += 1;
  if (info.publishedDate) score += 1;
  if (info.authors?.length > 0) score += 2;
  
  return score;
}
