
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            BookNotes
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
              <div className="flex flex-col h-full bg-[#403E43] text-white">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <Link 
                    to="/" 
                    className="text-xl font-bold text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    BookNotes
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:text-white/90"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <nav className="flex-1 p-6">
                  <div className="space-y-6">
                    <Link
                      to="/blog"
                      className="flex items-center text-lg font-medium text-white/90 hover:text-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Blog
                    </Link>
                    <Link
                      to="/auth/sign-in"
                      className="flex items-center text-lg font-medium text-white/90 hover:text-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/auth/sign-up"
                      className="flex items-center text-lg font-medium text-white/90 hover:text-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Create Account
                    </Link>
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
