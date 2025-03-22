
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
      
      // For the specific blog post, replace the image with our new one
      if (data && data.slug === "how-to-remember-what-you-read") {
        data.cover_image = "/lovable-uploads/ecf22006-7ce7-41c9-b066-575d2740e43d.png";
        data.cover_image_alt = "Person reading a book in golden sunlight with a coffee, stack of books, and smartphone on a rustic wooden table";
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

  // Extract headings from content for table of contents
  const extractHeadings = (content) => {
    const regex = /<h2[^>]*>(.*?)<\/h2>/g;
    const headings = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      headings.push({
        text: match[1].replace(/<[^>]*>/g, ''),
        id: match[1].replace(/<[^>]*>/g, '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      });
    }
    
    return headings;
  };
  
  const headings = extractHeadings(post.content);
  
  // Function to add IDs to headings in content
  const addIdsToHeadings = (content) => {
    return content.replace(
      /<h2[^>]*>(.*?)<\/h2>/g, 
      (match, group) => {
        const id = group.replace(/<[^>]*>/g, '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return `<h2 id="${id}" class="scroll-mt-20">${group}</h2>`;
      }
    );
  };
  
  const contentWithIds = addIdsToHeadings(post.content);

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
                
                {headings.length > 0 && (
                  <div className="mb-12 p-6 bg-indigo-50 dark:bg-indigo-950/10 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
                    <ul className="space-y-2">
                      {headings.map((heading, idx) => (
                        <li key={idx}>
                          <a 
                            href={`#${heading.id}`}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-2"
                          >
                            <span className="inline-block w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-800/50 text-center text-sm leading-6">
                              {idx + 1}
                            </span>
                            <span>{heading.text}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
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
                  dangerouslySetInnerHTML={{ __html: contentWithIds }}
                />
                
                <div className="mt-16 p-6 bg-purple-50 dark:bg-purple-950/10 rounded-xl">
                  <h3 className="text-2xl font-bold mb-4">Start Tracking Your Reading Journey Today</h3>
                  <p className="text-muted-foreground mb-6">Sign up for BookishNotes to keep track of your books, take smart notes, and remember more of what you read.</p>
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href="/auth/sign-up" 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Sign Up Free
                    </a>
                    <a 
                      href="/resources" 
                      className="bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Explore Resources
                    </a>
                  </div>
                </div>
              </div>
              
              {!isMobile && (
                <div className="lg:w-1/3 lg:sticky lg:top-20 lg:self-start">
                  <div className="mt-8">
                    <SignUpWidget />
                    
                    <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/20 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4">Related Resources</h3>
                      <ul className="space-y-4">
                        <li>
                          <a 
                            href="/resources/note-taking" 
                            className="text-indigo-600 dark:text-indigo-400 hover:underline flex gap-2 items-start"
                          >
                            <span className="bg-indigo-100 dark:bg-indigo-800/50 p-2 rounded-full text-indigo-600 dark:text-indigo-300">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                            </span>
                            <span>Guide to Insightful Note Taking</span>
                          </a>
                        </li>
                        <li>
                          <a 
                            href="/resources/reading-streaks" 
                            className="text-indigo-600 dark:text-indigo-400 hover:underline flex gap-2 items-start"
                          >
                            <span className="bg-indigo-100 dark:bg-indigo-800/50 p-2 rounded-full text-indigo-600 dark:text-indigo-300">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flame"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                            </span>
                            <span>Daily Reading Streaks</span>
                          </a>
                        </li>
                        <li>
                          <a 
                            href="/resources/collections" 
                            className="text-indigo-600 dark:text-indigo-400 hover:underline flex gap-2 items-start"
                          >
                            <span className="bg-indigo-100 dark:bg-indigo-800/50 p-2 rounded-full text-indigo-600 dark:text-indigo-300">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-plus"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><line x1="12" x2="12" y1="10" y2="16"/><line x1="9" x2="15" y1="13" y2="13"/></svg>
                            </span>
                            <span>Creating Collections</span>
                          </a>
                        </li>
                      </ul>
                    </div>
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
