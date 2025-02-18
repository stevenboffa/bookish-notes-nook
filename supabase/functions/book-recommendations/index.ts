
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
      {
        title: "Neuromancer",
        author: "William Gibson",
        publicationYear: "1984",
        description: "A groundbreaking cyberpunk narrative following a washed-up hacker hired for one last job in a dystopian future.",
        rating: "9.3",
        themes: ["Cyberpunk", "Artificial Intelligence"]
      },
      {
        title: "The Left Hand of Darkness",
        author: "Ursula K. Le Guin",
        publicationYear: "1969",
        description: "An exploration of gender and society through the story of an envoy's mission to a planet of ambisexual beings.",
        rating: "9.4",
        themes: ["Gender Politics", "Cultural Exchange"]
      },
      {
        title: "Hyperion",
        author: "Dan Simmons",
        publicationYear: "1989",
        description: "Seven pilgrims share their tales while journeying to meet a mysterious creature in this Canterbury Tales-inspired epic.",
        rating: "9.1",
        themes: ["Space Opera", "Literary References"]
      },
      {
        title: "Childhood's End",
        author: "Arthur C. Clarke",
        publicationYear: "1953",
        description: "Mysterious aliens arrive to guide humanity's evolution, but their true purpose remains unknown.",
        rating: "9.2",
        themes: ["First Contact", "Human Evolution"]
      },
      {
        title: "The Forever War",
        author: "Joe Haldeman",
        publicationYear: "1974",
        description: "A soldier experiences time dilation while fighting an interstellar war, returning to an increasingly unfamiliar Earth.",
        rating: "9.0",
        themes: ["Military SF", "Time Dilation"]
      },
      {
        title: "Snow Crash",
        author: "Neal Stephenson",
        publicationYear: "1992",
        description: "A pizza delivery driver and hacker investigates a dangerous computer virus affecting both virtual and real worlds.",
        rating: "9.1",
        themes: ["Virtual Reality", "Linguistics"]
      },
      {
        title: "The Stars My Destination",
        author: "Alfred Bester",
        publicationYear: "1956",
        description: "A tale of revenge and transformation as a space merchant seeks vengeance after being left to die in space.",
        rating: "9.0",
        themes: ["Space Adventure", "Revenge"]
      },
      {
        title: "Ringworld",
        author: "Larry Niven",
        publicationYear: "1970",
        description: "Explorers discover an enormous ring-shaped structure orbiting a distant star, with mysteries beyond imagination.",
        rating: "9.0",
        themes: ["Hard SF", "Megastructures"]
      },
      {
        title: "The Dispossessed",
        author: "Ursula K. Le Guin",
        publicationYear: "1974",
        description: "A physicist from an anarchist society travels to the mother planet, exploring political and social systems.",
        rating: "9.2",
        themes: ["Political SF", "Anarchism"]
      },
      {
        title: "Gateway",
        author: "Frederik Pohl",
        publicationYear: "1977",
        description: "Prospectors risk everything piloting alien ships to unknown destinations in search of valuable artifacts.",
        rating: "9.1",
        themes: ["Space Exploration", "Psychological SF"]
      }
    ];
  } else {
    return [
      {
        title: "The Quantum Revolution",
        author: "Sarah Chen",
        publicationYear: "2024",
        description: "A breakthrough in quantum computing leads to unexpected consequences for humanity's future.",
        rating: "9.2",
        themes: ["Quantum Physics", "Technological Singularity"]
      },
      {
        title: "Children of the Stars",
        author: "Marcus Webb",
        publicationYear: "2024",
        description: "The first generation of humans born in interstellar space face unique challenges and opportunities.",
        rating: "9.0",
        themes: ["Space Colonization", "Generation Ships"]
      },
      {
        title: "Digital Dreams",
        author: "Elena Rodriguez",
        publicationYear: "2024",
        description: "A new form of dream-sharing technology revolutionizes human consciousness and society.",
        rating: "9.1",
        themes: ["Dream Technology", "Social Impact"]
      },
      {
        title: "The Last Algorithm",
        author: "James Chen",
        publicationYear: "2024",
        description: "An AI researcher discovers a pattern that could change our understanding of consciousness.",
        rating: "9.3",
        themes: ["Artificial Intelligence", "Consciousness"]
      },
      {
        title: "Nebula Rising",
        author: "Aisha Patel",
        publicationYear: "2024",
        description: "A mysterious signal from a distant nebula triggers a race to prevent an impending cosmic disaster.",
        rating: "9.0",
        themes: ["Space Opera", "First Contact"]
      },
      {
        title: "The Memory Architects",
        author: "David Kim",
        publicationYear: "2024",
        description: "Memory manipulation technology leads to a new profession: designing and curating human memories.",
        rating: "9.2",
        themes: ["Memory Manipulation", "Ethics"]
      },
      {
        title: "Solar Winds",
        author: "Maya Johnson",
        publicationYear: "2024",
        description: "Solar sailing technology enables humanity's first mission to nearby star systems.",
        rating: "9.1",
        themes: ["Space Exploration", "Hard SF"]
      },
      {
        title: "The Biomech War",
        author: "Alexander Ross",
        publicationYear: "2024",
        description: "Human-machine hybridization reaches a tipping point, sparking conflict over the future of evolution.",
        rating: "9.0",
        themes: ["Transhumanism", "Warfare"]
      },
      {
        title: "Quantum Ghosts",
        author: "Lisa Zhang",
        publicationYear: "2024",
        description: "Quantum teleportation experiments reveal unexpected connections between parallel universes.",
        rating: "9.2",
        themes: ["Quantum Physics", "Parallel Universes"]
      },
      {
        title: "The Climate Engineers",
        author: "Thomas Anderson",
        publicationYear: "2024",
        description: "Desperate attempts to reverse climate change lead to unexpected consequences for Earth's ecosystem.",
        rating: "9.1",
        themes: ["Climate Fiction", "Geoengineering"]
      },
      {
        title: "Neural Path",
        author: "Rachel Singh",
        publicationYear: "2024",
        description: "A breakthrough in brain-computer interfaces opens new possibilities for human consciousness.",
        rating: "9.0",
        themes: ["Neuroscience", "Virtual Reality"]
      },
      {
        title: "Time's Echo",
        author: "Michael Chang",
        publicationYear: "2024",
        description: "Scientists discover that time itself might be conscious, and it's trying to communicate.",
        rating: "9.3",
        themes: ["Time Travel", "Consciousness"]
      }
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
