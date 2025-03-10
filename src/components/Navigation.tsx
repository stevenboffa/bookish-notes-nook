
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  UserCircleIcon,
  UsersIcon,
  ShoppingCartIcon,
  FileTextIcon,
  MailIcon,
  LayoutDashboardIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";

export function Navigation() {
  const location = useLocation();
  const { session, refreshSession } = useAuth();

  // Attempt to refresh session when navigation component mounts
  useEffect(() => {
    if (!session) {
      refreshSession();
    }
  }, [session, refreshSession]);

  const { data: profile, isLoading, refetch, error } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) {
        console.log("No session found for profile query");
        return null;
      }
      
      console.log("Fetching profile for user:", session.user.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin, email")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      console.log("Profile data:", data); // Debug log
      return data;
    },
    enabled: !!session?.user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 5, // Retry failed queries 5 times
    retryDelay: (attempt) => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000),
  });

  // Refetch profile data when the component mounts or session changes
  useEffect(() => {
    if (session?.user) {
      refetch();
    }
  }, [session?.user, refetch]);

  // Check if the user is the specified admin
  const isSpecificAdmin = profile?.email === "hi@stevenboffa.com";
  const isAdmin = profile?.is_admin === true;

  // More detailed debug logs
  console.log("Session user ID:", session?.user?.id);
  console.log("Profile loading:", isLoading);
  console.log("Admin status:", isAdmin);
  console.log("Profile data:", profile);
  console.log("Current path:", location.pathname);
  
  // Handle error if needed
  useEffect(() => {
    if (error) {
      toast.error("Error loading profile data. Some features may be unavailable.");
      console.error("Profile query error:", error);
      
      // Try to refresh the session if there's an error
      refreshSession();
    }
  }, [error, refreshSession]);

  // If loading or no session, render a simplified navigation
  if (isLoading && !profile) {
    return (
      <nav className="bg-white border-t py-2 fixed bottom-0 w-full">
        <div className="container max-w-lg mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link
              to="/dashboard"
              className={cn(
                "flex flex-col items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors",
                location.pathname === "/dashboard" && "text-primary"
              )}
            >
              <HomeIcon className="h-6 w-6" />
              <span>Home</span>
            </Link>

            <Link
              to="/friends"
              className={cn(
                "flex flex-col items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors",
                location.pathname === "/friends" && "text-primary"
              )}
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
            >
              <UserCircleIcon className="h-6 w-6" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-t py-2 fixed bottom-0 w-full">
      <div className="container max-w-lg mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            to="/dashboard"
            className={cn(
              "flex flex-col items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors",
              location.pathname === "/dashboard" && "text-primary"
            )}
          >
            <HomeIcon className="h-6 w-6" />
            <span>Home</span>
          </Link>

          {/* Only show Buy Books link for the specific admin */}
          {isSpecificAdmin && (
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

          {/* Show admin dashboard link if profile is_admin is true */}
          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "flex flex-col items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors",
                location.pathname.startsWith("/admin") && "text-primary"
              )}
            >
              <LayoutDashboardIcon className="h-6 w-6" />
              <span>Admin</span>
            </Link>
          )}

          <Link
            to="/friends"
            className={cn(
              "flex flex-col items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors",
              location.pathname === "/friends" && "text-primary"
            )}
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
          >
            <UserCircleIcon className="h-6 w-6" />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
