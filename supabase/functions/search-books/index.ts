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

// Function to convert ISBN-13 to ISBN-10
function isbn13To10(isbn13: string): string {
  // Check if it's a valid ISBN-13 starting with 978
  if (!isbn13.startsWith('978')) {
    return isbn13;
  }

  // Remove the 978 prefix and check digit
  const isbn9 = isbn13.slice(3, 12);

  // Calculate the ISBN-10 check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += (10 - i) * parseInt(isbn9[i]);
  }
  const checkDigit = (11 - (sum % 11)) % 11;
  const checkChar = checkDigit === 10 ? 'X' : checkDigit.toString();

  return isbn9 + checkChar;
}

async function getAmazonASIN(title: string, author: string): Promise<string | null> {
  try {
    // Construct a search URL that's likely to find the book
    const searchQuery = `${title} ${author} book`.replace(/\s+/g, '+');
    const url = `https://www.amazon.com/s?k=${searchQuery}&i=stripbooks`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = await response.text();
    
    // Look for ASIN in the response using regex
    const asinMatch = html.match(/data-asin="([A-Z0-9]{10})"/);
    return asinMatch ? asinMatch[1] : null;
  } catch (error) {
    console.error('Error fetching Amazon ASIN:', error);
    return null;
  }
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
    if (book?.volumeInfo) {
      const isbn13 = book.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier;
      const isbn10 = book.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier;
      
      // Try to get ASIN from Amazon search
      const asin = await getAmazonASIN(
        book.volumeInfo.title,
        book.volumeInfo.authors?.[0] || ''
      );

      // Use ASIN if found, otherwise fallback to ISBN-10
      const amazonId = asin || isbn10 || (isbn13 ? isbn13To10(isbn13) : null);

      if (amazonId) {
        console.log('Using Amazon ID:', amazonId);
        
        const affiliateLinks = {
          amazon: `https://www.amazon.com/dp/${amazonId}?tag=ps4fans06-20`,
          goodreads: `https://www.goodreads.com/book/isbn/${isbn13 || isbn10 || amazonId}`
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