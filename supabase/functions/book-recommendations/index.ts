
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

IMPORTANT: Your response must be a valid JSON array of book objects. Each book object must follow this exact format:
{
  "title": "Book Title",
  "author": "Author Name",
  "publicationYear": "Year",
  "awards": ["Award name and year"],
  "rating": "Average rating",
  "description": "A compelling description",
  "significance": "Book's significance",
  "themes": ["Theme1", "Theme2", "Theme3"],
  "subgenre": "Specific sci-fi subgenre"
}

Do not include any text before or after the JSON array. The response must be a parseable JSON array starting with [ and ending with ].`;

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

    const userPrompt = `Generate exactly 10 ${section === 'award-winning' ? 'award-winning' : 'new'} science fiction book recommendations. ${
      section === 'new' 
        ? 'Only include books published in the last 2-3 years that have received significant positive attention and reviews.' 
        : 'Include a mix of classic and contemporary award winners that have shaped the genre.'
    } Return the result as a JSON array of book objects, with no additional text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: scienceFictionPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to generate recommendations');
    }

    const data = await response.json();
    console.log('Raw AI Response:', data.choices[0].message.content);

    let recommendations;
    try {
      const content = data.choices[0].message.content;
      // Try to parse the content directly
      recommendations = JSON.parse(content);
      
      // If the response is wrapped in a recommendations object, extract the array
      if (recommendations.recommendations) {
        recommendations = recommendations.recommendations;
      }
      
      // Validate that we have an array
      if (!Array.isArray(recommendations)) {
        throw new Error('Response is not an array');
      }
      
      // Validate each book object has required fields
      recommendations = recommendations.map(book => ({
        title: book.title || 'Unknown Title',
        author: book.author || 'Unknown Author',
        publicationYear: book.publicationYear || 'Unknown Year',
        awards: Array.isArray(book.awards) ? book.awards : [],
        rating: book.rating || 'Not rated',
        description: book.description || 'No description available',
        significance: book.significance || 'No significance provided',
        themes: Array.isArray(book.themes) ? book.themes : [],
        subgenre: book.subgenre || 'General Science Fiction'
      }));
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      console.error('Raw content:', data.choices[0].message.content);
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
