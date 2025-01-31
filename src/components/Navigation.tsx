import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function Navigation() {
  const location = useLocation();
  const { session } = useAuth();

  const links = session ? [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/favorites", label: "Favorites" },
  ] : [
    { href: "/", label: "Welcome" },
  ];

  return (
    <nav className="bg-book-DEFAULT p-4">
      <div className="container mx-auto">
        <div className="flex gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
            >
              <Button
                variant={location.pathname === link.href ? "secondary" : "outline"}
                className={cn(
                  "bg-white hover:bg-book-light transition-colors",
                  location.pathname === link.href && "bg-book-light font-bold"
                )}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}