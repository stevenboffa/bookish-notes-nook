
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
      subject: "Welcome to BookishNotes - Your Reading Journey Begins!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #9b87f5; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome to BookishNotes!</h1>
          </div>
          
          <div style="padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; line-height: 1.5;">Hello ${name},</p>
            
            <p style="font-size: 16px; line-height: 1.5;">Thank you for joining BookishNotes! We're thrilled to have you as part of our reading community. Your journey of capturing reading insights starts now.</p>
            
            <h2 style="color: #9b87f5; margin-top: 25px;">What you can do with BookishNotes:</h2>
            
            <div style="background-color: #f9f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <div style="display: flex; margin-bottom: 15px;">
                <div style="min-width: 30px; color: #9b87f5; font-weight: bold;">📚</div>
                <div><strong>Track Books</strong> - Keep a digital record of your entire reading collection</div>
              </div>
              
              <div style="display: flex; margin-bottom: 15px;">
                <div style="min-width: 30px; color: #9b87f5; font-weight: bold;">✏️</div>
                <div><strong>Take Notes</strong> - Capture thoughts, insights, and key concepts</div>
              </div>
              
              <div style="display: flex; margin-bottom: 15px;">
                <div style="min-width: 30px; color: #9b87f5; font-weight: bold;">💬</div>
                <div><strong>Save Quotes</strong> - Never lose those meaningful passages again</div>
              </div>
              
              <div style="display: flex; margin-bottom: 0;">
                <div style="min-width: 30px; color: #9b87f5; font-weight: bold;">👥</div>
                <div><strong>Connect</strong> - Share your reading journey with like-minded readers</div>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${Deno.env.get("PUBLIC_SITE_URL") || "https://bookishnotes.com"}/dashboard" 
                style="background-color: #9b87f5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                Get Started Now
              </a>
            </div>
            
            <p style="font-size: 16px; line-height: 1.5;">We can't wait to see what you'll discover through your reading journey!</p>
            
            <p style="font-size: 16px; line-height: 1.5;">Happy reading!</p>
            
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 0;">The BookishNotes Team</p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>If you have any questions, please <a href="${Deno.env.get("PUBLIC_SITE_URL") || "https://bookishnotes.com"}/contact" style="color: #9b87f5; text-decoration: none;">contact us</a>.</p>
            <p>© ${new Date().getFullYear()} BookishNotes. All rights reserved.</p>
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
