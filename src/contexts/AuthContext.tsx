
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  loading: true,
  signOut: async () => {} 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Sign out function that will be exposed through context
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        toast({
          variant: "destructive",
          title: "Sign out error",
          description: error.message,
        });
        return;
      }
      
      // Force navigation to sign-in page
      navigate("/auth/sign-in");
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      toast({
        variant: "destructive",
        title: "Sign out error",
        description: "An unexpected error occurred during sign out.",
      });
    } finally {
      setLoading(false);
    }
  };

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
        setLoading(false);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event);
      
      if (currentSession) {
        console.log("Setting new session");
        setSession(currentSession);
        
        // Send welcome email on sign up or first sign in
        if (event === 'SIGNED_IN' && !session) {
          try {
            // Check if this is a new user
            const isNewUser = !session; // If there was no previous session, treat as new user
            
            if (isNewUser) {
              await supabase.functions.invoke("send-welcome-email", {
                body: { 
                  email: currentSession.user.email,
                  name: currentSession.user.email?.split('@')[0] // Use part of the email as the name
                }
              });
            }
          } catch (error) {
            console.error("Error sending welcome email:", error);
            // Don't throw here as this is not critical to the auth flow
          }
        }
      } else {
        setSession(null);
        // Redirect to sign-in page if not already there
        if (!location.pathname.includes('/auth/')) {
          navigate("/auth/sign-in");
        }
      }
      
      setLoading(false);

      // Show appropriate toasts
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        
        // Navigate to dashboard after sign in
        if (location.pathname.includes('/auth/')) {
          navigate("/dashboard");
        }
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [toast, session, navigate, location]);

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
    <AuthContext.Provider value={{ session, loading, signOut }}>
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
