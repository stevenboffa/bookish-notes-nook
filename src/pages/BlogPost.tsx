import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Helmet } from "react-helmet";
import NotFound from "./NotFound";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogFooter } from "@/components/blog/BlogFooter";
import { SignUpWidget } from "@/components/blog/SignUpWidget";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";

export default function BlogPost() {
  const { slug } = useParams();
  const { session } = useAuth();
  const isMobile = useIsMobile();

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
        <title>{post.title} - BookishNotes Blog</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        {post.meta_keywords?.length > 0 && (
          <meta name="keywords" content={post.meta_keywords.join(", ")} />
        )}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
      </Helmet>

      <article className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/10 dark:to-background">
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
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-2/3">
                {post.excerpt && (
                  <div className="mb-12">
                    <p className="text-xl text-muted-foreground leading-relaxed font-serif italic border-l-4 border-primary pl-4 py-2">
                      {post.excerpt}
                    </p>
                  </div>
                )}

                <div 
                  className="prose prose-lg max-w-none dark:prose-invert
                    prose-headings:font-bold prose-headings:tracking-tight
                    prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8
                    prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
                    prose-p:leading-relaxed prose-p:mb-8
                    prose-a:text-primary hover:prose-a:text-primary/80
                    prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-2 prose-blockquote:px-6
                    prose-img:rounded-lg prose-img:shadow-lg
                    prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                    prose-pre:bg-muted prose-pre:text-primary-foreground
                    prose-li:mb-2"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
              
              {!isMobile && (
                <div className="lg:w-1/3 lg:sticky lg:top-20 lg:self-start">
                  <div className="mt-8">
                    <SignUpWidget />
                  </div>
                </div>
              )}
            </div>
            
            {isMobile && (
              <div className="mt-12">
                <SignUpWidget />
              </div>
            )}
          </div>
        </main>

        <BlogFooter />
      </article>
    </>
  );
}
