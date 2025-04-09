import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import type { AIBookRecommendation } from '../src/types/books';

config();

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing required environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const categories = [
  'science-fiction',
  'fantasy',
  'mystery-thriller',
  'romance',
  'literary-fiction',
  'biography-memoir',
  'history',
  'science-nature',
  'business-economics',
  'self-development',
];

const sections = ['award-winning', 'new'] as const;

async function populateRecommendations() {
  console.log('Starting to populate recommendations...');
  let successCount = 0;
  let errorCount = 0;

  for (const category of categories) {
    for (const section of sections) {
      try {
        console.log(`\nProcessing ${category} - ${section}...`);

        // Check if recommendations already exist
        const { data: existing } = await supabase
          .from('static_book_recommendations')
          .select('id')
          .eq('category', category)
          .eq('section', section)
          .single();

        if (existing) {
          console.log(`✓ Recommendations already exist for ${category} - ${section}`);
          successCount++;
          continue;
        }

        // Generate recommendations using OpenAI
        console.log(`Generating recommendations for ${category} - ${section}...`);
        const response = await fetch(`${supabaseUrl}/functions/v1/book-recommendations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceRoleKey}`,
          },
          body: JSON.stringify({
            category,
            section,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate recommendations: ${response.statusText}`);
        }

        const recommendations = await response.json() as AIBookRecommendation[];
        console.log(`Generated ${recommendations.length} recommendations`);

        // Store in database
        const { error } = await supabase
          .from('static_book_recommendations')
          .insert({
            category,
            section,
            books: recommendations,
          });

        if (error) {
          throw error;
        }

        console.log(`✓ Successfully stored recommendations for ${category} - ${section}`);
        successCount++;
      } catch (error) {
        console.error(`✗ Error processing ${category} - ${section}:`, error);
        errorCount++;
      }
    }
  }

  console.log('\nPopulation completed:');
  console.log(`✓ Successfully processed: ${successCount} categories`);
  console.log(`✗ Errors encountered: ${errorCount} categories`);
}

// Run the population script
console.log('Starting recommendation population script...');
populateRecommendations()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 