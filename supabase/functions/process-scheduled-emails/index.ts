
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Get pending emails that are due to be sent
    const { data: scheduledEmails, error: fetchError } = await supabase
      .from('scheduled_emails')
      .select(`
        id,
        user_id,
        template_id,
        email_templates (
          subject,
          content
        ),
        profiles (
          email
        )
      `)
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .limit(10); // Process in batches

    if (fetchError) throw fetchError;

    console.log(`Processing ${scheduledEmails?.length || 0} scheduled emails`);

    for (const email of scheduledEmails || []) {
      try {
        const userEmail = email.profiles?.email;
        if (!userEmail) {
          throw new Error(`No email found for user ${email.user_id}`);
        }

        // Send email using Resend
        const emailResponse = await resend.emails.send({
          from: "BookishNotes <no-reply@resend.dev>",
          to: [userEmail],
          subject: email.email_templates.subject,
          html: email.email_templates.content,
        });

        // Update email status to sent
        const { error: updateError } = await supabase
          .from('scheduled_emails')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', email.id);

        if (updateError) throw updateError;

        console.log(`Successfully sent email ${email.id} to ${userEmail}`);
      } catch (error) {
        console.error(`Failed to send email ${email.id}:`, error);

        // Update email status to failed
        await supabase
          .from('scheduled_emails')
          .update({ 
            status: 'failed',
            error_message: error.message
          })
          .eq('id', email.id);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        processed: scheduledEmails?.length || 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in process-scheduled-emails:', error);
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
