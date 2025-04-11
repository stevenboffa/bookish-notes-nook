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

    // Get the user's name from metadata
    const name = user.user_metadata?.full_name || user.user_metadata?.name || 'there';

    // Initialize Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    console.log("Resend API key exists:", !!resendApiKey);
    console.log("Environment variables:", Deno.env.toObject());
    
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
        <!-- HTML and inline CSS for the welcome email -->
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #9333ea; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to BookishNotes!</h1>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #333;">Ready to start your reading adventure, ${name}?</h2>
            
            <p>We're thrilled to have you join our community. Thank you for signing up!</p>
            
            <p>With your new account, you can:</p>
            <ul>
              <li>Create your library of books you have read or are currently reading</li>
              <li>Add a variety of note types to each book in your library</li>
              <li>Connect with others in the community to see what they're reading</li>
            </ul>
            
            <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Getting Started:</strong></p>
              <p>Sign into BookishNotes and add your first book to your library!</p>
              <a href="https://bookishnotes.com/auth/sign-in" style="display: inline-block; background-color: #9333ea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Started</a>
            </div>
            
            <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>BookishNotes Resources:</strong></p>
              <p>Find a list of guides and features for everything BookishNotes has to offer in our extensive resource center!</p>
              <a href="https://bookishnotes.com/resources" style="display: inline-block; background-color: #9333ea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Learn More</a>
            </div>
            
            <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
            
            <p>Best regards,<br>The BookishNotes Team</p>
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #777;">
              © 2025 BookishNotes. All rights reserved.
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending welcome email:', error)
      return new Response(
        JSON.stringify({
          error: 'Failed to send welcome email',
          details: error.message,
          type: error.name,
          stack: error.stack
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
        details: error.message,
        type: error.name,
        stack: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 