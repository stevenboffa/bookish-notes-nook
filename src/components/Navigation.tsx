import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Navigation() {
  const location = useLocation();

  const links = [
    { href: "/", label: "Welcome" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/favorites", label: "Favorites" },
  ];

  return (
    <nav className="bg-book-DEFAULT p-4">
      <div className="container mx-auto">
        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-white hover:text-book-light transition-colors font-medium",
                location.pathname === link.href && "text-book-light font-bold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}