import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Plus, User, Users, Store } from "lucide-react";

export function Navigation() {
  const { session } = useAuth();

  if (!session) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-border z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-around py-2">
        <NavLink to="/dashboard" className={({ isActive }) =>
            `flex flex-col items-center justify-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </NavLink>
        <NavLink to="/add-book" className={({ isActive }) =>
            `flex flex-col items-center justify-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <Plus className="h-5 w-5" />
          <span className="text-xs">Add Book</span>
        </NavLink>
        <NavLink to="/friends" className={({ isActive }) =>
            `flex flex-col items-center justify-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <Users className="h-5 w-5" />
          <span className="text-xs">Friends</span>
        </NavLink>
        <NavLink to="/profile" data-tour="profile" className={({ isActive }) =>
            `flex flex-col items-center justify-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </NavLink>
        <NavLink to="/buy-books" className={({ isActive }) =>
            `flex flex-col items-center justify-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }
        >
          <Store className="h-5 w-5" />
          <span className="text-xs">Buy Books</span>
        </NavLink>
      </div>
    </nav>
  );
}
