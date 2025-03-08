
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
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
            © {currentYear} BookishNotes. All rights reserved.
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="text-xs text-slate-500">Made with ❤️ for readers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
