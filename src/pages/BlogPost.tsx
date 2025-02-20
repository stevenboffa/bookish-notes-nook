
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Helmet } from "react-helmet";
import { NotFound } from "./NotFound";

export default function BlogPost() {
  const { slug } = useParams();

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
      <div className="container max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 w-3/4 bg-muted rounded mb-4" />
        <div className="h-4 w-1/4 bg-muted rounded mb-8" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!post) {
    return <NotFound />;
  }

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

      <article className="container max-w-4xl mx-auto px-4 py-8">
        {post.cover_image && (
          <div className="aspect-video relative overflow-hidden rounded-lg mb-8">
            <img
              src={post.cover_image}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center gap-2 text-muted-foreground mb-8">
          <span>{post.author.email}</span>
          <span>•</span>
          <time dateTime={post.published_at}>
            {format(new Date(post.published_at), "MMMM d, yyyy")}
          </time>
          <span>•</span>
          <span>{post.reading_time} min read</span>
        </div>

        {post.excerpt && (
          <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>
        )}

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </>
  );
}
