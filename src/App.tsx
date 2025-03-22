
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { Navigation } from "@/pages/Navigation";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { ScrollToTop } from "@/components/ScrollToTop";
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
import Resources from "./pages/Resources";
import CreateAccount from "./pages/resources/CreateAccount";
import AddBooks from "./pages/resources/AddBooks";
import EditBookDetails from "./pages/resources/EditBookDetails";
import NoteTaking from "./pages/resources/NoteTaking";
import ReadingStreaks from "./pages/resources/ReadingStreaks";
import AddReviewScore from "./pages/resources/AddReviewScore";
import Collections from "./pages/resources/Collections";
import ConnectFriends from "./pages/resources/ConnectFriends";
import AccountSettings from "./pages/resources/AccountSettings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return null;
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
    return null;
  }
  
  if (!session) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }
  
  if (profile?.email !== "hi@stevenboffa.com") {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return null;
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HelmetProvider>
        <TooltipProvider>
          <BrowserRouter>
            <ScrollToTop />
            <GoogleAnalytics />
            <Routes>
              <Route element={<AuthenticatedLayout><Outlet /></AuthenticatedLayout>}>
                <Route path="/" element={
                  <PublicRoute>
                    <Welcome />
                  </PublicRoute>
                } />
                <Route path="/auth/sign-in" element={
                  <PublicRoute>
                    <SignIn />
                  </PublicRoute>
                } />
                <Route path="/auth/sign-up" element={
                  <PublicRoute>
                    <SignUp />
                  </PublicRoute>
                } />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/resources/create-account" element={<CreateAccount />} />
                <Route path="/resources/add-books" element={<AddBooks />} />
                <Route path="/resources/edit-book-details" element={<EditBookDetails />} />
                <Route path="/resources/note-taking" element={<NoteTaking />} />
                <Route path="/resources/reading-streaks" element={<ReadingStreaks />} />
                <Route path="/resources/add-review-score" element={<AddReviewScore />} />
                <Route path="/resources/collections" element={<Collections />} />
                <Route path="/resources/connect-friends" element={<ConnectFriends />} />
                <Route path="/resources/account-settings" element={<AccountSettings />} />
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
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
