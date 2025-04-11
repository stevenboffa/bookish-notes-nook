import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Meta } from "@/components/Meta";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up form submitted");
    console.log("Environment:", import.meta.env.MODE);
    console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("Supabase Anon Key:", import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 10) + "...");
    console.log("Form data:", { email, password });
    setIsLoading(true);

    try {
      console.log("Attempting to sign up with:", { email });
      
      // Simplified signup request
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      console.log("Sign up response:", { 
        data: {
          user: data?.user ? {
            id: data.user.id,
            email: data.user.email,
            identities: data.user.identities?.length
          } : null,
          session: data?.session ? 'exists' : null
        },
        error: error ? {
          message: error.message,
          status: error.status,
          name: error.name
        } : null
      });

      if (error) {
        console.error("Sign up error details:", error);
        if (error.message.includes('Email rate limit exceeded')) {
          toast.error("Too many signup attempts. Please try again later.");
        } else if (error.message.includes('User already registered')) {
          toast.error("This email is already registered. Please sign in instead.");
        } else {
          toast.error(error.message || "An error occurred during sign up");
        }
        return;
      }

      if (data?.user?.identities?.length === 0) {
        toast.error("User already registered");
        return;
      }

      toast.success("Success! Please check your email to verify your account.");
      navigate("/auth/sign-in");
    } catch (error: any) {
      console.error("Sign up error:", error);
      if (error.message.includes('Email rate limit exceeded')) {
        toast.error("Too many signup attempts. Please try again later.");
      } else {
        toast.error(error.message || "An error occurred during sign up");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      console.log("Attempting Google sign up");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            subscribe: 'false',
          }
        }
      });

      if (error) {
        console.error("Google sign up error:", error);
        throw error;
      }
    } catch (error: any) {
      console.error("Google sign up error:", error);
      toast.error(error.message || "An error occurred during Google sign up");
    }
  };

  return (
    <>
      <Meta 
        title="Sign Up"
        description="Join BookishNotes for free and start your reading journey today."
      />
      <AuthLayout
        title="Join BookNotes"
        subtitle="Start your reading journey today - it's free to join!"
        backTo={{
          text: "Back to sign in",
          href: "/auth/sign-in"
        }}
      >
        <div className="grid gap-6">
          <Button 
            variant="outline" 
            className="w-full h-12 relative"
            onClick={handleGoogleSignUp}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 absolute left-4">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                At least 8 characters long with letters and numbers
              </p>
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? "Creating your account..." : "Create your free account"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="text-primary hover:text-primary/90 font-medium">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:text-primary/90 font-medium">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </div>
      </AuthLayout>
    </>
  );
}
