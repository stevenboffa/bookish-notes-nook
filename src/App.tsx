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
import EmailCampaigns from "./pages/admin/EmailCampaigns";
import AdminDashboard from "./pages/admin/Dashboard";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (changed from cacheTime)
    },
  },
});

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
  
  if (profile?.email !== "hi@stevenboffa.com") {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

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

const AuthenticatedLayout = ({ children, hideNav = false }: { children: React.ReactNode, hideNav?: boolean }) => {
  const { session } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {children}
      {session && !hideNav && <Navigation />}
    </div>
  );
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();
  
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["admin-profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
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
  
  if (!profile?.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <HelmetProvider>
        <AuthProvider>
          <TooltipProvider>
            <Routes>
              <Route element={<AuthenticatedLayout><Outlet /></AuthenticatedLayout>}>
                <Route path="/" element={<Welcome />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
              </Route>

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
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="/admin/posts" element={
                  <AdminRoute>
                    <BlogPosts />
                  </AdminRoute>
                } />
                <Route path="/admin/posts/:id" element={
                  <AdminRoute>
                    <EditBlogPost />
                  </AdminRoute>
                } />
                <Route path="/admin/email-campaigns" element={
                  <AdminRoute>
                    <EmailCampaigns />
                  </AdminRoute>
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
