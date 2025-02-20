
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { AuthProvider } from "@/contexts/AuthContext";
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
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

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
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {/* Routes that should show navigation */}
            <Route element={<AuthenticatedLayout><Outlet /></AuthenticatedLayout>}>
              <Route path="/" element={<Welcome />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/buy-books" element={<BuyBooks />} />
              <Route path="/book/:id" element={<GoogleBookDetail />} />
              <Route path="/add-book" element={<AddBook />} />
              <Route path="/edit-book/:id" element={<AddBook />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/admin/posts" element={<BlogPosts />} />
              <Route path="/admin/posts/:id" element={<EditBlogPost />} />
            </Route>
            
            {/* Routes that should not show navigation */}
            <Route element={<AuthenticatedLayout hideNav><Outlet /></AuthenticatedLayout>}>
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
