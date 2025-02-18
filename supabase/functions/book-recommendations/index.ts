
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Ensure the function can handle preflight requests
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  return null;
}

serve(async (req) => {
  console.log('Received request:', req.method, req.url);
  
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (req.method !== 'POST') {
      throw new Error(`Method ${req.method} not allowed`);
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const { section } = await req.json();
    console.log('Processing request for section:', section);

    if (!section || !['award-winning', 'new'].includes(section)) {
      throw new Error('Invalid section specified');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a book recommendation system. Return recommendations as a JSON array.'
          },
          {
            role: 'user',
            content: `Generate 10 ${section} science fiction books as a JSON array. Each book should have: title, author, publicationYear, awards (array), rating, description, significance, themes (array), and subgenre.`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate recommendations');
    }

    const data = await response.json();
    console.log('Received OpenAI response');

    // Initialize with a default structure
    const defaultRecommendations = {
      recommendations: [
        {
          title: "Sample Science Fiction Book",
          author: "Default Author",
          publicationYear: "2023",
          awards: [],
          rating: "Not rated",
          description: "Default description",
          significance: "Default significance",
          themes: ["science fiction"],
          subgenre: "General Science Fiction"
        }
      ]
    };

    try {
      const content = data.choices[0].message.content;
      console.log('Parsing AI response:', content);
      
      const parsedContent = JSON.parse(content);
      const recommendations = Array.isArray(parsedContent) ? parsedContent : 
                            parsedContent.recommendations || defaultRecommendations.recommendations;

      return new Response(JSON.stringify({ recommendations }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Return default recommendations instead of failing
      return new Response(JSON.stringify(defaultRecommendations), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
  } catch (error) {
    console.error('Error in book-recommendations function:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack || 'No stack trace available'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
