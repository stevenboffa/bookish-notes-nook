
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  backTo?: {
    text: string;
    href: string;
  };
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle,
  backTo 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Content side */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        {/* Logo header */}
        <Link 
          to="/" 
          className="mb-16 text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
        >
          BookNotes
        </Link>

        <div className="w-full max-w-[440px] space-y-8">
          {backTo && (
            <Link
              to={backTo.href}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← {backTo.text}
            </Link>
          )}
          
          <div className="space-y-3 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground text-base sm:text-lg">
                {subtitle}
              </p>
            )}
          </div>
          
          {children}

          <div className="text-sm text-center text-muted-foreground">
            <p className="mb-4">
              By signing in, you agree to BookNotes'
              {" "}
              <Link to="/terms" className="text-primary hover:text-primary/90 underline">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-primary hover:text-primary/90 underline">
                Privacy Policy
              </Link>
            </p>
            <p>
              BookNotes will only use your data to provide and improve the service.
              We never share your personal information with third parties without your explicit consent.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center space-y-4">
          <div className="text-sm text-muted-foreground">
            Need help?{" "}
            <a 
              href="mailto:support@booknotes.com" 
              className="text-primary hover:text-primary/90 font-medium"
            >
              Contact our support team
            </a>
          </div>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BookNotes. All rights reserved.
          </div>
        </footer>
      </div>
      
      {/* Image side */}
      <div className="hidden lg:block relative w-1/2 overflow-hidden bg-gradient-to-b from-purple-600 to-indigo-600">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute inset-0 backdrop-blur-[1px]" />
          
          {/* Content overlay */}
          <div className="relative h-full flex flex-col justify-center items-center p-12 text-white text-center">
            <div className="max-w-[420px] space-y-6">
              <h2 className="text-3xl font-bold">Track your reading journey</h2>
              <p className="text-lg text-white/90">
                Join thousands of readers who use BookNotes to discover, track, and share their favorite books.
              </p>
              
              {/* Feature list */}
              <ul className="space-y-4 text-left">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Keep track of books you've read</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Take notes and highlight passages</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Connect with other readers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
