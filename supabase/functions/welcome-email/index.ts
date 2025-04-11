import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'https://esm.sh/resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Welcome email function started");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Request received:", {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries())
    });

    // Get the user data from the request
    const { user } = await req.json()
    console.log("Received user data:", { 
      id: user?.id,
      email: user?.email,
      created_at: user?.created_at,
      metadata: user?.user_metadata
    });

    if (!user?.email) {
      console.error("No email provided in user data");
      throw new Error('No email provided');
    }

    // Initialize Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    console.log("Resend API key exists:", !!resendApiKey); // Log if key exists but not the actual key
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not found in environment variables");
      throw new Error('RESEND_API_KEY not configured');
    }
    console.log("Initializing Resend with API key");
    const resend = new Resend(resendApiKey);

    // Send welcome email
    console.log("Attempting to send welcome email to:", user.email);
    const { data, error } = await resend.emails.send({
      from: 'BookishNotes <welcome@bookishnotes.com>',
      to: user.email,
      subject: 'Welcome to BookishNotes!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7C3AED;">Welcome to BookishNotes!</h1>
          <p>Hi ${user.user_metadata?.full_name || user.user_metadata?.name || 'there'},</p>
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
        JSON.stringify({
          error: 'Failed to send welcome email',
          details: error.message
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log("Welcome email sent successfully:", data);

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
      JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 