
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Facebook, Instagram } from "lucide-react";
import { useLocation } from "react-router-dom";

export function BlogFooter() {
  const location = useLocation();
  const isOnBlogPost = location.pathname.startsWith('/blog/') && !location.pathname.endsWith('/blog');

  return (
    <footer className="py-12 px-4 md:px-8 border-t">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-8">
          {isOnBlogPost && (
            <div className="flex justify-center">
              <Button variant="ghost" asChild>
                <Link to="/blog" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to all posts
                </Link>
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">BookishNotes</h3>
              <p className="text-sm text-muted-foreground">
                Your digital reading companion for capturing and organizing notes from your favorite books.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Connect</h3>
              <div className="flex space-x-4 items-center">
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
          </div>
          
          <div className="text-center pt-8 border-t border-gray-100">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} BookishNotes. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
