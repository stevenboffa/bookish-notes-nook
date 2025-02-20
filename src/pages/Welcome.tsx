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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 150%, rgba(156, 39, 176, 0.15) 0%, rgba(156, 39, 176, 0) 50%),
              radial-gradient(circle at 80% -50%, rgba(64, 76, 234, 0.2) 0%, rgba(64, 76, 234, 0) 50%),
              linear-gradient(135deg, #9b87f5 0%, #7c6ad6 100%)
            `
          }}
        >
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Floating shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top left shape */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          {/* Bottom right shape */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1000ms]" />
          
          {/* Floating circles */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-bounce-slow" />
          <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-white/20 rounded-full animate-bounce-slow [animation-delay:500ms]" />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-bounce-slow [animation-delay:1000ms]" />
        </div>

        {/* Content */}
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Animated badge */}
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm mb-8 animate-fade-in">
              <span className="flex h-2 w-2 mr-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
              </span>
              Join 10,000+ readers today
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in [text-wrap:balance]">
              Your Digital
              <span className="block mt-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Reading Journey
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-white/90 mb-12 animate-fade-in [animation-delay:200ms] max-w-2xl mx-auto leading-relaxed">
              Track your books, capture your thoughts, and connect with fellow readers - all in one beautifully designed space.
            </p>

            {/* CTA Button */}
            <div className="animate-fade-in [animation-delay:400ms]">
              <Button 
                size="lg" 
                className="relative h-14 px-8 text-lg bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-200 group"
                asChild
              >
                <Link to="/auth/sign-up">
                  Start Your Reading Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in [animation-delay:600ms]">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">10k+</div>
                <div className="text-white/70 text-sm">Active Readers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">100k+</div>
                <div className="text-white/70 text-sm">Books Tracked</div>
              </div>
              <div className="text-center md:col-span-1 col-span-2">
                <div className="text-3xl font-bold mb-1">50k+</div>
                <div className="text-white/70 text-sm">Notes Created</div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="hidden md:block absolute -bottom-24 left-1/2 transform -translate-x-1/2 opacity-10">
              <div className="relative w-[500px] h-[500px] rotate-45 border border-white/20 rounded-full">
                <div className="absolute inset-4 border border-white/20 rounded-full" />
                <div className="absolute inset-8 border border-white/20 rounded-full" />
              </div>
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
