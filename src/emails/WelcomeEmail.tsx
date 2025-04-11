import * as React from 'react';

interface WelcomeEmailProps {
  username: string;
}

export const WelcomeEmail = ({ username }: WelcomeEmailProps) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <div style={{ backgroundColor: '#9333ea', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: 'white', margin: '0' }}>Welcome to BookishNotes!</h1>
    </div>
    
    <div style={{ padding: '30px' }}>
      <h2 style={{ color: '#333' }}>Ready to start your reading adventure, {username}?</h2>
      
      <p>We're thrilled to have you join our community. Thank you for signing up!</p>
      
      <p>With your new account, you can:</p>
      <ul>
        <li>Create your library of books you have read or are currently reading</li>
        <li>Add a variety of note types to each book in your library</li>
        <li>Connect with others in the community to see what they're reading</li>
      </ul>
      
      <div style={{ backgroundColor: '#f7f7f7', padding: '15px', borderRadius: '5px', margin: '20px 0' }}>
        <p><strong>Getting Started:</strong></p>
        <p>Sign into BookishNotes and add your first book to your library!</p>
        <a 
          href="https://bookishnotes.app/auth/sign-in" 
          style={{
            display: 'inline-block',
            backgroundColor: '#9333ea',
            color: 'white',
            padding: '10px 20px',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          Get Started
        </a>
      </div>
      
      <div style={{ backgroundColor: '#f7f7f7', padding: '15px', borderRadius: '5px', margin: '20px 0' }}>
        <p><strong>BookishNotes Resources:</strong></p>
        <p>Find a list of guides and features for everything BookishNotes has to offer in our extensive resource center!</p>
        <a 
          href="https://bookishnotes.app/resources" 
          style={{
            display: 'inline-block',
            backgroundColor: '#9333ea',
            color: 'white',
            padding: '10px 20px',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          Learn More
        </a>
      </div>
      
      <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
      
      <p>Best regards,<br />The BookishNotes Team</p>
      
      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />
      <p style={{ fontSize: '12px', color: '#777' }}>
        © 2025 BookishNotes. All rights reserved.
      </p>
    </div>
  </div>
);

export default WelcomeEmail; 