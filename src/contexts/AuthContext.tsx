
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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      console.log("Initial session check:", initialSession ? "Found session" : "No session");
      if (error) {
        console.error("Error getting session:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem with your session. Please try logging in again.",
        });
      }
      setSession(initialSession);
      setLoading(false);
    });

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession ? "Session exists" : "No session");
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in successfully");
        setSession(currentSession);
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
      }
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setSession(null);
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
        setSession(currentSession);
      }

      setLoading(false);
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

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
