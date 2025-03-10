import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookText, Quote, FolderKanban, Users, Camera, BrainCircuit, BookOpen, ChevronLeft, ChevronRight, Facebook, Instagram } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Meta } from "@/components/Meta";
import { NotesPreview } from "@/components/welcome/NotesPreview";
import { Badge } from "@/components/ui/badge";
import { ForgettingCurveGraph } from "@/components/welcome/ForgettingCurveGraph";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";

const SITE_CONFIG = {
  name: "BookishNotes",
  description: "Your personal reading companion",
};

export default function Welcome() {
  const { session } = useAuth();

  if (session) {
    return <Link to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Meta 
        title="Never Forget What You Read"
        description="Track your reading journey, take notes on books, and connect with other readers on BookishNotes."
        canonicalUrl="https://bookishnotes.com"
      />
      
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-16 min-h-[90vh] flex items-center justify-center overflow-hidden">
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
          {/* Background decorative elements */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1000ms]" />
          
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-bounce-slow" />
          <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-white/20 rounded-full animate-bounce-slow [animation-delay:500ms]" />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-bounce-slow [animation-delay:1000ms]" />
        </div>

        <div className="container mx-auto px-4 py-10 md:py-16 lg:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white animate-fade-in max-w-xl">
              <div className="inline-block mb-6 animate-pulse">
                <div className="bg-white text-primary px-4 py-2 rounded-full font-bold text-sm flex items-center shadow-lg">
                  <span className="mr-1">✨</span> 100% FREE FOREVER <span className="ml-1">✨</span>
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight [text-wrap:balance]">
                Never Forget
                <span className="block mt-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  What You Read
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 md:mb-8 leading-relaxed">
                BookishNotes helps you take smart notes on everything you read, so you can remember and reference your books for years to come. <span className="font-semibold">No payment required, ever.</span>
              </p>

              <div className="relative z-10">
                <Button 
                  size="lg" 
                  className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-200 group"
                  asChild
                >
                  <Link to="/auth/sign-up">
                    Start Taking Notes
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative z-10 animate-fade-in [animation-delay:300ms] mt-6 md:mt-0">
              <NotesPreview />
            </div>
          </div>

          <div className="hidden md:block absolute -bottom-24 left-1/2 transform -translate-x-1/2 opacity-10">
            <div className="relative w-[500px] h-[500px] rotate-45 border border-white/20 rounded-full">
              <div className="absolute inset-4 border border-white/20 rounded-full" />
              <div className="absolute inset-8 border border-white/20 rounded-full" />
            </div>
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

      {/* Testimonial Section */}
      <section className="py-16 md:py-24 bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">From Our Readers</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover how BookishNotes has transformed reading experiences for book lovers worldwide
              </p>
            </div>

            <TestimonialCarousel />
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
              className="h-12 px-6 sm:px-8 text-base"
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
                  <Link to="/privacy" className="text-sm text-slate-600 hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Get Started</h3>
              <p className="text-sm text-slate-600 mb-4">Create your free account today and start taking better notes.</p>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                asChild
              >
                <Link to="/auth/sign-up">
                  Create Free Account
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-slate-500">
              © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-xs text-slate-500">Made with ❤️ for readers</span>
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
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <div 
    className="p-5 md:p-6 rounded-lg border border-muted/20 bg-card transition-all duration-300 hover:shadow-xl 
      group relative overflow-hidden h-full flex flex-col"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
    
    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-primary mb-4 transition-all duration-300
      bg-primary/10 group-hover:bg-primary/20"
    >
      {icon}
    </div>
    
    <h3 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{title}</h3>
    <p className="text-muted-foreground text-sm md:text-base">{description}</p>
  </div>
);

const StepCard = ({ 
  number, 
  title, 
  description, 
  icon 
}: { 
  number: string; 
  title: string; 
  description: string;
  icon: string;
}) => (
  <Card className="flex flex-col items-center text-center p-6 md:p-8 border-primary/10 bg-background hover:shadow-lg transition-all duration-300 relative">
    <div className="absolute -top-5 bg-background border border-primary/20 rounded-full p-1 shadow-lg">
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-lg md:text-xl">
        {number}
      </div>
    </div>
    
    <div className="mt-10 mb-3 text-4xl">{icon}</div>
    <h3 className="text-lg md:text-xl font-semibold mb-2 text-primary">{title}</h3>
    <p className="text-sm md:text-base text-muted-foreground">{description}</p>
    
    <div className="h-1 w-20 bg-gradient-to-r from-primary/80 to-primary/20 rounded-full mt-5"></div>
  </Card>
);

const TestimonialCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    emblaApi.on('select', onSelect);
    onSelect();
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative max-w-5xl mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial, index) => (
            <div className="flex-[0_0_100%] min-w-0 pl-4 md:pl-6" key={index}>
              <div className="bg-background p-6 md:p-8 rounded-2xl shadow-md">
                <div className="flex items-start mb-4">
                  <Quote className="text-primary opacity-50 h-8 w-8 mr-2 flex-shrink-0" />
                  <p className="text-base md:text-lg italic">
                    {testimonial.quote}
                  </p>
                </div>
                <div className="flex items-center mt-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {testimonial.initials}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background shadow-md rounded-full p-2 z-10 hover:bg-muted transition-colors"
        onClick={() => emblaApi?.scrollPrev()}
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <button 
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background shadow-md rounded-full p-2 z-10 hover:bg-muted transition-colors"
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Next testimonial"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      
      <div className="flex justify-center gap-1 mt-4">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              currentIndex === index ? "w-4 bg-primary" : "w-2 bg-primary/30"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const testimonials = [
  {
    quote: "Before BookishNotes, I'd read a book and forget most of it within weeks. Now I have a system that helps me capture and remember the most important ideas from everything I read. It's changed how I learn from books completely.",
    author: "Alex Kim",
    title: "Reads 30+ books per year",
    initials: "AK"
  },
  {
    quote: "I used to highlight passages in my physical books, but I could never find them again when I needed them. BookishNotes lets me organize my thoughts by theme and concept. It's been a game-changer for my research.",
    author: "Maria Rodriguez",
    title: "PhD Student",
    initials: "MR"
  },
  {
    quote: "As someone who reads across many different subjects, I needed a way to connect ideas between books. This platform makes it so easy to create a web of knowledge that grows with every book I read.",
    author: "James Wilson",
    title: "Lifelong learner",
    initials: "JW"
  },
  {
    quote: "I've tried many note-taking apps, but none were specifically designed for books. The structure that BookishNotes provides—with chapters, themes, and quotes—matches exactly how I think about books.",
    author: "Sarah Chen",
    title: "Book club organizer",
    initials: "SC"
  },
  {
    quote: "The ability to quickly reference concepts from books I read years ago has been invaluable for my work. I can pull up specific ideas and quotes in seconds rather than trying to remember where I saw something.",
    author: "Michael Johnson",
    title: "Business consultant",
    initials: "MJ"
  },
  {
    quote: "I love how BookishNotes helps me see patterns in my reading over time. I've discovered themes I'm drawn to that I never noticed before, which has helped me be more intentional about what I read next.",
    author: "Emily Patel",
    title: "Reads across genres",
    initials: "EP"
  },
  {
    quote: "As an author, I use BookishNotes to track ideas and inspiration from other writers. It's become an essential part of my creative process and research workflow.",
    author: "David Thompson",
    title: "Published author",
    initials: "DT"
  }
];

export default Welcome;
