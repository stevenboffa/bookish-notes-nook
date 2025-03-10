
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      console.log("Manually refreshing session...");
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error refreshing session:", error);
        return;
      }
      
      if (data.session) {
        console.log("Session refreshed successfully");
        setSession(data.session);
      } else {
        console.log("No session found during refresh");
        // If no session found during explicit refresh, we might need to redirect
        if (location.pathname !== '/' && 
            !location.pathname.includes('/auth/') &&
            !location.pathname.includes('/blog') &&
            !location.pathname.includes('/contact') &&
            !location.pathname.includes('/faq') &&
            !location.pathname.includes('/terms') &&
            !location.pathname.includes('/privacy')) {
          navigate("/auth/sign-in");
        }
      }
    } catch (error) {
      console.error("Unexpected error during session refresh:", error);
    }
  };

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
      
      setSession(null);
      
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
      try {
        console.log("Initializing session...");
        setLoading(true);
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
          console.log("Found existing session during initialization");
          setSession(data.session);
        } else {
          console.log("No session found during initialization");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Unexpected error initializing session:", error);
        setLoading(false);
      }
    };

    initializeSession();

    // Subscribe to auth changes with improved error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event);
      
      if (currentSession) {
        console.log("Setting new session from auth state change");
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
        
        // Show signin toast
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome!",
            description: "You have successfully signed in.",
          });
          
          // Navigate to dashboard after sign in if on auth page
          if (location.pathname.includes('/auth/')) {
            navigate("/dashboard");
          }
        }
      } else {
        console.log("No session in auth state change, setting to null");
        setSession(null);
        
        // Only redirect to sign-in page if trying to access protected routes
        const isProtectedRoute = !location.pathname.includes('/auth/') && 
                                location.pathname !== '/' &&
                                !location.pathname.includes('/blog') &&
                                !location.pathname.includes('/contact') &&
                                !location.pathname.includes('/faq') &&
                                !location.pathname.includes('/terms') &&
                                !location.pathname.includes('/privacy');
                                
        if (isProtectedRoute && event === 'SIGNED_OUT') {
          navigate("/auth/sign-in");
        }
        
        // Show signout toast
        if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out successfully.",
          });
        }
      }
      
      setLoading(false);
    });

    // Set up more aggressive session refresh interval
    const refreshInterval = setInterval(refreshSession, 1000 * 60 * 2); // Refresh every 2 minutes
    
    // Set up activity monitoring to refresh session
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    let activityTimeout: ReturnType<typeof setTimeout>;
    
    const handleUserActivity = () => {
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(refreshSession, 1000 * 10); // Refresh session 10 seconds after activity
    };
    
    // Add activity listeners
    activityEvents.forEach(eventName => {
      window.addEventListener(eventName, handleUserActivity);
    });

    // Cleanup event listeners, interval and subscription
    return () => {
      subscription.unsubscribe();
      clearInterval(refreshInterval);
      clearTimeout(activityTimeout);
      activityEvents.forEach(eventName => {
        window.removeEventListener(eventName, handleUserActivity);
      });
    };
  }, [toast, navigate, location, session]);

  // Add visibility change listener to refresh session when tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Tab became visible, refreshing session");
        refreshSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, signOut, refreshSession }}>
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
