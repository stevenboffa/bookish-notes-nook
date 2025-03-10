
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  UserCircleIcon,
  UsersIcon,
  ShoppingCartIcon,
  FileTextIcon,
  MailIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function Navigation() {
  const location = useLocation();
  const { session } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
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
      
      console.log("Profile data:", data); // Debug log
      return data;
    },
    enabled: !!session?.user,
  });

  // Check if the user is the specified admin
  const isSpecificAdmin = profile?.email === "hi@stevenboffa.com";
  const isAdmin = profile?.is_admin === true;

  // Debug logs to help diagnose the issue
  console.log("Session:", !!session);
  console.log("Is loading:", isLoading);
  console.log("Is admin:", isAdmin);
  console.log("Current path:", location.pathname);

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

          {isAdmin && (
            <div className="flex gap-4">
              {/* Admin Posts link */}
              <Link
                to="/admin/posts"
                className={cn(
                  "flex flex-col items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors",
                  location.pathname.includes("/admin/posts") && "text-primary"
                )}
              >
                <FileTextIcon className="h-6 w-6" />
                <span>Posts</span>
              </Link>
              
              {/* Admin Email Campaigns link */}
              <Link
                to="/admin/email-campaigns"
                className={cn(
                  "flex flex-col items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors",
                  location.pathname.includes("/admin/email-campaigns") && "text-primary"
                )}
              >
                <MailIcon className="h-6 w-6" />
                <span>Emails</span>
              </Link>
            </div>
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
