
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Check } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="w-full bg-primary text-white py-8 px-4 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to BookNotes
          </h1>
          <p className="text-lg text-white/90 max-w-xl mx-auto">
            Your personal space for capturing thoughts, quotes, and memories from every book you read.
          </p>
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="max-w-md mx-auto px-4 py-8 -mt-6 md:-mt-8 relative z-10">
        <div className="bg-background border rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isSignUp ? "Create Your Account" : "Sign In"}
          </h2>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? "Sign In" : "Create Account"}
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Your Reading Journey Awaits
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Feature
            icon={<Check className="h-5 w-5" />}
            title="Track Your Books"
            description="Keep a digital record of every book you read, from bestsellers to hidden gems."
          />
          <Feature
            icon={<Check className="h-5 w-5" />}
            title="Save Your Thoughts"
            description="Capture meaningful quotes, write detailed notes, and preserve your reflections."
          />
          <Feature
            icon={<Check className="h-5 w-5" />}
            title="Connect & Share"
            description="Join a community of readers, share recommendations, and discover new books."
          />
        </div>
      </div>
    </div>
  );
};

const Feature = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode;
  title: string; 
  description: string;
}) => (
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
      {icon}
    </div>
    <h3 className="font-medium text-lg mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Welcome;
