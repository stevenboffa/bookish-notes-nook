
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "../_shared/cors.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface WelcomeEmailRequest {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { email, name = "Reader" }: WelcomeEmailRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    console.log(`Sending welcome email to ${email}`);

    // Send welcome email to the new user
    const emailResponse = await resend.emails.send({
      from: "BookishNotes <no-reply@resend.dev>",
      to: [email],
      subject: "Welcome to BookishNotes!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #9b87f5;">Welcome to BookishNotes!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for joining BookishNotes! We're excited to have you as part of our reading community.</p>
          <p>With BookishNotes, you can:</p>
          <ul style="padding-left: 20px;">
            <li>Track your reading progress</li>
            <li>Take organized notes from your favorite books</li>
            <li>Save memorable quotes</li>
            <li>Connect with other readers</li>
          </ul>
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Ready to get started?</strong></p>
            <p>Add your first book and start taking notes. The more you read, the more you'll get out of BookishNotes!</p>
            <a href="${Deno.env.get("PUBLIC_SITE_URL") || "https://bookishnotes.com"}/dashboard" style="background-color: #9b87f5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Go to My Dashboard</a>
          </div>
          <p>Happy reading!</p>
          <p>The BookishNotes Team</p>
          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>If you have any questions, please don't hesitate to <a href="${Deno.env.get("PUBLIC_SITE_URL") || "https://bookishnotes.com"}/contact" style="color: #9b87f5;">contact us</a>.</p>
          </div>
        </div>
      `,
    });

    console.log("Welcome email sent successfully", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Welcome email sent successfully" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error in send-welcome-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
