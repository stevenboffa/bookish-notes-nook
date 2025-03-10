
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AddBook from "./pages/AddBook";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import BuyBooks from "./pages/BuyBooks";
import GoogleBookDetail from "./pages/GoogleBookDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogPosts from "./pages/admin/BlogPosts";
import EditBlogPost from "./pages/admin/EditBlogPost";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

// Create a protected route component that handles loading state and authenticated redirects
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!session) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }
  
  return children;
};

// Create a special admin route for Buy Books page
const BuyBooksRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();
  
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user,
  });
  
  if (loading || profileLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!session) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }
  
  // Only allow a specific admin user to access the BuyBooks page
  if (profile?.email !== "hi@stevenboffa.com") {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Create a public route component that redirects authenticated users to dashboard
const PublicAuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Create a layout component that only shows Navigation for authenticated routes
const AuthenticatedLayout = ({ children, hideNav = false }: { children: React.ReactNode, hideNav?: boolean }) => {
  const { session } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {children}
      {session && !hideNav && <Navigation />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <HelmetProvider>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              {/* Public routes that don't require authentication */}
              <Route element={<AuthenticatedLayout><Outlet /></AuthenticatedLayout>}>
                <Route path="/" element={<Welcome />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
              </Route>

              {/* Auth routes - redirect to dashboard if already authenticated */}
              <Route element={<AuthenticatedLayout><Outlet /></AuthenticatedLayout>}>
                <Route path="/auth/sign-in" element={
                  <PublicAuthRoute>
                    <SignIn />
                  </PublicAuthRoute>
                } />
                <Route path="/auth/sign-up" element={
                  <PublicAuthRoute>
                    <SignUp />
                  </PublicAuthRoute>
                } />
              </Route>

              {/* Protected routes - require authentication */}
              <Route element={<AuthenticatedLayout><Outlet /></AuthenticatedLayout>}>
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/buy-books" element={
                  <BuyBooksRoute>
                    <BuyBooks />
                  </BuyBooksRoute>
                } />
                <Route path="/book/:id" element={
                  <BuyBooksRoute>
                    <GoogleBookDetail />
                  </BuyBooksRoute>
                } />
                <Route path="/add-book" element={
                  <ProtectedRoute>
                    <AddBook />
                  </ProtectedRoute>
                } />
                <Route path="/edit-book/:id" element={
                  <ProtectedRoute>
                    <AddBook />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/friends" element={
                  <ProtectedRoute>
                    <Friends />
                  </ProtectedRoute>
                } />
                <Route path="/admin/posts" element={
                  <ProtectedRoute>
                    <BlogPosts />
                  </ProtectedRoute>
                } />
                <Route path="/admin/posts/:id" element={
                  <ProtectedRoute>
                    <EditBlogPost />
                  </ProtectedRoute>
                } />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </HelmetProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
