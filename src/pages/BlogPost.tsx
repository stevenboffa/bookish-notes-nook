
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Helmet } from "react-helmet";
import NotFound from "./NotFound";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogFooter } from "@/components/blog/BlogFooter";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";

export default function BlogPost() {
  const { slug } = useParams();
  const { session } = useAuth();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          author:profiles(email)
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        {!session && <Header />}
        <div className={`h-[60vh] bg-muted ${!session ? 'mt-16' : ''}`} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="h-8 w-3/4 bg-muted rounded mb-4" />
          <div className="h-4 w-1/4 bg-muted rounded mb-8" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return <NotFound />;
  }

  const formattedDate = format(new Date(post.published_at), "MMMM d, yyyy");

  return (
    <>
      <Helmet>
        <title>{post.title} - BookNotes Blog</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        {post.meta_keywords?.length > 0 && (
          <meta name="keywords" content={post.meta_keywords.join(", ")} />
        )}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
      </Helmet>

      <article className="min-h-screen flex flex-col">
        {!session && <Header />}
        
        <BlogHeader
          title={post.title}
          author={post.author.email}
          date={formattedDate}
          readingTime={post.reading_time}
          coverImage={post.cover_image}
          className={!session ? 'mt-16' : ''}
        />

        <main className="flex-1 py-12 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div 
              className="prose prose-lg max-w-none dark:prose-invert
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-3xl prose-h3:text-2xl
                prose-p:leading-relaxed
                prose-a:text-primary hover:prose-a:text-primary/80
                prose-blockquote:border-l-primary
                prose-img:rounded-lg prose-img:shadow-lg
                prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-muted prose-pre:text-primary-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </main>

        <BlogFooter />
      </article>
    </>
  );
}
