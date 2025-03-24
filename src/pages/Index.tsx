
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Handle environment switching via URL parameter
  useEffect(() => {
    const envParam = searchParams.get('env');
    if (envParam) {
      const preferredEnv = envParam === 'production' ? 'false' : 'true';
      localStorage.setItem('preferredEnvironment', envParam);
      
      // Only reload if the environment setting doesn't match the current one
      if (import.meta.env.VITE_USE_STAGING !== preferredEnv) {
        window.location.reload();
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading) {
      if (session) {
        navigate("/dashboard");
      } else {
        navigate("/welcome");
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

  return null; // This won't be rendered as we'll redirect
};

export default Index;
