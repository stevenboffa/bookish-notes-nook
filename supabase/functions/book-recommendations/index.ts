import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const googleBooksApiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AMAZON_AFFILIATE_TAG = 'ps4fans06-20';
const CACHE_EXPIRY_HOURS = 24; // Cache expires after 24 hours

async function getBookCover(title: string, author: string): Promise<string | undefined> {
  try {
    const query = encodeURIComponent(`${title} ${author}`);
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${googleBooksApiKey}`
    );
    const data = await response.json();
    if (data.items?.[0]?.volumeInfo?.imageLinks) {
      // Try to get the highest quality image available
      const imageLinks = data.items[0].volumeInfo.imageLinks;
      return imageLinks.large || imageLinks.medium || imageLinks.thumbnail?.replace('zoom=1', 'zoom=2');
    }
  } catch (error) {
    console.error('Error fetching book cover:', error);
  }
  return undefined;
}

// Add a new function to cache book covers
async function getCachedBookCover(title: string, author: string): Promise<string | undefined> {
  // Check if we have a cached cover
  const { data: cachedCover, error } = await supabase
    .from('book_covers')
    .select('image_url')
    .eq('title', title)
    .eq('author', author)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error checking cached cover:', error);
    return undefined;
  }

  if (cachedCover?.image_url) {
    return cachedCover.image_url;
  }

  // If no cached cover, fetch and cache it
  const coverUrl = await getBookCover(title, author);
  if (coverUrl) {
    await supabase
      .from('book_covers')
      .upsert({
        title,
        author,
        image_url: coverUrl,
        updated_at: new Date().toISOString()
      });
  }
  return coverUrl;
}

function generateAmazonUrl(title: string, author: string): string {
  const searchQuery = encodeURIComponent(`${title} ${author}`);
  return `https://www.amazon.com/s?k=${searchQuery}&tag=${AMAZON_AFFILIATE_TAG}`;
}

async function checkAndGetCache(category: string, sections: string[]) {
  const { data: cache, error } = await supabase
    .from('book_recommendations')
    .select('recommendations, updated_at')
    .eq('category', category)
    .in('section', sections);

  if (error) {
    console.error('Error checking cache:', error);
    return null;
  }

  if (!cache || cache.length === 0) return null;

  // Check if any section's cache is expired
  const now = new Date().getTime();
  const hasExpiredCache = cache.some(item => {
    const cacheAge = now - new Date(item.updated_at).getTime();
    return cacheAge > (CACHE_EXPIRY_HOURS * 60 * 60 * 1000);
  });

  if (hasExpiredCache) return null;

  // Combine all valid cached sections
  const result: Record<string, any[]> = {};
  cache.forEach(item => {
    result[item.section] = item.recommendations;
  });

  return result;
}

async function updateCache(category: string, sections: string[], recommendations: Record<string, any[]>) {
  const updates = Object.entries(recommendations).map(([section, recs]) => ({
    category,
    section,
    recommendations: recs,
    updated_at: new Date().toISOString()
  }));

  const { error } = await supabase
    .from('book_recommendations')
    .upsert(updates);

  if (error) {
    console.error('Error updating cache:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, sections } = await req.json();
    console.log(`Checking cache for ${sections.join(', ')} ${category} recommendations...`);

    // Check cache first
    const cachedRecommendations = await checkAndGetCache(category, sections);
    if (cachedRecommendations) {
      console.log('Returning cached recommendations');
      return new Response(
        JSON.stringify(cachedRecommendations),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Cache miss, generating new recommendations...');

    // Generate recommendations for each section in parallel
    const recommendationsPromises = sections.map(async (section) => {
      let systemPrompt = '';
      if (section === 'award-winning') {
        systemPrompt = `You are a knowledgeable book curator and literary critic. Please recommend 15 award-winning or highly acclaimed ${category} books.
For each book, provide:
- Title
- Author
- Publication year (between 1950 and 2024)
- A detailed and engaging description (4-5 sentences, 500-600 characters) that includes:
  * The book's main premise and setting
  * Key characters and their development
  * The author's writing style and notable techniques
  * Major themes and their significance
  * Why this book is considered award-worthy
- 3-4 major themes
- An estimated rating out of 5 (e.g., 4.5)
- Notable awards or recognition (if any)
- Target audience (e.g., "Fans of character-driven narratives" or "Readers who enjoy complex world-building")
- Reading difficulty (Easy, Moderate, or Challenging)
- Page count (approximate number)
- A compelling one-line hook (max 100 characters)

Format the response as a JSON array of books with the exact properties: title, author, publicationYear, description, themes, rating, awards, targetAudience, readingDifficulty, pageCount, hook.`;
      } else if (section === 'new') {
        systemPrompt = `You are a knowledgeable book curator and literary critic. Please recommend 15 recent ${category} books from the past 2 years.
For each book, provide:
- Title
- Author
- Publication year (2022-2024 only)
- A detailed and engaging description (4-5 sentences, 500-600 characters) that includes:
  * The book's main premise and setting
  * Key characters and their development
  * The author's writing style and notable techniques
  * Major themes and their significance
  * Critical reception and impact
- 3-4 major themes
- An estimated rating out of 5 (e.g., 4.5)
- Notable awards or recognition (if any)
- Target audience (e.g., "Fans of character-driven narratives" or "Readers who enjoy complex world-building")
- Reading difficulty (Easy, Moderate, or Challenging)
- Page count (approximate number)
- A compelling one-line hook (max 100 characters)

Format the response as a JSON array of books with the exact properties: title, author, publicationYear, description, themes, rating, awards, targetAudience, readingDifficulty, pageCount, hook.`;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Please recommend ${section} ${category} books.` }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI API error:', error);
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log(`OpenAI response received for ${section}`);

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from OpenAI');
      }

      let books;
      try {
        books = JSON.parse(data.choices[0].message.content);
      } catch (e) {
        console.error('Error parsing OpenAI response:', e);
        throw new Error('Failed to parse book recommendations');
      }

      // Validate and format book data
      books = books.map(book => ({
        title: String(book.title || ''),
        author: String(book.author || ''),
        publicationYear: String(book.publicationYear || ''),
        description: String(book.description || ''),
        themes: Array.isArray(book.themes) ? book.themes.map(String) : [],
        rating: String(book.rating || ''),
        awards: String(book.awards || ''),
        targetAudience: String(book.targetAudience || ''),
        readingDifficulty: String(book.readingDifficulty || ''),
        pageCount: String(book.pageCount || ''),
        hook: String(book.hook || ''),
        amazonUrl: generateAmazonUrl(book.title, book.author)
      }));

      // Fetch book covers in parallel with a concurrency limit
      const CONCURRENT_REQUESTS = 5;
      const bookCovers = [];
      for (let i = 0; i < books.length; i += CONCURRENT_REQUESTS) {
        const batch = books.slice(i, i + CONCURRENT_REQUESTS);
        const batchCovers = await Promise.all(
          batch.map(book => getCachedBookCover(book.title, book.author))
        );
        bookCovers.push(...batchCovers);
      }

      // Add cover images to books
      return books.map((book, index) => ({
        ...book,
        imageUrl: bookCovers[index],
      }));
    });

    const recommendations = await Promise.all(recommendationsPromises);
    const result = sections.reduce((acc, section, index) => {
      acc[section] = recommendations[index];
      return acc;
    }, {} as Record<string, any[]>);

    // Update cache with new recommendations
    await updateCache(category, sections, result);

    console.log('Sending response with books:', result);
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in book-recommendations function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch book recommendations' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
