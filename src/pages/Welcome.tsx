
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Bookmark, PenLine, Users, ArrowRight, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";

const SITE_CONFIG = {
  name: "BookNotes",
  description: "Your personal reading companion",
};

const Welcome = () => {
  const { session } = useAuth();

  if (session) {
    return <Link to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative pt-32 pb-24 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #9b87f5 0%, #7c6ad6 100%)"
        }}
      >
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Your Digital Reading Journal
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 animate-fade-in [animation-delay:200ms]">
              Track your books, capture your thoughts, and connect with fellow readers - all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in [animation-delay:400ms]">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-12 bg-white text-primary hover:bg-white/90 text-base"
                asChild
              >
                <Link to="/auth/sign-up">
                  Start Your Reading Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 border-white text-white hover:bg-white/10 text-base"
                asChild
              >
                <Link to="/blog">
                  Explore Our Blog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Track Your Reading</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you organize your books, capture your thoughts, and connect with other readers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature
              icon={<BookOpen className="h-6 w-6" />}
              title="Track Your Books"
              description="Keep a detailed record of every book you read, want to read, and are currently reading."
            />
            <Feature
              icon={<PenLine className="h-6 w-6" />}
              title="Take Notes"
              description="Capture your thoughts, favorite quotes, and insights as you read."
            />
            <Feature
              icon={<Bookmark className="h-6 w-6" />}
              title="Organize Collections"
              description="Create custom collections to organize your books by genre, theme, or any way you like."
            />
            <Feature
              icon={<Users className="h-6 w-6" />}
              title="Connect with Readers"
              description="Find and follow other readers who share your literary interests."
            />
            <Feature
              icon={<Star className="h-6 w-6" />}
              title="Rate & Review"
              description="Share your opinions and read reviews from other members of the community."
            />
            <Feature
              icon={<BookOpen className="h-6 w-6" />}
              title="Reading Goals"
              description="Set and track your reading goals to stay motivated throughout the year."
            />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-primary mb-2">10k+</div>
                <div className="text-muted-foreground">Active Readers</div>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-primary mb-2">100k+</div>
                <div className="text-muted-foreground">Books Tracked</div>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl font-bold text-primary mb-2">50k+</div>
                <div className="text-muted-foreground">Notes Created</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Reading Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of readers who use BookNotes to track their reading journey.
              Sign up now and get started for free!
            </p>
            <Button 
              size="lg"
              className="h-12 px-8 text-base"
              asChild
            >
              <Link to="/auth/sign-up">
                Create Your Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <a 
                href="mailto:support@booknotes.com" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Feature = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Welcome;
