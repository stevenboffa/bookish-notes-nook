
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const scienceFictionPrompt = `You are BN AI, a specialized book recommendation agent with deep knowledge of science fiction literature. When recommending science fiction books, structure your recommendations into two distinct sections:

1. Award-Winning Science Fiction:
   - Focus on books that have won major awards (Hugo, Nebula, Arthur C. Clarke, etc.)
   - Include classics and contemporary winners
   - Ensure these are widely recognized and respected works
   - Mix different decades to show the evolution of the genre

2. New Science Fiction (Published in the last 2-3 years):
   - Focus on highly-rated and well-reviewed recent releases
   - Include books from established publishers
   - Consider books with strong reader reviews and ratings
   - Avoid obscure or poorly reviewed works

For each book, provide this information in JSON format:
{
  "title": "Book Title",
  "author": "Author Name",
  "publicationYear": "Year",
  "awards": ["Award name and year", "..."] (for award-winning section),
  "rating": "Average rating (if available)",
  "description": "A compelling 2-3 sentence description",
  "significance": "For award winners: why it's significant. For new books: why it's noteworthy",
  "themes": ["Theme1", "Theme2", "Theme3"],
  "subgenre": "Specific sci-fi subgenre (e.g., Space Opera, Cyberpunk, etc.)"
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { section } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating science fiction recommendations for section:', section);

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
            content: scienceFictionPrompt 
          },
          { 
            role: 'user', 
            content: `Generate 10 ${section === 'award-winning' ? 'award-winning' : 'new'} science fiction book recommendations. ${
              section === 'new' ? 'Remember to only include books from the last 2-3 years that have received significant positive attention.' :
              'Include a mix of classic and contemporary award winners that have shaped the genre.'
            }`
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
