
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Welcome from "@/pages/Welcome";
import Dashboard from "@/pages/Dashboard";
import AddBook from "@/pages/AddBook";
import Favorites from "@/pages/Favorites";
import Friends from "@/pages/Friends";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import BuyBooks from "@/pages/BuyBooks";
import { Navigation } from "@/pages/Navigation";
import NYTBookDetail from "@/pages/NYTBookDetail";
import GoogleBookDetail from "@/pages/GoogleBookDetail";

const queryClient = new QueryClient();

function AuthenticatedLayout() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route element={<AuthenticatedLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/add-book" element={<AddBook />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/friends" element={<Friends />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/buy-books" element={<BuyBooks />} />
                  <Route path="/book/:id" element={<GoogleBookDetail />} />
                  <Route path="/book/ai/:id" element={<GoogleBookDetail />} />
                  <Route path="/nyt-book/:isbn" element={<NYTBookDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              <Toaster />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
