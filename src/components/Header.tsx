
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            BookNotes
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
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
                <Link to="/?action=signin">Sign In</Link>
              </Button>
              <Button 
                className="text-sm font-medium"
                asChild
              >
                <Link to="/?action=signup">Create Account</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
