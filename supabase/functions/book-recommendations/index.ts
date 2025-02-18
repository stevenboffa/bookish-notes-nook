
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Expose-Headers': '*'
};

async function searchGoogleBooks(title: string, author: string) {
  try {
    const query = encodeURIComponent(`${title} ${author}`);
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`
    );
    const data = await response.json();
    const book = data.items?.[0]?.volumeInfo;
    
    return {
      thumbnail: book?.imageLinks?.thumbnail,
      amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(`${title} ${author}`)}&tag=your-tag`
    };
  } catch (error) {
    console.error('Google Books API error:', error);
    return {};
  }
}

serve(async (req) => {
  // Log incoming request details
  console.log('Request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      throw new Error(`Method ${req.method} not allowed`);
    }

    // Parse request body and validate
    const body = await req.json();
    console.log('Request body:', body);

    if (!body.section || !['award-winning', 'new'].includes(body.section)) {
      throw new Error('Invalid or missing section parameter');
    }

    // Check OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    console.log('Making OpenAI API request...');
    
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a book recommendation system. Provide concise, accurate book details in JSON format.'
          },
          {
            role: 'user',
            content: `Generate 4 ${body.section} science fiction books. Include only: title, author, publicationYear, description (30 words), rating, and themes (max 2).`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error('Failed to generate recommendations');
    }

    const openAIData = await openAIResponse.json();
    console.log('OpenAI response received');

    let recommendations;
    try {
      const content = openAIData.choices[0].message.content;
      const parsed = JSON.parse(content);
      recommendations = Array.isArray(parsed) ? parsed : parsed.recommendations || [];
      
      // Fetch book covers in parallel
      recommendations = await Promise.all(
        recommendations.map(async (book) => {
          const { thumbnail, amazonUrl } = await searchGoogleBooks(book.title, book.author);
          return {
            ...book,
            imageUrl: thumbnail,
            amazonUrl
          };
        })
      );
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Invalid AI response format');
    }

    // Return successful response
    return new Response(
      JSON.stringify({ recommendations }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    
    // Return error response with CORS headers
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.status || 400,
      }
    );
  }
});
