
import { createContext, useContext, useEffect, useState, useRef } from "react";
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
  const hasShownWelcomeToast = useRef(false);
  const processingAuthChange = useRef(false);

  useEffect(() => {
    // Set up initial session
    const initializeSession = async () => {
      // Get the current session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem with your session. Please try logging in again.",
        });
        return;
      }

      if (data.session) {
        console.log("Found existing session");
        setSession(data.session);
      }
      
      setLoading(false);
    };

    initializeSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      // Prevent duplicate event processing
      if (processingAuthChange.current) return;
      
      processingAuthChange.current = true;
      
      console.log("Auth state changed:", event);
      
      if (currentSession) {
        console.log("Setting new session");
        setSession(currentSession);
      } else {
        setSession(null);
      }
      
      setLoading(false);

      // Show appropriate toasts
      if (event === 'SIGNED_IN' && !hasShownWelcomeToast.current) {
        hasShownWelcomeToast.current = true;
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else if (event === 'SIGNED_OUT') {
        hasShownWelcomeToast.current = false;
        // Check if this sign out was due to account deletion
        const wasAccountDeleted = localStorage.getItem('account_deleted');
        
        if (wasAccountDeleted === 'true') {
          localStorage.removeItem('account_deleted');
          toast({
            title: "Account deleted",
            description: "Your account has been successfully deleted.",
          });
        } else {
          toast({
            title: "Signed out",
            description: "You have been signed out successfully.",
          });
        }
      }
      
      // Allow processing of the next auth event after a delay
      setTimeout(() => {
        processingAuthChange.current = false;
      }, 1000);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Set up automatic session refresh
  useEffect(() => {
    if (!session) return;

    const refreshInterval = setInterval(async () => {
      const { data: { session: refreshedSession } } = await supabase.auth.getSession();
      if (refreshedSession) {
        setSession(refreshedSession);
      }
    }, 1000 * 60 * 4); // Refresh every 4 minutes

    return () => clearInterval(refreshInterval);
  }, [session]);

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
