
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileTextIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { session } = useAuth();

  // Check if user is admin
  const { data: adminCheck, isLoading: isLoadingAdmin, error } = useQuery({
    queryKey: ["admin-check-dashboard"],
    queryFn: async () => {
      if (!session?.user) {
        console.log("No session found for admin check");
        return null;
      }
      
      console.log("Checking admin status for user:", session.user.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin, email")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error checking admin status:", error);
        return null;
      }
      
      console.log("Admin check result:", data);
      return data;
    },
    enabled: !!session?.user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 5,
    retryDelay: (attempt) => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000),
  });

  // Handle non-admin access
  useEffect(() => {
    if (!isLoadingAdmin && !adminCheck?.is_admin) {
      toast.error("You don't have access to this page");
      navigate("/dashboard");
    }
  }, [adminCheck, isLoadingAdmin, navigate]);

  // Handle error if needed
  useEffect(() => {
    if (error) {
      toast.error("Error checking admin status. Please try again later.");
      console.error("Admin check query error:", error);
    }
  }, [error]);

  // Loading state
  if (isLoadingAdmin) {
    return (
      <div className="container mx-auto p-4 animate-pulse">
        <div className="h-8 w-1/4 bg-muted rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  // If not admin, don't render anything (redirect will happen via useEffect)
  if (!adminCheck?.is_admin) {
    return null;
  }

  const adminTools = [
    {
      title: "Blog Posts",
      description: "Create, edit, and manage blog posts.",
      icon: <FileTextIcon className="h-10 w-10 text-primary" />,
      path: "/admin/posts"
    },
    {
      title: "Email Campaigns",
      description: "Manage email templates and scheduled emails.",
      icon: <MailIcon className="h-10 w-10 text-primary" />,
      path: "/admin/email-campaigns"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminTools.map((tool) => (
          <Card key={tool.title} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{tool.title}</CardTitle>
                {tool.icon}
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="h-24">
              {/* Additional context or stats could go here */}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate(tool.path)}
              >
                Manage {tool.title}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
