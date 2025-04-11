import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { sendWelcomeEmail } from "@/utils/email";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  deleteAccount: () => Promise<{ success: boolean; error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  loading: true,
  deleteAccount: async () => ({ success: false, error: 'AuthContext not initialized' }),
  signOut: async () => { console.error('AuthContext not initialized'); }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const hasShownWelcomeToast = useRef(false);
  const lastAuthEvent = useRef<string | null>(null);
  const lastEventTime = useRef<number>(0);
  const signOutToastShown = useRef(false);
  const signedOutTimestamp = useRef<number>(0);

  useEffect(() => {
    // Set up initial session
    const initializeSession = async () => {
      try {
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
      } catch (e) {
        console.error("Exception during session initialization:", e);
        setLoading(false);
      }
    };

    initializeSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, currentSession) => {
      console.log("Auth state changed:", event, !!currentSession);

      // Prevent duplicate events within 2 seconds and identical consecutive events
      const now = Date.now();
      if (
        (now - lastEventTime.current < 2000 && lastAuthEvent.current === event) ||
        (event === 'TOKEN_REFRESHED' && lastAuthEvent.current === 'SIGNED_IN')
      ) {
        console.log("Skipping duplicate auth event:", event);
        return;
      }

      lastAuthEvent.current = event;
      lastEventTime.current = now;
      
      if (currentSession) {
        console.log("Setting new session");
        setSession(currentSession);

        // Check if this is a new user (INITIAL_SESSION event or first SIGNED_IN for OAuth)
        if (event === 'INITIAL_SESSION' || (event === 'SIGNED_IN' && !hasShownWelcomeToast.current)) {
          const email = currentSession.user.email;
          const username = email?.split('@')[0] || 'there';

          // For OAuth users, we want to send the welcome email on their first sign in
          if (event === 'SIGNED_IN' && currentSession.user.app_metadata.provider === 'google') {
            try {
              await sendWelcomeEmail(email!, username);
            } catch (error) {
              console.error('Error sending welcome email to OAuth user:', error);
            }
          }

          hasShownWelcomeToast.current = true;
          toast({
            title: "Welcome to Bookish Notes!",
            description: "Your account has been created successfully.",
          });
        } else if (event === 'SIGNED_IN' && hasShownWelcomeToast.current) {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
        }
      } else {
        console.log("Clearing session");
        setSession(null);
      }
      
      setLoading(false);

      if (event === 'SIGNED_OUT') {
        hasShownWelcomeToast.current = false;
        
        // Only show the sign-out toast if we haven't shown it recently
        const now = Date.now();
        if (!signOutToastShown.current || (now - signedOutTimestamp.current > 5000)) {
          signOutToastShown.current = true;
          signedOutTimestamp.current = now;
          
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
          
          // Reset the flag after a delay
          setTimeout(() => {
            signOutToastShown.current = false;
          }, 5000);
        } else {
          console.log("Skipping duplicate sign-out toast");
        }
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Modified sign out function to go straight to homepage
  const signOut = async () => {
    try {
      console.log("AuthContext: Initiating complete sign out");
      
      // Set a flag to prevent the temporary redirect to login
      sessionStorage.setItem('direct_to_homepage', 'true');
      
      // 1. First clear all stored state
      setSession(null);
      hasShownWelcomeToast.current = false;
      
      // 2. Clear all authentication data from browser storage
      // Clear localStorage
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-cotmtwabbkxrvbjygnwk-auth-token');
      
      // Clear sessionStorage
      sessionStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('sb-cotmtwabbkxrvbjygnwk-auth-token');
      
      // Clear any cookies by setting expired date
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // 3. Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut({
        scope: 'global' // Sign out from all devices
      });
      
      if (error) {
        console.error("Error during sign out from Supabase API:", error);
        console.log("Continuing with local session cleanup despite API error");
      }
      
      console.log("AuthContext: Successfully signed out locally");
      
      // 4. Force navigation directly to the homepage
      if (typeof window !== 'undefined') {
        console.log("Directly navigating to homepage to complete sign out");
        window.location.href = '/';
      }
      
    } catch (error) {
      console.error("Exception during sign out:", error);
      
      // Even with an exception, force session clear and redirect
      if (typeof window !== 'undefined') {
        console.log("Error occurred during sign out, forcing redirect anyway");
        window.location.href = '/';
      }
    }
  };

  // Account deletion function
  const deleteAccount = async () => {
    try {
      // Call our delete_user() function we created in SQL
      const { error: functionError } = await supabase.rpc('delete_user');
      
      if (functionError) {
        console.error("Error deleting user:", functionError);
        return { 
          success: false, 
          error: functionError.message || "Failed to delete account" 
        };
      }
      
      // Mark account as deleted in localStorage so we can show the right toast
      localStorage.setItem('account_deleted', 'true');
      
      // Sign out the user after account deletion
      await signOut();
      
      return { success: true, error: null };
    } catch (error) {
      console.error("Error in deleteAccount:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unknown error occurred" 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, deleteAccount, signOut }}>
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
