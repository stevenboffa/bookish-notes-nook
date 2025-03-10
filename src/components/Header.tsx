
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, BookOpen, Users, ChevronRight, MessageCircle, Info, LogIn, UserPlus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { session } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!session?.user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin, email")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user,
  });

  // Check if the user is the specified admin
  const isSpecificAdmin = profile?.email === "hi@stevenboffa.com";

  // Don't show header on mobile in dashboard view
  if (isMobile && window.location.pathname === "/dashboard") {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b w-full">
      <div className="flex items-center justify-between h-16 px-4 max-w-6xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          BookishNotes
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {/* Regular navigation links for both authenticated/unauthenticated users */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="text-sm font-medium hover:bg-primary/5 hover:text-primary transition-all duration-200"
              asChild
            >
              <Link to="/blog">Blog</Link>
            </Button>
            <Button 
              variant="ghost" 
              className="text-sm font-medium hover:bg-primary/5 hover:text-primary transition-all duration-200"
              asChild
            >
              <Link to="/contact">Contact</Link>
            </Button>
            <Button 
              variant="ghost" 
              className="text-sm font-medium hover:bg-primary/5 hover:text-primary transition-all duration-200"
              asChild
            >
              <Link to="/faq">FAQ</Link>
            </Button>
            
            {/* Auth buttons with enhanced styling for non-authenticated users */}
            {!session && (
              <>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 text-sm font-medium hover:bg-primary/5 hover:text-primary transition-all duration-200"
                  asChild
                >
                  <Link to="/auth/sign-in">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
                  asChild
                >
                  <Link to="/auth/sign-up">
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full p-0">
            <div className="flex flex-col h-full bg-gradient-to-br from-white to-slate-50 text-slate-800">
              <div className="p-6 border-b border-slate-200">
                <Link 
                  to="/" 
                  className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
                  onClick={() => setIsOpen(false)}
                >
                  BookishNotes
                </Link>
              </div>
              <nav className="flex-1 px-6 py-8">
                <div className="space-y-5">
                  <Link
                    to="/contact"
                    className="flex items-center px-4 py-3 text-lg font-medium text-slate-700 rounded-lg bg-white shadow-sm hover:bg-primary hover:text-white transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <MessageCircle className="h-5 w-5 mr-3" />
                    Contact
                    <ChevronRight className="ml-auto h-5 w-5 text-slate-400 group-hover:text-white" />
                  </Link>
                  <Link
                    to="/faq"
                    className="flex items-center px-4 py-3 text-lg font-medium text-slate-700 rounded-lg bg-white shadow-sm hover:bg-primary hover:text-white transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <Info className="h-5 w-5 mr-3" />
                    FAQ
                    <ChevronRight className="ml-auto h-5 w-5 text-slate-400 group-hover:text-white" />
                  </Link>

                  <div className="h-px bg-slate-200 my-6" />

                  <div className="bg-primary/5 rounded-xl p-5">
                    <h3 className="font-medium text-lg mb-3 text-slate-800">Ready to start your journey?</h3>
                    <p className="text-slate-600 text-sm mb-4">Create your free account and start organizing your reading notes today.</p>
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-white text-slate-800 border border-slate-200 hover:bg-slate-50"
                        onClick={() => setIsOpen(false)}
                        asChild
                      >
                        <Link to="/auth/sign-in">
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign In
                        </Link>
                      </Button>
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        onClick={() => setIsOpen(false)}
                        asChild
                      >
                        <Link to="/auth/sign-up">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Create Account
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
