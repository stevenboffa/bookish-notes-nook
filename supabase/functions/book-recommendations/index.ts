
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
      prompt = `Generate 6 critically acclaimed or award-winning ${category} books that are well-known and popular. Include books published after 2000. For each book provide:
      - Title (exact, well-known titles only)
      - Author (full name)
      - Publication year
      - Brief description (2-3 sentences)
      - Rating out of 5 (based on general consensus)
      - 2-3 key themes
      
      Format as JSON array with these properties: title, author, publicationYear, description, rating, themes. Keep descriptions concise.`
    } else if (section === 'new') {
      prompt = `Generate 6 highly-rated ${category} books published in the last 2 years. Include well-known, verified books only. For each book provide:
      - Title (exact, well-known titles only)
      - Author (full name)
      - Publication year (2022-2024 only)
      - Brief description (2-3 sentences)
      - Rating out of 5 (based on general consensus)
      - 2-3 key themes
      
      Format as JSON array with these properties: title, author, publicationYear, description, rating, themes. Keep descriptions concise.`
    }

    console.log('Making request to OpenAI...')
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
            content: `You are a knowledgeable book recommendation system specializing in ${category} literature. Only recommend real, verifiable books. Format output as clean JSON.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('OpenAI API error:', response.status, errorBody)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Received response from OpenAI')
    
    let recommendations
    try {
      recommendations = JSON.parse(data.choices[0].message.content)
      console.log(`Successfully parsed ${recommendations.length} recommendations`)

      // Process recommendations to add cover images using Google Books API
      const processedRecommendations = await Promise.all(recommendations.map(async (book) => {
        try {
          // Search Google Books API for the book
          const query = `${book.title} ${book.author}`.replace(/\s+/g, '+')
          const gbResponse = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`,
            { headers: { 'Accept': 'application/json' } }
          )
          const gbData = await gbResponse.json()
          
          // If we found a match, add the cover image URL
          if (gbData.items?.[0]?.volumeInfo?.imageLinks?.thumbnail) {
            return {
              ...book,
              imageUrl: gbData.items[0].volumeInfo.imageLinks.thumbnail.replace('http:', 'https:'),
              amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(`${book.title} ${book.author}`)}&i=stripbooks`
            }
          }
          return book
        } catch (error) {
          console.error('Error fetching book cover:', error)
          return book
        }
      }))

      return new Response(
        JSON.stringify({ recommendations: processedRecommendations }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      console.error('Error parsing OpenAI response:', error)
      console.log('Raw content:', data.choices[0].message.content)
      recommendations = []
      return new Response(
        JSON.stringify({ recommendations }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
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
