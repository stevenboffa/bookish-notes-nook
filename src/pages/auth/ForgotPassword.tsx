import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Meta } from "@/components/Meta";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Check your email for the password reset link");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent you a password reset link"
        backTo={{
          text: "Back to sign in",
          href: "/auth/sign-in"
        }}
      >
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-muted-foreground">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              onClick={() => setIsSuccess(false)}
              className="text-primary hover:text-primary/90 font-medium"
            >
              try again
            </button>
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <>
      <Meta 
        title="Reset Password"
        description="Reset your BookishNotes password"
      />
      <AuthLayout
        title="Reset your password"
        subtitle="Enter your email and we'll send you a reset link"
        backTo={{
          text: "Back to sign in",
          href: "/auth/sign-in"
        }}
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending reset link..." : "Send reset link"}
          </Button>
        </form>
      </AuthLayout>
    </>
  );
} 