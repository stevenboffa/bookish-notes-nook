import { Resend } from 'resend';
import { WelcomeEmail } from '../emails/WelcomeEmail';
import ReactDOMServer from 'react-dom/server';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

console.log('Resend API Key:', import.meta.env.VITE_RESEND_API_KEY ? 'Present' : 'Missing'); // Debug log

export async function sendWelcomeEmail(email: string, username: string) {
  try {
    console.log('Starting email render...'); // Debug log
    const html = ReactDOMServer.renderToString(WelcomeEmail({ username }));
    console.log('Email rendered successfully'); // Debug log
    
    console.log('Sending email via Resend...', { to: email }); // Debug log
    const data = await resend.emails.send({
      from: 'Steven from BookishNotes <read@bookishnotes.com>',
      to: email,
      subject: 'Welcome to BookishNotes!',
      html: html,
      replyTo: 'read@bookishnotes.com',
    });
    console.log('Resend API response:', data); // Debug log

    return { success: true, data };
  } catch (error) {
    console.error('Detailed error in sendWelcomeEmail:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, error };
  }
} 