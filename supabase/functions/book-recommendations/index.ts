
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { genre, type } = await req.json();
    console.log(`Generating ${type} ${genre} recommendations...`);

    let systemPrompt = `You are a knowledgeable book recommender. Provide 3 ${type.toLowerCase()} ${genre} book recommendations.
    Format your response as a JSON array of book objects with these properties:
    - title (string)
    - author (string)
    - publicationYear (string)
    - description (string, max 150 chars)
    - rating (string, 1-5)
    - themes (string array)
    - imageUrl (optional string)
    - amazonUrl (optional string)`;

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
          { role: 'user', content: `Please recommend ${type.toLowerCase()} ${genre} books.` }
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
    console.log('OpenAI response received');

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

    return new Response(JSON.stringify({ books }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in book-recommendations function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate recommendations'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
