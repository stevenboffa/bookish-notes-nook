
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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Content side */}
      <div className="relative flex items-center justify-center p-8">
        <div className="w-full max-w-[440px] space-y-6">
          {backTo && (
            <Link
              to={backTo.href}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← {backTo.text}
            </Link>
          )}
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          
          {children}
        </div>
      </div>
      
      {/* Image side */}
      <div className="hidden lg:block relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-purple-600 to-indigo-600"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-background/0" />
      </div>
    </div>
  );
}
