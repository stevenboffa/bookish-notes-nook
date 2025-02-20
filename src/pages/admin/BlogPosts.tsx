
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusIcon, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function BlogPosts() {
  const navigate = useNavigate();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .single();

      if (!profile?.is_admin) {
        navigate("/blog");
        toast.error("You don't have access to this page");
        return null;
      }

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
  });

  if (isLoading) {
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
                onClick={async () => {
                  if (!confirm("Are you sure you want to delete this post?")) return;
                  
                  const { error } = await supabase
                    .from("blog_posts")
                    .delete()
                    .eq("id", post.id);

                  if (error) {
                    toast.error("Failed to delete post");
                    return;
                  }

                  toast.success("Post deleted successfully");
                }}
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
