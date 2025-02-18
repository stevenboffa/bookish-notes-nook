
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

function generateSampleBooks(section: string): any[] {
  if (section === 'award-winning') {
    return [
      {
        title: "Dune",
        author: "Frank Herbert",
        publicationYear: "1965",
        description: "A desert planet, a valuable spice, and a young heir's journey to power in an epic tale of politics, religion, and ecology.",
        rating: "9.5",
        themes: ["Political Intrigue", "Environmental Conservation"]
      },
      {
        title: "Foundation",
        author: "Isaac Asimov",
        publicationYear: "1951",
        description: "A mathematician predicts the fall of civilization and establishes a foundation to preserve human knowledge and culture.",
        rating: "9.0",
        themes: ["Future History", "Scientific Progress"]
      },
      // Add more award-winning books if needed
    ];
  } else {
    return [
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        publicationYear: "2021",
        description: "An astronaut wakes up alone on a spacecraft with no memory, tasked with saving humanity from extinction.",
        rating: "9.2",
        themes: ["Space Exploration", "First Contact"]
      },
      {
        title: "The Ministry for the Future",
        author: "Kim Stanley Robinson",
        publicationYear: "2020",
        description: "A near-future story about climate change and humanity's efforts to save Earth's biosphere.",
        rating: "8.8",
        themes: ["Climate Fiction", "Global Politics"]
      },
      // Add more new books if needed
    ];
  }
}

serve(async (req) => {
  console.log('Request received:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { section } = await req.json();
    console.log('Processing request for section:', section);

    if (!section || !['award-winning', 'new'].includes(section)) {
      throw new Error('Invalid section parameter');
    }

    // Use sample data instead of OpenAI API for reliability
    const books = generateSampleBooks(section);
    console.log('Generated books:', books);

    // Process books in parallel to add images and Amazon links
    const recommendations = await Promise.all(
      books.map(async (book) => {
        const { thumbnail, amazonUrl } = await searchGoogleBooks(book.title, book.author);
        return {
          ...book,
          imageUrl: thumbnail || undefined,
          amazonUrl: amazonUrl || undefined
        };
      })
    );

    console.log('Final recommendations:', recommendations);

    return new Response(
      JSON.stringify({ recommendations }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
