import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Grid, Heart, PlusCircle, User, Users } from "lucide-react";

export function Navigation() {
  const location = useLocation();
  const { session } = useAuth();

  const links = session ? [
    { href: "/dashboard", label: "Dashboard", icon: Grid },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/add-book", label: "Add Book", icon: PlusCircle },
    { href: "/friends", label: "Friends", icon: Users },
    { href: "/profile", label: "Profile", icon: User },
  ] : [
    { href: "/", label: "Welcome" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b p-4 shadow-sm">
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
                    "rounded-full transition-all duration-200 bg-black",
                    location.pathname === link.href 
                      ? "text-white hover:bg-black/90" 
                      : "text-white hover:bg-black/80"
                  )}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                </Button>
                <span className="text-xs mt-1.5 font-medium text-black">
                  {link.label}
                </span>
                {location.pathname === link.href && (
                  <div className="absolute -bottom-2 w-1.5 h-1.5 bg-black rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}