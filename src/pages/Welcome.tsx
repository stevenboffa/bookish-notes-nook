
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Bookmark, PenLine, Users, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

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
      <div 
        className="w-full text-white py-20 md:py-32 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #9b87f5 0%, #7c6ad6 100%)"
        }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGMxMC4zODcgMCAxOC04LjA1OSAxOC0xOHMtOC4wNTktMTgtMTgtMTh6bTAgMzJjLTcuNzMyIDAtMTQtNi4yNjgtMTQtMTRzNi4yNjgtMTQgMTQtMTQgMTQgNi4yNjggMTQgMTQtNi4yNjggMTQtMTQgMTR6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-10" />
        <div className="max-w-3xl mx-auto text-center px-4 relative">
          <div className="animate-bounce-slow mb-8">
            <BookOpen className="h-20 w-20 mx-auto mb-6 transform transition-transform hover:scale-110 duration-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Welcome to BookNotes
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Your personal space for capturing thoughts, quotes, and memories from every book you read.
          </p>
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="max-w-md mx-auto px-4 py-12 -mt-8 relative z-10">
        <div className="bg-background border rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-8">
            {isSignUp ? "Create Your Account" : "Sign In"}
          </h2>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                required
              />
              {isSignUp && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center">
                  <Lock className="h-3 w-3 mr-1" />
                  Minimum 8 characters required
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg relative overflow-hidden transition-all duration-300 transform hover:scale-[1.02]" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              ) : (
                isSignUp ? "Create Account" : "Sign In"
              )}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline font-medium transition-colors duration-200"
              >
                {isSignUp ? "Sign In" : "Create Account"}
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "10,000+", label: "Active Readers" },
              { number: "50,000+", label: "Books Tracked" },
              { number: "100,000+", label: "Notes Created" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Your Reading Journey Awaits
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          <Feature
            icon={<Bookmark className="h-6 w-6" />}
            title="Track Your Books"
            description="Keep a digital record of every book you read, from bestsellers to hidden gems."
          />
          <Feature
            icon={<PenLine className="h-6 w-6" />}
            title="Save Your Thoughts"
            description="Capture meaningful quotes, write detailed notes, and preserve your reflections."
          />
          <Feature
            icon={<Users className="h-6 w-6" />}
            title="Connect & Share"
            description="Join a community of readers, share recommendations, and discover new books."
          />
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Start Your Reading Journey Today</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join thousands of readers who are already tracking their reading journey, sharing insights, and discovering new books.
          </p>
          <Button
            onClick={() => setIsSignUp(true)}
            className="h-12 px-8 text-lg"
            variant="default"
          >
            Create Your Free Account
          </Button>
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
  <div className="text-center group transition-all duration-300 hover:transform hover:-translate-y-1">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors duration-300">
      {icon}
    </div>
    <h3 className="font-bold text-xl mb-4">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

export default Welcome;
