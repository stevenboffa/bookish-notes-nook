
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Grid, ShoppingCart, PlusCircle, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Navigation() {
  const location = useLocation();
  const { session } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // Only show navigation when user is authenticated
  if (!session) {
    return null;
  }

  // Check if the current user is an admin
  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user,
    onSuccess: (data) => {
      setIsAdmin(data?.email === "hi@stevenboffa.com");
    }
  });

  // Create links based on user role
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Grid },
    // Only show Buy Books for admin
    ...(isAdmin ? [{ href: "/buy-books", label: "Buy Books", icon: ShoppingCart }] : []),
    { href: "/add-book", label: "Add Book", icon: PlusCircle },
    { href: "/friends", label: "Friends", icon: Users },
    { href: "/profile", label: "Profile", icon: User },
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "d" && e.altKey) {
        window.location.href = "/dashboard";
      } else if (e.key === "a" && e.altKey) {
        window.location.href = "/add-book";
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg pb-safe-bottom">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            
            return (
              <Link
                key={link.href}
                to={link.href}
                className="flex flex-col items-center group relative min-w-[64px] min-h-[64px] justify-center"
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "rounded-xl transition-all duration-300",
                    isActive 
                      ? "bg-primary text-white shadow-lg scale-110" 
                      : "text-text hover:text-primary hover:scale-105"
                  )}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                </Button>
                <span className={cn(
                  "text-xs mt-1 font-medium transition-colors duration-300",
                  isActive ? "text-primary" : "text-text-muted"
                )}>
                  {link.label}
                </span>
                {isActive && (
                  <div className="absolute -top-1 w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
