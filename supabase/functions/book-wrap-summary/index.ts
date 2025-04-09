import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { bookContext } = await req.json();

    const systemPrompt = `You are an insightful reading companion analyzing a reader's engagement with a book. 
Based on their notes, reading time, and interactions, provide a thoughtful analysis of their reading experience.
Focus on:
1. Key themes and patterns in their notes
2. Their emotional responses and reactions
3. Questions and critical thinking displayed
4. Character analysis and development tracking
5. Reading habits and engagement level
6. Notable quotes or passages they highlighted

Format the response as a JSON object with these sections:
{
  "overview": "A brief overview of their reading journey",
  "themes": ["List of key themes they focused on"],
  "engagement": "Analysis of their reading engagement style",
  "criticalThinking": "Assessment of their analytical approach",
  "emotionalResponse": "Their emotional connection to the book",
  "keyTakeaways": ["List of main insights or learnings"],
  "suggestedReflections": ["Questions for further thought"]
}`;

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
          { 
            role: 'user', 
            content: `Please analyze this reader's engagement with "${bookContext.title}":
            ${JSON.stringify(bookContext, null, 2)}`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const summary = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 