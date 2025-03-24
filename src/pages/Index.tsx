
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  useEffect(() => {
    console.log("Index route - Session state:", !!session, "Loading:", loading);
    
    // Immediately redirect based on session state, no need for timeout
    if (!loading) {
      if (session) {
        console.log("Index route - Redirecting to /dashboard");
        navigate("/dashboard", { replace: true });
      } else {
        console.log("Index route - Redirecting to /auth/sign-in");
        navigate("/auth/sign-in", { replace: true });
      }
    }
  }, [session, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-book-DEFAULT"></div>
      </div>
    );
  }

  // Return a simple message for the preview
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Loading application...</p>
    </div>
  );
};

export default Index;
