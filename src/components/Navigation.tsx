import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Grid, Heart, PlusCircle, User } from "lucide-react";

export function Navigation() {
  const location = useLocation();
  const { session } = useAuth();

  const links = session ? [
    { href: "/dashboard", label: "Dashboard", icon: Grid },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/add-book", label: "Add Book", icon: PlusCircle },
    { href: "/profile", label: "Profile", icon: User },
  ] : [
    { href: "/", label: "Welcome" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-book-DEFAULT p-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-around items-center">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className="flex flex-col items-center group relative"
              >
                <Button
                  variant={location.pathname === link.href ? "secondary" : "ghost"}
                  size="icon"
                  className={cn(
                    "rounded-full transition-all duration-200",
                    location.pathname === link.href 
                      ? "bg-white text-book-DEFAULT hover:bg-white/90 shadow-md" 
                      : "text-white hover:bg-white/10"
                  )}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                </Button>
                <span className={cn(
                  "text-xs mt-1.5 font-medium transition-colors duration-200",
                  location.pathname === link.href 
                    ? "text-white" 
                    : "text-white hover:text-white"
                )}>
                  {link.label}
                </span>
                {location.pathname === link.href && (
                  <div className="absolute -bottom-2 w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}