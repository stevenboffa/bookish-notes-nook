
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  UserCircleIcon,
  UsersIcon,
  ShoppingCartIcon,
  BookmarkIcon,
  FileTextIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function Navigation() {
  const location = useLocation();
  const { session } = useAuth();

  const { data: profile } = useQuery({
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

  // Debug log to see profile status
  console.log("Current profile:", profile);

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
            to="/buy-books"
            className={cn(
              "flex flex-col items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors",
              location.pathname === "/buy-books" && "text-primary"
            )}
          >
            <ShoppingCartIcon className="h-6 w-6" />
            <span>Buy</span>
          </Link>

          <Link
            to="/blog"
            className={cn(
              "flex flex-col items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors",
              location.pathname === "/blog" && "text-primary"
            )}
          >
            <BookmarkIcon className="h-6 w-6" />
            <span>Blog</span>
          </Link>

          {profile?.is_admin && (
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
