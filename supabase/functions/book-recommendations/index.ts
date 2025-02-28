
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
}

interface RecommendationRequest {
  userId: string;
  limit?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, limit = 3 } = await req.json() as RecommendationRequest;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch user's books to analyze reading preferences
    const { data: userBooks, error: booksError } = await supabase
      .from('books')
      .select('id, title, author, genre')
      .eq('user_id', userId);

    if (booksError) {
      console.error('Error fetching user books:', booksError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user books' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Extract user preferences (genres, authors)
    const genres = userBooks
      .map((book: Book) => book.genre)
      .filter(Boolean);
    
    const authors = userBooks
      .map((book: Book) => book.author)
      .filter(Boolean);

    console.log(`User has read books in genres: ${genres.join(', ')}`);
    console.log(`User has read books by authors: ${authors.join(', ')}`);

    // For now, return mock recommendations
    // In a production system, this would call an AI service or recommendation algorithm
    const recommendations = [
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        publicationYear: "2020",
        description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
        themes: ["Fiction", "Fantasy", "Self-Discovery"],
        rating: "4.5",
        imageUrl: "https://m.media-amazon.com/images/I/81tCtHFtOgL._AC_UF1000,1000_QL80_.jpg",
        amazonUrl: "https://www.amazon.com/Midnight-Library-Matt-Haig/dp/0525559477"
      },
      {
        title: "The Song of Achilles",
        author: "Madeline Miller",
        publicationYear: "2012",
        description: "A tale of gods, kings, immortal fame, and the human heart, this is a profoundly moving retelling of the Iliad from the perspective of Patroclus.",
        themes: ["Historical Fiction", "Mythology", "LGBTQ+"],
        rating: "4.7",
        imageUrl: "https://m.media-amazon.com/images/I/81G+l8AhsHL._AC_UF1000,1000_QL80_.jpg",
        amazonUrl: "https://www.amazon.com/Song-Achilles-Madeline-Miller/dp/0062060627"
      },
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        publicationYear: "2021",
        description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.",
        themes: ["Science Fiction", "Space", "Adventure"],
        rating: "4.8",
        imageUrl: "https://m.media-amazon.com/images/I/91oup5w6Q4L._AC_UF1000,1000_QL80_.jpg",
        amazonUrl: "https://www.amazon.com/Project-Hail-Mary-Andy-Weir/dp/0593135202"
      },
      {
        title: "Circe",
        author: "Madeline Miller",
        publicationYear: "2018",
        description: "In the house of Helios, god of the sun and mightiest of the Titans, a daughter is born. But Circe is a strange child--not powerful, like her father, nor viciously alluring like her mother.",
        themes: ["Fantasy", "Mythology", "Feminism"],
        rating: "4.6",
        imageUrl: "https://m.media-amazon.com/images/I/81XQ1vQEZcL._AC_UF1000,1000_QL80_.jpg",
        amazonUrl: "https://www.amazon.com/Circe-Madeline-Miller/dp/0316556327"
      },
      {
        title: "The House in the Cerulean Sea",
        author: "TJ Klune",
        publicationYear: "2020",
        description: "A magical island. A dangerous task. A burning secret.",
        themes: ["Fantasy", "LGBTQ+", "Found Family"],
        rating: "4.9",
        imageUrl: "https://m.media-amazon.com/images/I/91vFYn0nMjL._AC_UF1000,1000_QL80_.jpg",
        amazonUrl: "https://www.amazon.com/House-Cerulean-Sea-TJ-Klune/dp/1250217288"
      }
    ];

    // Return a subset of recommendations based on the limit
    const limitedRecommendations = recommendations.slice(0, limit);

    return new Response(
      JSON.stringify({ recommendations: limitedRecommendations }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in book-recommendations function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
