import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookText, Quote, FolderKanban, Users, Camera, BrainCircuit, BookOpen, ChevronRight, Facebook, Instagram, Sparkles, Check, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Meta } from "@/components/Meta";
import { NotesPreview } from "@/components/welcome/NotesPreview";
import { Badge } from "@/components/ui/badge";
import { ForgettingCurveGraph } from "@/components/welcome/ForgettingCurveGraph";
import { Card, CardContent } from "@/components/ui/card";
import { BookPreviewGrid } from "@/components/welcome/BookPreviewGrid";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const SITE_CONFIG = {
  name: "BookishNotes",
  description: "Your personal reading companion",
};

const Welcome = () => {
  const { session } = useAuth();
  const isMobile = useIsMobile();

  if (session) {
    return <Link to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Meta customTitle="Never Forget What You Read | BookishNotes.com" />
      <Header />
      
      {/* Improved Hero Section with more impact */}
      <section className="relative pt-24 md:pt-16 min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-sky-50"
        >
          {/* Enhanced grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.05]" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Enhanced background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-purple-200 mix-blend-multiply blur-3xl opacity-70 animate-pulse" />
          <div className="absolute bottom-20 right-[10%] w-72 h-72 rounded-full bg-indigo-200 mix-blend-multiply blur-3xl opacity-70 animate-pulse [animation-delay:1000ms]" />
          <div className="absolute top-1/3 right-[15%] w-56 h-56 rounded-full bg-blue-200 mix-blend-multiply blur-3xl opacity-50 animate-pulse [animation-delay:2000ms]" />
        </div>

        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* More impactful headline and content */}
            <div className="flex flex-col items-center text-center mb-10">
              {/* Main headline - changed from gradient to solid dark color */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-[#24223e] max-w-4xl leading-[1.2] md:leading-[1.2] lg:leading-[1.2] pb-1">
                Transform your reading into knowledge that lasts forever
              </h1>

              {/* Subheadline - more benefits focused */}
              <p className="text-lg md:text-xl lg:text-2xl text-slate-600 mb-8 leading-relaxed max-w-3xl">
                Most people forget 90% of what they read within a week. BookishNotes helps you 
                capture, organize, and remember your most valuable insights—forever.
              </p>

              {/* Enhanced CTA section with primary and secondary buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
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
              </div>
              
              {/* Simplified "Free forever" text */}
              <p className="text-sm text-slate-600 font-medium mt-6">
                Free Forever. No Credit Card Required.
              </p>
            </div>

            {/* Enhanced App Preview with subtle animation */}
            <div className="relative z-10 max-w-7xl mx-auto mt-8 transition-all duration-300 hover:translate-y-[-5px]">
              <div className="relative">
                {/* Enhanced decorative elements */}
                <div className="absolute -top-6 -left-6 w-28 h-28 bg-indigo-100 rounded-full mix-blend-multiply blur-xl animate-pulse"></div>
                <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-purple-100 rounded-full mix-blend-multiply blur-xl animate-pulse"></div>
                
                {/* Desktop app preview with enhanced shadow and border */}
                {!isMobile && (
                  <div className="bg-white rounded-xl border-8 border-indigo-100/80 shadow-2xl overflow-hidden transform transition-all duration-500">
                    <img 
                      src="/lovable-uploads/246539c0-d6ff-409e-a267-306de7cc9aa6.png" 
                      alt="BookishNotes App Preview" 
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}
                
                {/* Mobile app preview - Book list with enhanced border */}
                {isMobile && (
                  <div className="bg-white rounded-xl border-8 border-indigo-100/80 shadow-2xl overflow-hidden transform transition-all duration-500">
                    <img 
                      src="/lovable-uploads/416d1480-d11e-4030-881b-a11830e59197.png" 
                      alt="BookishNotes Mobile Preview" 
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Social Proof Section */}
      <section id="social-proof" className="py-12 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-slate-700 font-medium text-lg md:text-xl">Trusted by avid readers worldwide</p>
              
              {/* Enhanced metrics display with icons and larger numbers */}
              <div className="grid grid-cols-3 gap-8 md:gap-16">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-primary mb-1">12K+</span>
                  <span className="text-slate-600 text-sm">Active Users</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-primary mb-1">100K+</span>
                  <span className="text-slate-600 text-sm">Books</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-primary mb-1">500K+</span>
                  <span className="text-slate-600 text-sm">Notes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reader's Insights Section - Enhanced with consistent card styling */}
      <section id="how-it-works" className="py-20 md:py-28 bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:16px_16px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4 px-4 py-1 border-white/20 bg-white/10 text-white font-medium">
                Reader Insights
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Never Lose What You Learn</h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Join thousands of readers who are capturing insights and building their knowledge base
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl transition-all duration-300 hover:bg-white/15">
                <NotesPreview />
              </div>
              
              <div className="space-y-6">
                {/* Standardized card designs with consistent styling */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/10 shadow-xl text-white transition-all duration-300 hover:bg-white/15 hover:translate-y-[-2px]">
                  <CardContent className="p-6">
                    <div className="flex items-start mb-3">
                      <div className="mr-4 bg-white/20 rounded-lg p-2">
                        <BrainCircuit className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Build Your Second Brain</h3>
                        <p className="text-white/80">
                          Your brain is for having ideas, not holding them. BookishNotes helps you build a knowledge system that grows with every book you read.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 backdrop-blur-sm border-white/10 shadow-xl text-white transition-all duration-300 hover:bg-white/15 hover:translate-y-[-2px]">
                  <CardContent className="p-6">
                    <div className="flex items-start mb-3">
                      <div className="mr-4 bg-white/20 rounded-lg p-2">
                        <Quote className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Connect Ideas Across Books</h3>
                        <p className="text-white/80">
                          Discover unexpected connections between different authors and concepts, enabling deeper understanding and creative insights.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 backdrop-blur-sm border-white/10 shadow-xl text-white transition-all duration-300 hover:bg-white/15 hover:translate-y-[-2px]">
                  <CardContent className="p-6">
                    <div className="flex items-start mb-3">
                      <div className="mr-4 bg-white/20 rounded-lg p-2">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Never Forget What You Read</h3>
                        <p className="text-white/80">
                          Quickly retrieve specific quotes, concepts, and insights years after you've read a book.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Reader's Dilemma Section */}
      <section className="py-20 md:py-28 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary font-medium">
                The Problem
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The Reader's Dilemma</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                As avid readers, we often can't remember details of books we read years ago. 
                BookishNotes solves this problem with a smart note-taking system that gives you 
                a crystal clear memory of everything you read. <span className="text-primary font-medium">And it's completely free.</span>
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-[#F1F0FB] p-6 md:p-8 relative">
                <div className="absolute top-4 left-4 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  Before
                </div>
                <div className="mt-8 text-center">
                  <div className="bg-red-50 rounded-full p-5 md:p-6 inline-flex mb-6">
                    <BookOpen className="h-10 w-10 md:h-12 md:w-12 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Forgetful Reader</h3>
                  <ul className="text-left space-y-3 md:space-y-4 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="mr-3 text-red-500 flex-shrink-0 mt-0.5">✗</span> 
                      <span>"I know I read about this somewhere..."</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-red-500 flex-shrink-0 mt-0.5">✗</span> 
                      <span>Can't find important quotes when needed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-red-500 flex-shrink-0 mt-0.5">✗</span> 
                      <span>Insights fade within weeks of finishing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-red-500 flex-shrink-0 mt-0.5">✗</span> 
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
                  <div className="bg-primary/10 rounded-full p-5 md:p-6 inline-flex mb-6">
                    <BookOpen className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Attentive Reader</h3>
                  <ul className="text-left space-y-3 md:space-y-4 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="mr-3 text-green-500 flex-shrink-0 mt-0.5">✓</span> 
                      <span>Quickly retrieves exact information and references</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-green-500 flex-shrink-0 mt-0.5">✓</span> 
                      <span>Saves and organizes favorite quotes by theme</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-green-500 flex-shrink-0 mt-0.5">✓</span> 
                      <span>Retains key insights for years after reading</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-green-500 flex-shrink-0 mt-0.5">✓</span> 
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

      {/* Enhanced Forgetting Curve Section */}
      <section className="py-20 md:py-28 bg-muted/20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary font-medium">
                The Science
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The Forgetting Curve</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Research shows that we forget approximately 70% of what we learn within 24 hours 
                and 90% within a week if we don't actively reinforce our knowledge.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 transition-all duration-300 hover:shadow-2xl">
                <ForgettingCurveGraph />
              </div>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:translate-y-[-2px]">
                  <div className="flex items-start">
                    <div className="mr-4 bg-primary/10 rounded-lg p-2">
                      <BrainCircuit className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-primary">The Science of Forgetting</h3>
                      <p className="text-muted-foreground">
                        In 1885, psychologist Hermann Ebbinghaus discovered what's known as "The Forgetting Curve" - 
                        our brains rapidly discard information they deem unimportant. Without a system to reinforce what 
                        you read, your brain will naturally forget most of the content.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:translate-y-[-2px]">
                  <div className="flex items-start">
                    <div className="mr-4 bg-primary/10 rounded-lg p-2">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-primary">How BookishNotes Helps</h3>
                      <p className="text-muted-foreground">
                        By creating notes and highlights as you read, you're actively engaging with the material,
                        which significantly improves retention. Our system makes this process effortless and
                        ensures you can revisit key insights whenever you need them.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-1/3 -right-20 md:-right-28 w-56 h-56 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 md:-left-28 w-56 h-56 bg-primary/5 rounded-full blur-3xl" />
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
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
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary font-medium">
                Powerful Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Build your personal knowledge base with these powerful tools
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
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

      {/* Enhanced Steps Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
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
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary font-medium">
                Three Simple Steps
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Remember More of What You Read</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our guided note-taking system helps you capture the most important elements of each book.
              </p>
            </div>

            <div className="relative">
              {/* Connection lines for desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-primary/20 -translate-y-1/2 z-0" />
              
              <div className="grid md:grid-cols-3 gap-8 relative z-10">
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

      {/* Enhanced CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 px-4 py-1 border-white/20 bg-white/10 text-white font-medium">
              Get Started Today
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Remember Every Book You Read
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join BookishNotes today and transform your reading experience with our powerful note-taking system.
            </p>
            <Button 
              size="lg"
              className="h-14 px-8 text-lg bg-white hover:bg-white/90 text-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
              asChild
            >
              <Link to="/auth/sign-up">
                Create Your Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <div className="mt-8 text-white/80 text-sm">
              No credit card required. Start capturing insights today.
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-16 md:py-20 border-t bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">BookishNotes</h3>
              <p className="text-slate-600 mb-6">Your personal reading companion that helps you remember everything you read.</p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/profile.php?id=61573865312172" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors p-2 hover:bg-slate-100 rounded-full">
                  <Facebook className="h-5 w-5" color="#4267B2" />
                </a>
                <a href="https://x.com/bookishnotesapp" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors p-2 hover:bg-slate-100 rounded-full">
                  <img 
                    src="/lovable-uploads/414d71e0-1338-48d5-8c9d-41110af89248.png" 
                    alt="X (Twitter)" 
                    className="h-5 w-5" 
                  />
                </a>
                <a href="https://www.instagram.com/bookishnotesapp" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors p-2 hover:bg-slate-100 rounded-full">
                  <Instagram className="h-5 w-5" color="#E1306C" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-6">Product</h3>
              <ul className="space-y-4">
                <li><Link to="#features" className="text-slate-600 hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="/dashboard" className="text-slate-600 hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link to="/faq" className="text-slate-600 hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-6">Company</h3>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-slate-600 hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/blog" className="text-slate-600 hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="text-slate-600 hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-6">Legal</h3>
              <ul className="space-y-4">
                <li><Link to="/terms" className="text-slate-600 hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy-policy" className="text-slate-600 hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} BookishNotes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature card component for the features section
const Feature = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-3px]">
      <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

// Step card component for the steps section
const StepCard = ({ number, title, description, icon }: { number: string; title: string; description: string; icon: string }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-xl relative transition-all duration-300 hover:shadow-2xl hover:translate-y-[-3px]">
      <div className="absolute -top-3 -left-3 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg z-10">
        {number}
      </div>
      <div className="bg-primary/5 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Welcome;
