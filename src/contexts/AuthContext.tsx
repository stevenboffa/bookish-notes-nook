
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ session: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Try to recover session from localStorage first
    const savedSession = localStorage.getItem('supabase.auth.token');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed?.currentSession) {
          setSession(parsed.currentSession);
        }
      } catch (e) {
        console.error('Error parsing saved session:', e);
      }
    }

    // Then get the current session from Supabase
    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      console.log("Initial session check:", currentSession ? "Found session" : "No session");
      if (error) {
        console.error("Error getting session:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem with your session. Please try logging in again.",
        });
      } else if (currentSession) {
        setSession(currentSession);
        // Save session to localStorage as backup
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          currentSession,
          timestamp: new Date().getTime()
        }));
      }
      setLoading(false);
    });

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession ? "Session exists" : "No session");
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log("User signed in or token refreshed");
        setSession(currentSession);
        if (currentSession) {
          localStorage.setItem('supabase.auth.token', JSON.stringify({
            currentSession,
            timestamp: new Date().getTime()
          }));
        }
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome!",
            description: "You have successfully signed in.",
          });
        }
      }
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setSession(null);
        localStorage.removeItem('supabase.auth.token');
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Refresh session periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data: { session: refreshedSession }, error } = await supabase.auth.getSession();
      if (!error && refreshedSession) {
        setSession(refreshedSession);
      }
    }, 1000 * 60 * 4); // Refresh every 4 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
