
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusIcon, Pencil, Trash2, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";

export default function BlogPosts() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const isMobile = useIsMobile();

  // First, check if user is admin
  const { data: adminCheck, isLoading: isLoadingAdmin } = useQuery({
    queryKey: ["admin-check"],
    queryFn: async () => {
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error checking admin status:", error);
        return null;
      }

      return data;
    },
    enabled: !!session?.user,
  });

  // Fetch posts only if user is admin
  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          author:profiles(email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!adminCheck?.is_admin,
  });

  // Handle non-admin access
  useEffect(() => {
    if (!isLoadingAdmin && !adminCheck?.is_admin) {
      toast.error("You don't have access to this page");
      navigate("/blog");
    }
  }, [adminCheck, isLoadingAdmin, navigate]);

  // Loading state - responsive skeleton
  if (isLoadingAdmin || isLoadingPosts) {
    return (
      <div className="container max-w-6xl mx-auto p-4 animate-pulse">
        <div className="h-8 w-1/4 bg-muted rounded mb-8" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  // If not admin, don't render anything (redirect will happen via useEffect)
  if (!adminCheck?.is_admin) {
    return null;
  }

  // Function to handle post deletion
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", postId);

    if (error) {
      toast.error("Failed to delete post");
      return;
    }

    toast.success("Post deleted successfully");
  };

  // Mobile view
  if (isMobile) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <Button size="sm" onClick={() => navigate("/admin/posts/new")}>
            <PlusIcon className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>

        <div className="space-y-4">
          {posts?.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold truncate">{post.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      post.status === "published" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {post.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.published_at 
                        ? format(new Date(post.published_at), "MMM d, yyyy")
                        : "Not published"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                  <span className="text-xs text-muted-foreground truncate max-w-[50%]">
                    {post.author.email}
                  </span>
                  <div className="flex gap-1">
                    {post.status === "published" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => navigate(`/admin/posts/${post.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div className="container max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Button onClick={() => navigate("/admin/posts/new")}>
          <PlusIcon className="mr-2" />
          New Post
        </Button>
      </div>

      <div className="bg-card rounded-lg shadow">
        <div className="grid grid-cols-12 gap-4 p-4 font-semibold border-b">
          <div className="col-span-4">Title</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Author</div>
          <div className="col-span-2">Published</div>
          <div className="col-span-2">Actions</div>
        </div>

        {posts?.map((post) => (
          <div key={post.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-accent/5">
            <div className="col-span-4 truncate">{post.title}</div>
            <div className="col-span-2">
              <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                post.status === "published" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {post.status}
              </span>
            </div>
            <div className="col-span-2 truncate">{post.author.email}</div>
            <div className="col-span-2">
              {post.published_at 
                ? format(new Date(post.published_at), "MMM d, yyyy")
                : "—"}
            </div>
            <div className="col-span-2 flex gap-2">
              {post.status === "published" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/admin/posts/${post.id}`)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => handleDeletePost(post.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
