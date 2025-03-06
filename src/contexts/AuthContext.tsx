
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

  // Function to migrate collections from localStorage to Supabase
  const migrateCollectionsToSupabase = async (userId: string) => {
    try {
      // Check if already migrated
      // @ts-ignore - Ignore TypeScript error for collections table until types are updated
      const { data: existingCollections } = await supabase
        .from('collections')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
      
      // If user already has collections in Supabase, don't migrate
      if (existingCollections && existingCollections.length > 0) {
        return;
      }
      
      // Get collections from localStorage
      const savedCollections = localStorage.getItem('bookish_collections');
      if (!savedCollections) {
        return;
      }
      
      const collections = JSON.parse(savedCollections);
      if (!Array.isArray(collections) || collections.length === 0) {
        return;
      }
      
      // Prepare collections for Supabase
      const collectionsToInsert = collections.map((collection, index) => ({
        id: collection.id,
        name: collection.name,
        user_id: userId,
        position: index,
        created_at: collection.createdAt || new Date().toISOString()
      }));
      
      // Insert into Supabase
      // @ts-ignore - Ignore TypeScript error for collections table until types are updated
      const { error } = await supabase
        .from('collections')
        .insert(collectionsToInsert);
      
      if (error) {
        console.error('Error migrating collections to Supabase:', error);
        return;
      }
      
      console.log('Collections migrated from localStorage to Supabase');
      
      // Clear localStorage collections after successful migration
      localStorage.removeItem('bookish_collections');
    } catch (error) {
      console.error('Error in migrateCollectionsToSupabase:', error);
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
        return;
      }

      if (data.session) {
        console.log("Found existing session");
        setSession(data.session);
        
        // Migrate collections if needed
        await migrateCollectionsToSupabase(data.session.user.id);
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
        
        // For new sign-ins, migrate collections
        if (event === 'SIGNED_IN') {
          await migrateCollectionsToSupabase(currentSession.user.id);
        }
      } else {
        setSession(null);
      }
      
      setLoading(false);

      // Show appropriate toasts
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
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
