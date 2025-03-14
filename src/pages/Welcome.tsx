import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookText, Quote, FolderKanban, Users, Camera, BrainCircuit, BookOpen, ChevronLeft, ChevronRight, Facebook, Instagram, Sparkles, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Meta } from "@/components/Meta";
import { NotesPreview } from "@/components/welcome/NotesPreview";
import { Badge } from "@/components/ui/badge";
import { ForgettingCurveGraph } from "@/components/welcome/ForgettingCurveGraph";
import { Card, CardContent } from "@/components/ui/card";
import { UserTestimonials } from "@/components/welcome/UserTestimonials";

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
    <div className="min-h-screen bg-background overflow-hidden">
      <Meta customTitle="Never Forget What You Read | BookishNotes.com" />
      <Header />
      
      {/* Hero Section - Redesigned with ClickUp inspiration */}
      <section className="relative pt-24 md:pt-16 min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100"
        >
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-purple-100 mix-blend-multiply blur-3xl opacity-70 animate-pulse" />
          <div className="absolute bottom-20 right-[10%] w-64 h-64 rounded-full bg-indigo-100 mix-blend-multiply blur-3xl opacity-70 animate-pulse [animation-delay:1000ms]" />
          <div className="absolute top-1/3 right-[15%] w-48 h-48 rounded-full bg-blue-100 mix-blend-multiply blur-3xl opacity-50 animate-pulse [animation-delay:2000ms]" />
        </div>

        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
                {/* Free badge inspired by ClickUp */}
                <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium shadow-md">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>100% FREE FOREVER — No Credit Card</span>
                </div>
                
                {/* Main headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-slate-900">
                  The everything app,
                  <br className="hidden md:block" />
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    for books.
                  </span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl lg:text-2xl text-slate-600 mb-8 leading-relaxed">
                  One app for notes, highlights, insights, and more.
                  <br className="hidden md:block" />
                  Remember everything you read—forever.
                </p>

                {/* Benefits list with checkmarks */}
                <div className="mb-8 space-y-3 lg:space-y-4 max-w-lg mx-auto lg:mx-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <p className="text-slate-700">Take smart notes that connect your reading</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <p className="text-slate-700">Create your own knowledge database of insights</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <p className="text-slate-700">Easily find and reference ideas from past reading</p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                  <Button 
                    size="lg" 
                    className="h-14 px-8 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    asChild
                  >
                    <Link to="/auth/sign-up">
                      Get started. It's FREE!
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="h-14 px-8 text-base border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl"
                    asChild
                  >
                    <Link to="/auth/sign-in">
                      Sign In
                    </Link>
                  </Button>
                </div>
                
                {/* Free forever text */}
                <p className="text-sm text-slate-500 mt-4 font-medium">
                  Free Forever. No Credit Card Required.
                </p>
              </div>

              {/* App Preview Image */}
              <div className="relative z-10 hidden lg:block">
                <div className="relative mx-auto max-w-xl">
                  {/* Decorative elements */}
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-100 rounded-full mix-blend-multiply blur-xl animate-pulse"></div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-100 rounded-full mix-blend-multiply blur-xl animate-pulse"></div>
                  
                  {/* Main app preview */}
                  <div className="bg-white rounded-xl border-4 border-indigo-100/80 shadow-xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                    <img 
                      src="/lovable-uploads/c90ff096-7c52-4d9b-9bdd-bd1db6a9a761.png" 
                      alt="BookishNotes Library Preview" 
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-10 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70">
            <p className="text-slate-500 font-medium">Trusted by avid readers worldwide</p>
            <div className="h-6 border-l border-slate-300 hidden sm:block"></div>
            <div className="flex gap-8 md:gap-12 flex-wrap justify-center">
              <div className="text-slate-700 font-semibold">12,000+ Users</div>
              <div className="text-slate-700 font-semibold">100,000+ Books</div>
              <div className="text-slate-700 font-semibold">500,000+ Notes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section - New dedicated section */}
      <section className="py-16 md:py-24 bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">From Our Readers</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover how BookishNotes has transformed reading experiences for book lovers worldwide
              </p>
            </div>

            <UserTestimonials />
          </div>
        </div>
      </section>

      {/* Reader's Dilemma Section */}
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">The Reader's Dilemma</h2>
              <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                As avid readers, we often can't remember details of books we read years ago. 
                BookishNotes solves this problem with a smart note-taking system that gives you 
                a crystal clear memory of everything you read. <span className="text-primary font-medium">And it's completely free.</span>
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-[#F1F0FB] p-6 md:p-8 relative">
                <div className="absolute top-4 left-4 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  Before
                </div>
                <div className="mt-8 text-center">
                  <div className="bg-red-50 rounded-full p-5 md:p-6 inline-flex mb-4 md:mb-6">
                    <BookOpen className="h-8 w-8 md:h-12 md:w-12 text-red-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3">Forgetful Reader</h3>
                  <ul className="text-left space-y-2 md:space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="mr-2 text-red-400 mt-0.5">✗</span> 
                      <span>"I know I read about this somewhere..."</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-400 mt-0.5">✗</span> 
                      <span>Can't find important quotes when needed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-400 mt-0.5">✗</span> 
                      <span>Insights fade within weeks of finishing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-400 mt-0.5">✗</span> 
                      <span>Reading feels like temporary entertainment</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-card p-6 md:p-8 relative">
                <div className="absolute top-4 left-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  After
                </div>
                <div className="mt-8 text-center">
                  <div className="bg-primary/10 rounded-full p-5 md:p-6 inline-flex mb-4 md:mb-6">
                    <BookOpen className="h-8 w-8 md:h-12 md:w-12 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3">Attentive Reader</h3>
                  <ul className="text-left space-y-2 md:space-y-3 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500 mt-0.5">✓</span> 
                      <span>Quickly retrieves exact information and references</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500 mt-0.5">✓</span> 
                      <span>Saves and organizes favorite quotes by theme</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500 mt-0.5">✓</span> 
                      <span>Retains key insights for years after reading</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-green-500 mt-0.5">✓</span> 
                      <span>Builds a valuable knowledge system over time</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-40 -left-20 md:-left-28 w-56 h-56 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -right-20 md:-right-28 w-56 h-56 bg-primary/5 rounded-full blur-3xl" />
      </section>

      {/* Forgetting Curve Section */}
      <section className="py-16 md:py-24 bg-muted/20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">The Forgetting Curve</h2>
              <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                Research shows that we forget approximately 70% of what we learn within 24 hours 
                and 90% within a week if we don't actively reinforce our knowledge.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <ForgettingCurveGraph />
              </div>
              
              <div className="space-y-4 md:space-y-6">
                <div className="bg-white p-5 md:p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-primary">The Science of Forgetting</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    In 1885, psychologist Hermann Ebbinghaus discovered what's known as "The Forgetting Curve" - 
                    our brains rapidly discard information they deem unimportant. Without a system to reinforce what 
                    you read, your brain will naturally forget most of the content.
                  </p>
                </div>
                
                <div className="bg-white p-5 md:p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-primary">How BookishNotes Helps</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    By creating notes and highlights as you read, you're actively engaging with the material,
                    which significantly improves retention. Our system makes this process effortless and
                    ensures you can revisit key insights whenever you need them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-1/3 -right-20 md:-right-28 w-56 h-56 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 md:-left-28 w-56 h-56 bg-primary/5 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
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
            <div className="text-center mb-10 md:mb-12">
              <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary font-medium">
                Powerful Features
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Powerful Features</h2>
              <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything you need to remember what you read
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
              <Feature
                icon={<BookText className="h-6 w-6" />}
                title="Intelligent Note-Taking"
                description="Take detailed notes on chapters, concepts, and key points so you never forget what you read."
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
                icon={<BrainCircuit className="h-6 w-6" />}
                title="Build a Second Brain"
                description="Transform your reading into a powerful knowledge base that grows with every book you read."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" style={{
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
            <div className="text-center mb-10 md:mb-12">
              <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary font-medium">
                Three Simple Steps
              </Badge>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Remember More of What You Read</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Our guided note-taking system helps you capture the most important elements of each book.
              </p>
            </div>

            <div className="relative">
              {/* Connection lines for desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-primary/20 -translate-y-1/2 z-0" />
              
              <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative z-10">
                <StepCard 
                  number="01" 
                  title="Capture Key Insights" 
                  description="Take smart notes on the most important concepts and ideas while you read."
                  icon="📝"
                />
                <StepCard 
                  number="02" 
                  title="Organize Your Notes" 
                  description="Categorize your notes by chapter, theme, or concept for easy reference."
                  icon="🗂️"
                />
                <StepCard 
                  number="03" 
                  title="Build Your Knowledge" 
                  description="Revisit and connect ideas across books to deepen your understanding."
                  icon="🧠"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary font-medium">
              Free Forever
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
              Remember Every Book You Read
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
              Join BookishNotes today and transform your reading experience with our powerful note-taking system.
            </p>
            <Button 
              size="lg"
              className="h-12 px-8 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
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
      <footer className="py-12 md:py-16 border-t bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">BookishNotes</h3>
              <p className="text-sm text-slate-600 mb-4">Your personal reading companion that helps you remember everything you read.</p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/profile.php?id=61573865312172" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" color="#4267B2" />
                </a>
                <a href="https://x.com/bookishnotesapp" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                  <img 
                    src="/lovable-uploads/414d71e0-1338-48d5-8c9d-41110af89248.png" 
                    alt="X (Twitter)" 
                    className="h-5 w-5" 
                  />
                </a>
                <a href="https://www.instagram.com/bookishnotesapp" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" color="#E1306C" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/blog" className="text-sm text-slate-600 hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-sm text-slate-600 hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-slate-600 hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/terms" className="text-sm text-slate-600 hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-sm text-slate-600 hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-sm text-slate-600 hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="mailto:hello@bookishnotes.com" className="text-sm text-slate-600 hover:text-primary transition-colors">
                    hello@bookishnotes.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} BookishNotes. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const Feature = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

// Step Card Component
const StepCard = ({ number, title, description, icon }: { number: string; title: string; description: string; icon: string }) => {
  return (
    <Card className="border-0 shadow-lg bg-white relative hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6 pt-10 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
            {number}
          </div>
        </div>
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Welcome;
