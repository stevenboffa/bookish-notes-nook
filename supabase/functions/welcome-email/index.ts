import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user data from the request
    const { user } = await req.json()

    // Initialize Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    // Send welcome email
    const { data, error } = await resend.emails.send({
      from: 'BookishNotes <welcome@bookishnotes.com>',
      to: user.email,
      subject: 'Welcome to BookishNotes!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7C3AED;">Welcome to BookishNotes!</h1>
          <p>Hi ${user.user_metadata?.full_name || 'there'},</p>
          <p>We're excited to have you join our community of readers! BookishNotes is your personal reading companion, helping you track your reading journey and remember what you read.</p>
          
          <h2 style="color: #7C3AED;">Getting Started</h2>
          <p>Here are a few things you can do to get started:</p>
          <ul>
            <li>Add your first book to your library</li>
            <li>Create notes while reading</li>
            <li>Track your reading progress</li>
            <li>Connect with other readers</li>
          </ul>

          <p>If you have any questions, feel free to reach out to our support team.</p>
          
          <p>Happy reading!</p>
          <p>The BookishNotes Team</p>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending welcome email:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to send welcome email' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in welcome-email function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 