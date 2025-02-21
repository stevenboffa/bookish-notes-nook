
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { section, category } = await req.json()
    console.log(`Generating ${section} recommendations for ${category} category`)

    let prompt = ''
    if (section === 'award-winning') {
      prompt = `Generate 6 critically acclaimed or award-winning ${category} books. Include a mix of modern classics and recent notable works. For each book provide:
      - Title
      - Author
      - Publication year
      - Brief compelling description (2-3 sentences)
      - Rating (if applicable)
      - 2-3 key themes or elements
      - Amazon URL (optional)
      - Cover image URL (optional)
      
      Format as JSON array of objects with these properties: title, author, publicationYear, description, rating, themes, amazonUrl, imageUrl`
    } else if (section === 'new') {
      prompt = `Generate 6 highly-rated ${category} books published in the last 2 years. For each book provide:
      - Title
      - Author
      - Publication year
      - Brief compelling description (2-3 sentences)
      - Rating (if applicable)
      - 2-3 key themes or elements
      - Amazon URL (optional)
      - Cover image URL (optional)
      
      Format as JSON array of objects with these properties: title, author, publicationYear, description, rating, themes, amazonUrl, imageUrl`
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
            content: `You are a knowledgeable book recommendation system specializing in ${category} literature. Provide detailed, accurate recommendations with real books.`
          },
          { role: 'user', content: prompt }
        ],
      }),
    })

    const data = await response.json()
    console.log('Received response from OpenAI')
    
    let recommendations
    try {
      recommendations = JSON.parse(data.choices[0].message.content)
      console.log(`Successfully parsed ${recommendations.length} recommendations`)
    } catch (error) {
      console.error('Error parsing OpenAI response:', error)
      recommendations = []
    }

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in book-recommendations function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
