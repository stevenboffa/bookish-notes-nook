
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "../_shared/cors.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { name, email, subject, message }: ContactFormData = await req.json();

    if (!name || !email || !subject || !message) {
      throw new Error("Missing required fields");
    }

    console.log(`Processing contact request from ${name} <${email}>`);

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "BookishNotes <no-reply@resend.dev>",
      to: [email],
      subject: "We received your message!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #9b87f5;">Thank you for contacting BookishNotes!</h2>
          <p>Hello ${name},</p>
          <p>We've received your message and will get back to you as soon as possible.</p>
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your message:</strong></p>
            <p>${message}</p>
          </div>
          <p>Best regards,<br>The BookishNotes Team</p>
        </div>
      `,
    });

    console.log("User confirmation email sent successfully", userEmailResponse);

    // Forward message to team
    const teamEmailResponse = await resend.emails.send({
      from: "BookishNotes Contact Form <no-reply@resend.dev>",
      to: ["read@bookishnotes.com"], // Updated email address here
      replyTo: email,
      subject: `New Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #9b87f5;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${subject}</td>
            </tr>
          </table>
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px;">
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </div>
        </div>
      `,
    });

    console.log("Team notification email sent successfully", teamEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Contact form submitted successfully" 
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
    console.error("Error in send-contact-email function:", error);
    
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
