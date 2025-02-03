import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-gray-50 pb-[80px]">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/buy-books" element={<BuyBooks />} />
              <Route path="/book/:id" element={<GoogleBookDetail />} />
              <Route path="/add-book" element={<AddBook />} />
              <Route path="/edit-book/:id" element={<AddBook />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Navigation />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;