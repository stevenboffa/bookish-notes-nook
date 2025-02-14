
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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Header for mobile */}
      <div className="md:hidden bg-primary p-6 text-center">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-white" />
        <h1 className="text-2xl font-bold text-white mb-2">BookNotes</h1>
        <p className="text-white/80">Your reading journey starts here</p>
      </div>

      {/* Features Section */}
      <div className="bg-accent flex-1 p-6 md:p-12 lg:p-16">
        <div className="max-w-md mx-auto md:max-w-lg lg:max-w-xl">
          {/* Desktop Logo */}
          <div className="hidden md:flex items-center gap-4 mb-12">
            <BookOpen className="h-10 w-10 text-accent-foreground" />
            <h1 className="text-3xl font-bold text-accent-foreground">BookNotes</h1>
          </div>

          <div className="space-y-8 mt-8 md:mt-0">
            <Feature
              icon={<Check className="h-5 w-5" />}
              title="Track Your Reading Journey"
              description="Keep a digital record of your books, from bestsellers to hidden gems."
            />
            <Feature
              icon={<Check className="h-5 w-5" />}
              title="Capture Your Thoughts"
              description="Write and organize your reading notes and favorite quotes."
            />
            <Feature
              icon={<Check className="h-5 w-5" />}
              title="Connect with Readers"
              description="Share your reading list and discover new books through friends."
            />
          </div>
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="flex-1 p-6 md:p-12 lg:p-16 bg-background">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {isSignUp ? "Create Your Account" : "Welcome Back"}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isSignUp
                ? "Start your reading journey today"
                : "Sign in to continue your reading journey"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
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
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
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
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
      {icon}
    </div>
    <div>
      <h3 className="font-medium text-lg text-accent-foreground">{title}</h3>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  </div>
);

export default Welcome;
