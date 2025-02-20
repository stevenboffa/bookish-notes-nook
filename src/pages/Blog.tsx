
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogCard } from "@/components/blog/BlogCard";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";

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
      return data;
    },
  });

  return (
    <>
      <Helmet>
        <title>Blog - BookNotes</title>
        <meta
          name="description"
          content="Explore our latest articles about books, reading, and personal growth."
        />
      </Helmet>
      
      {!session && <Header />}
      
      <div className={`container max-w-6xl mx-auto px-4 ${!session ? 'pt-24' : 'pt-8'} pb-8`}>
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[300px] rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts?.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
