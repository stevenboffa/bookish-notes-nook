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
    <nav className="sticky top-0 z-50 bg-book-DEFAULT p-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex justify-around items-center">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className="flex flex-col items-center group"
              >
                <Button
                  variant={location.pathname === link.href ? "secondary" : "ghost"}
                  size="icon"
                  className={cn(
                    "rounded-full transition-all duration-200",
                    location.pathname === link.href 
                      ? "bg-book-light text-book-DEFAULT hover:bg-book-light/90" 
                      : "text-book-light hover:bg-book-accent/20"
                  )}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                </Button>
                <span className={cn(
                  "text-xs mt-1 font-medium transition-colors duration-200",
                  location.pathname === link.href 
                    ? "text-book-light" 
                    : "text-book-light/80 group-hover:text-book-light"
                )}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}