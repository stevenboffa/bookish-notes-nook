
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, BookOpen, Users, ChevronRight, MessageCircle, Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

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
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/blog" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Blog
          </Link>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="text-sm font-medium"
              asChild
            >
              <Link to="/auth/sign-in">Sign In</Link>
            </Button>
            <Button 
              className="text-sm font-medium"
              asChild
            >
              <Link to="/auth/sign-up">Create Account</Link>
            </Button>
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
            <div className="flex flex-col h-full bg-gradient-to-br from-[#2B2930] to-[#403E43] text-white">
              <div className="p-6 border-b border-white/10">
                <Link 
                  to="/" 
                  className="text-xl font-bold text-white"
                  onClick={() => setIsOpen(false)}
                >
                  BookishNotes
                </Link>
              </div>
              <nav className="flex-1 px-6 py-8">
                <div className="space-y-6">
                  <Link
                    to="/blog"
                    className="flex items-center px-4 py-3 text-lg font-medium text-white/90 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <BookOpen className="h-5 w-5 mr-3" />
                    Blog
                    <ChevronRight className="ml-auto h-5 w-5 text-white/50 group-hover:text-white/80" />
                  </Link>
                  <Link
                    to="/about"
                    className="flex items-center px-4 py-3 text-lg font-medium text-white/90 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <Info className="h-5 w-5 mr-3" />
                    About
                    <ChevronRight className="ml-auto h-5 w-5 text-white/50 group-hover:text-white/80" />
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center px-4 py-3 text-lg font-medium text-white/90 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <MessageCircle className="h-5 w-5 mr-3" />
                    Contact
                    <ChevronRight className="ml-auto h-5 w-5 text-white/50 group-hover:text-white/80" />
                  </Link>

                  <div className="h-px bg-white/10 my-8" />

                  <Link
                    to="/auth/sign-in"
                    className="flex items-center px-4 py-3 text-lg font-medium text-white/90 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <Users className="h-5 w-5 mr-3" />
                    Sign In
                    <ChevronRight className="ml-auto h-5 w-5 text-white/50 group-hover:text-white/80" />
                  </Link>
                  <Link
                    to="/auth/sign-up"
                    className="flex items-center px-4 py-3 text-lg font-medium text-white rounded-lg bg-white/20 hover:bg-white/30 transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    Create Account
                    <ChevronRight className="ml-auto h-5 w-5" />
                  </Link>
                </div>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
