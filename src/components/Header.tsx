
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, BookOpen, Users, ChevronRight, MessageCircle, Info, LogIn, UserPlus, Bookmark, BookCheck, BookMarked } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { trackButtonClick } from "./GoogleAnalytics";

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b w-full py-3 md:py-4">
      <div className="flex items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold"
          onClick={() => trackButtonClick("header_logo", "header")}
        >
          <BookCheck className="h-6 w-6 text-indigo-600" />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            BookishNotes
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/blog" 
            className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            onClick={() => trackButtonClick("header_blog", "header")}
          >
            Blog
          </Link>
          <Link 
            to="/faq" 
            className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            onClick={() => trackButtonClick("header_faq", "header")}
          >
            FAQ
          </Link>
          <Link 
            to="/contact" 
            className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            onClick={() => trackButtonClick("header_contact", "header")}
          >
            Contact
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            asChild
            trackingId="header_signin"
          >
            <Link to="/auth/sign-in">
              Sign In
            </Link>
          </Button>
          <Button 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
            asChild
            trackingId="header_signup"
          >
            <Link to="/auth/sign-up">
              Sign Up Free
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => trackButtonClick("mobile_menu", "header")}>
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full p-0">
            <div className="flex flex-col h-full bg-gradient-to-br from-white to-slate-50 text-slate-800">
              <div className="p-6 border-b border-slate-200">
                <Link 
                  to="/" 
                  className="flex items-center gap-2 text-xl font-bold"
                  onClick={() => {
                    setIsOpen(false);
                    trackButtonClick("mobile_logo", "mobile_menu");
                  }}
                >
                  <BookCheck className="h-6 w-6 text-indigo-600" />
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    BookishNotes
                  </span>
                </Link>
              </div>
              <nav className="flex-1 px-6 py-8">
                <div className="space-y-5">
                  <Link
                    to="/blog"
                    className="flex items-center px-4 py-3 text-lg font-medium text-slate-700 rounded-lg bg-white shadow-sm hover:bg-primary hover:text-white transition-colors group"
                    onClick={() => {
                      setIsOpen(false);
                      trackButtonClick("mobile_blog", "mobile_menu");
                    }}
                  >
                    <BookMarked className="h-5 w-5 mr-3" />
                    Blog
                    <ChevronRight className="ml-auto h-5 w-5 text-slate-400 group-hover:text-white" />
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center px-4 py-3 text-lg font-medium text-slate-700 rounded-lg bg-white shadow-sm hover:bg-primary hover:text-white transition-colors group"
                    onClick={() => {
                      setIsOpen(false);
                      trackButtonClick("mobile_contact", "mobile_menu");
                    }}
                  >
                    <MessageCircle className="h-5 w-5 mr-3" />
                    Contact
                    <ChevronRight className="ml-auto h-5 w-5 text-slate-400 group-hover:text-white" />
                  </Link>
                  <Link
                    to="/faq"
                    className="flex items-center px-4 py-3 text-lg font-medium text-slate-700 rounded-lg bg-white shadow-sm hover:bg-primary hover:text-white transition-colors group"
                    onClick={() => {
                      setIsOpen(false);
                      trackButtonClick("mobile_faq", "mobile_menu");
                    }}
                  >
                    <Info className="h-5 w-5 mr-3" />
                    FAQ
                    <ChevronRight className="ml-auto h-5 w-5 text-slate-400 group-hover:text-white" />
                  </Link>

                  <div className="h-px bg-slate-200 my-6" />

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5">
                    <h3 className="font-medium text-lg mb-3 text-slate-800">Ready to start your journey?</h3>
                    <p className="text-slate-600 text-sm mb-4">Create your free account and start organizing your reading notes today.</p>
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-white text-slate-800 border border-slate-200 hover:bg-slate-50"
                        onClick={() => {
                          setIsOpen(false);
                          trackButtonClick("mobile_signin", "mobile_menu");
                        }}
                        asChild
                      >
                        <Link to="/auth/sign-in">
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign In
                        </Link>
                      </Button>
                      <Button
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                        onClick={() => {
                          setIsOpen(false);
                          trackButtonClick("mobile_signup", "mobile_menu");
                        }}
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
