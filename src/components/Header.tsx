
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, BookCheck, LogIn, UserPlus } from "lucide-react";
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

        {/* Desktop Navigation - Removed Blog, FAQ, Contact links */}
        <nav className="hidden md:flex items-center gap-8">
          {/* Navigation links removed as requested */}
        </nav>

        {/* Auth buttons - Updated styles to match screenshot */}
        <div className="hidden md:flex items-center gap-3">
          <Button 
            variant="outline" 
            className="text-slate-700 border border-slate-300 rounded-full px-6 hover:bg-slate-50"
            asChild
            trackingId="header_signin"
          >
            <Link to="/auth/sign-in">
              Log In
            </Link>
          </Button>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-md"
            asChild
            trackingId="header_signup"
          >
            <Link to="/auth/sign-up">
              Sign Up
            </Link>
          </Button>
        </div>

        {/* Mobile Buttons - Updated to match ClickUp style */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Sign Up Button */}
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 h-10 text-sm font-medium"
            asChild
            trackingId="mobile_signup_header"
            onClick={() => trackButtonClick("mobile_signup_header", "header")}
          >
            <Link to="/auth/sign-up">
              Sign Up
            </Link>
          </Button>
          
          {/* Mobile Menu Trigger - Simplified */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border border-gray-200 h-10 w-10 rounded-lg" onClick={() => trackButtonClick("mobile_menu", "header")}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full p-0">
              <div className="flex flex-col h-full bg-white text-slate-800">
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
                    {/* Mobile navigation items */}
                    <div className="space-y-2 mb-8">
                      <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Main Menu</h3>
                      <Link
                        to="/blog"
                        className="flex items-center px-4 py-3 text-base font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                        onClick={() => {
                          setIsOpen(false);
                          trackButtonClick("mobile_blog", "mobile_menu");
                        }}
                      >
                        Blog
                      </Link>
                      <Link
                        to="/contact"
                        className="flex items-center px-4 py-3 text-base font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                        onClick={() => {
                          setIsOpen(false);
                          trackButtonClick("mobile_contact", "mobile_menu");
                        }}
                      >
                        Contact
                      </Link>
                      <Link
                        to="/faq"
                        className="flex items-center px-4 py-3 text-base font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                        onClick={() => {
                          setIsOpen(false);
                          trackButtonClick("mobile_faq", "mobile_menu");
                        }}
                      >
                        FAQ
                      </Link>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <div className="flex flex-col gap-3">
                        <Button
                          variant="outline"
                          className="w-full justify-start border border-slate-200 text-slate-700 hover:bg-slate-50"
                          onClick={() => {
                            setIsOpen(false);
                            trackButtonClick("mobile_signin", "mobile_menu");
                          }}
                          asChild
                        >
                          <Link to="/auth/sign-in">
                            <LogIn className="h-4 w-4 mr-2" />
                            Log In
                          </Link>
                        </Button>
                        <Button
                          className="w-full justify-start bg-indigo-600 hover:bg-indigo-700 text-white"
                          onClick={() => {
                            setIsOpen(false);
                            trackButtonClick("mobile_signup", "mobile_menu");
                          }}
                          asChild
                        >
                          <Link to="/auth/sign-up">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Sign Up Free
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
      </div>
    </header>
  );
}
