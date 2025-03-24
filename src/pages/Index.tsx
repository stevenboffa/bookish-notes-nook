
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

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
