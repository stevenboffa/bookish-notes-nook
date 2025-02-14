
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Welcome = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = isSignUp
        ? await supabase.auth.signUp({
            email,
            password,
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          });

      if (error) throw error;

      toast({
        title: isSignUp ? "Account created!" : "Welcome back!",
        description: isSignUp
          ? "Please check your email to verify your account."
          : "You have successfully logged in.",
      });

      if (!isSignUp) {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Hero/Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-book-DEFAULT items-center justify-center p-12">
        <div className="max-w-lg text-white space-y-8">
          <h1 className="text-5xl font-serif font-bold">
            Your Reading Journey Starts Here
          </h1>
          <div className="space-y-6">
            <Feature
              title="Track Your Books"
              description="Keep a digital record of all your reads, from page-turners to classics."
            />
            <Feature
              title="Capture Your Thoughts"
              description="Write and organize your reading notes, quotes, and reflections."
            />
            <Feature
              title="Connect with Readers"
              description="Share your reading list and discover what others are reading."
            />
          </div>
        </div>
      </div>

      {/* Right Section - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-b from-book-light to-white p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <BookOpen className="h-16 w-16 text-book-DEFAULT" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-book-DEFAULT mb-2">
              Welcome to BookNotes
            </h2>
            <p className="text-gray-600 mb-8">
              Your personal space for meaningful reading reflections
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-book-DEFAULT hover:bg-book-accent transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>

            <p className="text-sm text-center text-gray-600">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-book-DEFAULT hover:underline font-medium"
              >
                {isSignUp ? "Sign In" : "Create Account"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ title, description }: { title: string; description: string }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0 mt-1">
      <div className="w-1.5 h-1.5 bg-white rounded-full" />
    </div>
    <div>
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </div>
  </div>
);

export default Welcome;
