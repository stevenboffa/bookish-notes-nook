
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  UserCircleIcon,
  UsersIcon,
  ShoppingCartIcon,
  FileTextIcon,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export function Navigation() {
  const location = useLocation();
  const { session } = useAuth();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!session?.user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin, email")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      console.log("Profile data:", data); // This will help us debug
      return data;
    },
    enabled: !!session?.user,
  });

  // Check if the user is the specified admin
  const isSpecificAdmin = profile?.email === "hi@stevenboffa.com";

  // Don't show navigation on authentication pages
  if (location.pathname.startsWith("/auth/")) {
    return null;
  }

  // Don't show navigation on landing page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav className="bg-white border-t py-2 fixed bottom-0 w-full z-50">
      <div className="container max-w-lg mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            to="/dashboard"
            className={cn(
              "flex flex-col items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors",
              location.pathname === "/dashboard" && "text-primary"
            )}
            data-tour="dashboard"
          >
            <HomeIcon className="h-6 w-6" />
            <span>Home</span>
          </Link>

          {/* Only show Buy Books link for the specific admin */}
          {isLoading ? (
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
          ) : isSpecificAdmin && (
            <Link
              to="/buy-books"
              className={cn(
                "flex flex-col items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors",
                location.pathname === "/buy-books" && "text-primary"
              )}
            >
              <ShoppingCartIcon className="h-6 w-6" />
              <span>Buy</span>
            </Link>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
          ) : profile?.is_admin && (
            <Link
              to="/admin/posts"
              className={cn(
                "flex flex-col items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors",
                location.pathname.startsWith("/admin") && "text-primary"
              )}
            >
              <FileTextIcon className="h-6 w-6" />
              <span>Admin</span>
            </Link>
          )}

          <Link
            to="/friends"
            className={cn(
              "flex flex-col items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors",
              location.pathname === "/friends" && "text-primary"
            )}
            data-tour="friends"
          >
            <UsersIcon className="h-6 w-6" />
            <span>Friends</span>
          </Link>

          <Link
            to="/profile"
            className={cn(
              "flex flex-col items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors",
              location.pathname === "/profile" && "text-primary"
            )}
            data-tour="profile"
          >
            <UserCircleIcon className="h-6 w-6" />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
