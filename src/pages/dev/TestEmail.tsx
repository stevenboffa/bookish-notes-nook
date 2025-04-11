import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendWelcomeEmail } from "@/utils/email";
import { toast } from "sonner";

export default function TestEmail() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting email test...'); // Debug log
    setIsLoading(true);

    try {
      console.log('Preparing to send email to:', email); // Debug log
      const username = email.split('@')[0];
      console.log('Extracted username:', username); // Debug log

      console.log('Calling sendWelcomeEmail...'); // Debug log
      const { success, error, data } = await sendWelcomeEmail(email, username);
      console.log('Email send result:', { success, error, data }); // Debug log

      if (success) {
        toast.success('Test welcome email sent successfully!');
        console.log('Email sent successfully:', data); // Debug log
      } else {
        toast.error(`Failed to send email: ${error}`);
        console.error('Email send failed:', error); // Debug log
      }
    } catch (error) {
      console.error('Unexpected error in handleTestEmail:', error); // Debug log
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
      console.log('Email test completed.'); // Debug log
    }
  };

  return (
    <div className="container max-w-md mx-auto mt-20 p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-4">Test Welcome Email</h1>
          <p className="text-gray-600 mb-6">
            Use this page to test the welcome email functionality.
          </p>
        </div>

        <form onSubmit={handleTestEmail} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Test Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
            onClick={() => console.log('Button clicked')} // Debug log
          >
            {isLoading ? 'Sending...' : 'Send Test Welcome Email'}
          </Button>
        </form>

        <div className="mt-4 text-sm text-gray-500">
          <p>Debug Info:</p>
          <p>Current email: {email}</p>
          <p>Loading state: {isLoading ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
} 