
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookText, Quote, FolderKanban, Users, Camera, BrainCircuit, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Meta } from "@/components/Meta";
import { NotesPreview } from "@/components/welcome/NotesPreview";

const SITE_CONFIG = {
  name: "BookishNotes",
  description: "Your personal reading companion",
};

const Welcome = () => {
  const { session } = useAuth();

  if (session) {
    return <Link to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Meta 
        title="Welcome"
        description="BookishNotes helps you take smart notes on everything you read, so you can remember and reference your books for years to come."
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
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
          <div className="absolute inset-0 opacity-10" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1000ms]" />
          
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-bounce-slow" />
          <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-white/20 rounded-full animate-bounce-slow [animation-delay:500ms]" />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-bounce-slow [animation-delay:1000ms]" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in [text-wrap:balance]">
              Never Forget
              <span className="block mt-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                What You Read
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-12 animate-fade-in [animation-delay:200ms] max-w-2xl mx-auto leading-relaxed">
              BookishNotes helps you take smart notes on everything you read, so you can remember and reference your books for years to come.
            </p>

            <div className="animate-fade-in [animation-delay:400ms] relative z-10">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-200 group"
                asChild
              >
                <Link to="/auth/sign-up">
                  Start Taking Notes
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="hidden md:block absolute -bottom-24 left-1/2 transform -translate-x-1/2 opacity-10">
              <div className="relative w-[500px] h-[500px] rotate-45 border border-white/20 rounded-full">
                <div className="absolute inset-4 border border-white/20 rounded-full" />
                <div className="absolute inset-8 border border-white/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Preview Section - UPDATED */}
      <section className="py-20 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">See What Readers Are Capturing</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Join our community of readers who use BookishNotes to save and organize their reading insights, thoughts, quotes, and more.
              </p>
            </div>
            
            <div>
              <div className="max-w-2xl mx-auto">
                <NotesPreview />
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-40 -left-28 w-56 h-56 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -right-28 w-56 h-56 bg-primary/5 rounded-full blur-3xl" />
      </section>

      {/* Main Pain Point Section - REDESIGNED */}
      <section className="py-24 relative overflow-hidden">
        {/* Custom Background Treatment */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-muted/30" style={{
          backgroundImage: `linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)`,
          opacity: 0.8
        }}>
          <div className="absolute inset-0 opacity-10" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236B7280' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The Reader's Dilemma</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                As avid readers, we often can't remember details of books we read years ago. 
                BookishNotes solves this problem with a smart note-taking system that gives you 
                a crystal clear memory of everything you read.
              </p>
            </div>
            
            {/* Visual Storytelling: Forgetting Curve */}
            <div className="mb-20 relative">
              <div className="max-w-2xl mx-auto text-center mb-8">
                <h3 className="text-2xl font-semibold mb-2">The Forgetting Curve</h3>
                <p className="text-muted-foreground">Without active recall, we forget up to 90% of what we read within just one week</p>
              </div>
              
              <div className="relative h-64 md:h-80">
                {/* Curve Visualization */}
                <div className="absolute inset-0 flex items-end">
                  <div className="h-full w-full bg-gradient-to-r from-red-500/20 to-red-500/70 rounded-br-3xl rounded-tr-3xl"
                       style={{clipPath: "polygon(0 100%, 100% 20%, 100% 100%, 0% 100%)"}}>
                  </div>
                </div>
                
                {/* Time Markers */}
                <div className="absolute bottom-0 w-full flex justify-between px-4 text-sm text-muted-foreground">
                  <span>Day 1</span>
                  <span>Day 2</span>
                  <span>Day 7</span>
                  <span>1 Month</span>
                  <span>1 Year</span>
                </div>
                
                {/* Memory Markers with Icons */}
                <div className="absolute top-0 left-[5%] animate-bounce-slow">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <BrainCircuit className="h-8 w-8 text-primary" />
                  </div>
                  <div className="mt-2 text-center text-sm font-medium">100%</div>
                </div>
                
                <div className="absolute top-[40%] left-[30%] animate-bounce-slow [animation-delay:700ms]">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <BrainCircuit className="h-6 w-6 text-primary/60" />
                  </div>
                  <div className="mt-2 text-center text-sm font-medium">60%</div>
                </div>
                
                <div className="absolute top-[70%] left-[70%] animate-bounce-slow [animation-delay:1400ms]">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <BrainCircuit className="h-4 w-4 text-primary/30" />
                  </div>
                  <div className="mt-2 text-center text-sm font-medium">10%</div>
                </div>
              </div>
            </div>
            
            {/* Split-Design Layout: Before/After Comparison */}
            <div className="grid md:grid-cols-2 gap-8 rounded-2xl overflow-hidden shadow-lg">
              {/* Before Side */}
              <div className="bg-muted/50 p-8 relative">
                <div className="absolute top-4 left-4 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  Before
                </div>
                <div className="mt-8 text-center">
                  <div className="bg-red-50 rounded-full p-6 inline-flex mb-6">
                    <BookOpen className="h-12 w-12 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Frustrated Reader</h3>
                  <ul className="text-left space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="mr-2 text-red-400">✗</span> 
                      <span>"I know I read about this somewhere..."</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-400">✗</span> 
                      <span>Can't find important quotes when needed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-400">✗</span> 
                      <span>Insights fade within weeks of finishing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-400">✗</span> 
                      <span>Reading feels like temporary entertainment</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* After Side */}
              <div className="bg-card p-8 relative">
                <div className="absolute top-4 left-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  After
                </div>
                <div className="mt-8 text-center">
                  <div className="bg-primary/10 rounded-full p-6 inline-flex mb-6">
                    <BookOpen className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Confident BookishNotes User</h3>
                  <ul className="text-left space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span> 
                      <span>Quickly retrieves exact information and references</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span> 
                      <span>Saves and organizes favorite quotes by theme</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span> 
                      <span>Retains key insights for years after reading</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500">✓</span> 
                      <span>Builds a valuable knowledge system over time</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Capture Everything Important</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              BookishNotes gives you powerful tools to capture and organize everything that matters in your books.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Feature
              icon={<BookText className="h-6 w-6" />}
              title="Intelligent Note-Taking"
              description="Take detailed notes on chapters, concepts, and key points so you never forget what you read."
              primary
            />
            <Feature
              icon={<Quote className="h-6 w-6" />}
              title="Save Inspiring Quotes"
              description="Collect powerful quotes and passages that move you, and revisit them whenever you need inspiration."
            />
            <Feature
              icon={<FolderKanban className="h-6 w-6" />}
              title="Organize Your Library"
              description="Categorize and organize books by genre, topic, or custom collections to build your personal knowledge system."
            />
            <Feature
              icon={<Users className="h-6 w-6" />}
              title="Share with Friends"
              description="Connect with fellow readers and share book recommendations with your trusted circle."
            />
            <Feature
              icon={<Camera className="h-6 w-6" />}
              title="Capture Visual Content"
              description="Snap photos of diagrams, charts, or important passages directly into your notes for visual reference."
            />
            <Feature
              icon={<BookText className="h-6 w-6" />}
              title="Build a Second Brain"
              description="Transform your reading into a powerful knowledge base that grows with every book you read."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Remember More of What You Read</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our guided note-taking system helps you capture the most important elements of each book.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Step 
                number="01" 
                title="Capture Key Insights" 
                description="Take smart notes on the most important concepts and ideas while you read."
              />
              <Step 
                number="02" 
                title="Organize Your Notes" 
                description="Categorize your notes by chapter, theme, or concept for easy reference."
              />
              <Step 
                number="03" 
                title="Build Your Knowledge" 
                description="Revisit and connect ideas across books to deepen your understanding."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">From Our Readers</h2>
            </div>

            <div className="bg-background p-8 rounded-2xl shadow-md">
              <p className="text-lg italic mb-6">
                "Before BookishNotes, I'd read a book and forget most of it within weeks. Now I have a system that helps me capture and remember the most important ideas from everything I read. It's changed how I learn from books completely."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  AK
                </div>
                <div className="ml-4">
                  <div className="font-semibold">Alex Kim</div>
                  <div className="text-sm text-muted-foreground">Reads 30+ books per year</div>
                </div>
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
              Remember Every Book You Read
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join BookishNotes today and transform your reading experience with our powerful note-taking system.
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
                href="mailto:support@bookishnotes.com" 
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

const Feature = ({ 
  icon, 
  title, 
  description, 
  primary = false 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  primary?: boolean;
}) => (
  <div className={`p-6 rounded-lg border ${primary ? 'border-primary/20 bg-primary/5' : 'bg-card'} hover:shadow-lg transition-shadow`}>
    <div className={`w-12 h-12 rounded-lg ${primary ? 'bg-primary/20' : 'bg-primary/10'} flex items-center justify-center text-primary mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const Step = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <div className="flex flex-col items-center text-center p-6">
    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-4">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Welcome;
