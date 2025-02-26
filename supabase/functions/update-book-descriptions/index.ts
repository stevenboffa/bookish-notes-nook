
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { corsHeaders } from '../_shared/cors.ts';

const GOOGLE_BOOKS_API_KEY = Deno.env.get('GOOGLE_BOOKS_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
}

async function fetchGoogleBookDescription(title: string, author: string): Promise<string | null> {
  try {
    const query = `${title} ${author}`.replace(/\s+/g, '+');
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_BOOKS_API_KEY}`
    );
    
    if (!response.ok) {
      console.error('Google Books API error:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.items && data.items[0]?.volumeInfo?.description) {
      return data.items[0].volumeInfo.description;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching book description:', error);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
    
    // Fetch all books without descriptions
    const { data: books, error: fetchError } = await supabase
      .from('books')
      .select('id, title, author, description')
      .is('description', null);
      
    if (fetchError) throw fetchError;
    
    console.log(`Found ${books?.length || 0} books without descriptions`);
    
    let updatedCount = 0;
    
    // Process books in batches to avoid rate limits
    if (books) {
      for (const book of books) {
        // Add a small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const description = await fetchGoogleBookDescription(book.title, book.author);
        
        if (description) {
          const { error: updateError } = await supabase
            .from('books')
            .update({ description })
            .eq('id', book.id);
            
          if (!updateError) {
            updatedCount++;
            console.log(`Updated description for: ${book.title}`);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully updated ${updatedCount} book descriptions`
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
