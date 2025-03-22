
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogCard } from "@/components/blog/BlogCard";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Meta } from "@/components/Meta";

export default function Blog() {
  const { session } = useAuth();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          author:profiles(email)
        `)
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false });

      if (error) throw error;
      
      // Update the cover image for the specific blog post
      if (data) {
        data.forEach(post => {
          if (post.slug === "how-to-remember-what-you-read") {
            post.cover_image = "/lovable-uploads/ecf22006-7ce7-41c9-b066-575d2740e43d.png";
          }
        });
      }
      
      return data;
    },
  });

  return (
    <>
      <Meta customTitle="Welcome to our Blog | BookishNotes.com" />
      
      {!session && <Header />}
      
      <div className={`min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/10 dark:to-background ${!session ? 'pt-24' : 'pt-8'}`}>
        <div className="container max-w-6xl mx-auto px-4 pb-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              BookishNotes Blog
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover insights about books, reading habits, and personal growth
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-[400px] rounded-xl bg-card border shadow-sm animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts?.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
