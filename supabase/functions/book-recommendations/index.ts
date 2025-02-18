
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are a knowledgeable book recommendation agent. Your task is to recommend books based on genres, themes, and user preferences. When making recommendations, focus on:

1. Understanding the genre or theme requested
2. Considering popular and critically acclaimed books
3. Providing diverse recommendations
4. Including both classic and contemporary works
5. Ensuring recommendations are readily available for purchase

Format your response as a JSON array with the following structure for each book:
{
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Primary Genre",
  "themes": ["Theme1", "Theme2"],
  "description": "A brief compelling description",
  "recommendationReason": "Why this book is recommended"
}`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, preferences } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating recommendations for category:', category);

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
            content: systemPrompt 
          },
          { 
            role: 'user', 
            content: `Suggest 5 books in the ${category} category. ${preferences ? `Consider these preferences: ${preferences}` : ''}`
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log('AI Response received:', data);

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate recommendations');
    }

    let recommendations;
    try {
      // Parse the AI response which should be in JSON format
      recommendations = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      throw new Error('Invalid response format from AI');
    }

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in book-recommendations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
