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
      
      if (data && data.slug === "how-to-remember-what-you-read") {
        data.cover_image = "/lovable-uploads/ecf22006-7ce7-41c9-b066-575d2740e43d.png";
        data.cover_image_alt = "Person reading a book in golden sunlight with a coffee, stack of books, and smartphone on a rustic wooden table";
        
        data.title = "How to Remember What You Read: Effective Strategies for Better Retention";
        data.meta_description = "Discover proven techniques on how to remember what you read, improve reading retention, and understand why we forget information from books. Learn effective strategies to retain more information when reading.";
        data.meta_keywords = [
          "how to remember what you read", 
          "how to retain what you read", 
          "why can't i retain what i read", 
          "how to retain more information when reading",
          "how to remember more of what you read",
          "how to remember what you read in a book",
          "reading retention",
          "active reading",
          "note-taking strategies"
        ];
        
        if (data.content) {
          data.content = data.content.replace(
            /<img[^>]*src="[^"]*"[^>]*alt="[^"]*"[^>]*>/,
            `<img src="/lovable-uploads/ecf22006-7ce7-41c9-b066-575d2740e43d.png" alt="Person reading a book in golden sunlight with a coffee, stack of books, and smartphone on a rustic wooden table" class="rounded-lg shadow-md my-8 w-full">`
          );
          
          data.content = data.content.replace(
            /<p>Have you ever finished a book and struggled to recall[^<]*<\/p>/,
            `<p>Have you ever finished a book and struggled to recall what you read? Learning <strong>how to remember what you read</strong> is a common challenge many readers face. This guide offers practical solutions to help you retain and apply knowledge from books more effectively.</p>`
          );
          
          data.content = data.content.replace(
            /<h2>Why we forget what we read<\/h2>/,
            `<h2>Why we forget what we read</h2>
            <p>Many readers wonder, "<strong>why can't I retain what I read</strong>?" This frustration is common and has several scientific explanations. Understanding these factors is the first step to improving your retention.</p>`
          );
          
          data.content = data.content.replace(
            /<p>The Forgetting Curve - German psychologist Hermann Ebbinghaus discovered[^<]*<\/p>/,
            `<div class="p-4 my-6 bg-purple-50 dark:bg-purple-950/10 rounded-lg"><p class="mb-4"><strong>The Forgetting Curve</strong> - German psychologist Hermann Ebbinghaus discovered that without active recall, we forget approximately 70% of what we learn within 24 hours. This explains why it's hard to <strong>remember what you read in a book</strong> even just days later.</p></div>`
          );
          
          data.content = data.content.replace(
            /<p>Passive Reading - Simply passing your eyes over text[^<]*<\/p>/,
            `<div class="p-4 my-6 bg-purple-50 dark:bg-purple-950/10 rounded-lg"><p class="mb-4"><strong>Passive Reading</strong> - Simply passing your eyes over text without active engagement results in minimal retention. To <strong>remember more of what you read</strong>, you need to engage actively with the material.</p></div>`
          );
          
          data.content = data.content.replace(
            /<p>Information Overload - Our brains are constantly[^<]*<\/p>/,
            `<div class="p-4 my-6 bg-purple-50 dark:bg-purple-950/10 rounded-lg"><p class="mb-4"><strong>Information Overload</strong> - Our brains are constantly bombarded with information, making it difficult to prioritize and store new knowledge. Learning <strong>how to retain more information when reading</strong> requires strategies to manage this overload.</p></div>`
          );
          
          data.content = data.content.replace(
            /<p>Lack of Connection - Information that isn't[^<]*<\/p>/,
            `<div class="p-4 my-6 bg-purple-50 dark:bg-purple-950/10 rounded-lg"><p class="mb-4"><strong>Lack of Connection</strong> - Information that isn't connected to existing knowledge is harder to remember. Effective techniques for <strong>how to retain what you read</strong> involve creating associations with what you already know.</p></div>`
          );
          
          let activeReadingSection = `
          <h2>Active Reading Strategies to Remember What You Read</h2>
          <p>Learning <strong>how to remember what you read</strong> requires shifting from passive consumption to active engagement. Here are proven strategies that can dramatically improve your retention:</p>
          
          <div class="p-6 my-8 bg-green-50 dark:bg-green-950/10 rounded-xl border border-green-100 dark:border-green-800/30">
            <h3 class="text-xl font-bold mb-4">Top Strategies for Better Retention</h3>
            <ul class="list-disc pl-5 space-y-3">
              <li><strong>Preview before reading</strong> - Scan headings, summaries, and conclusions to create a mental framework</li>
              <li><strong>Ask questions</strong> - Generate questions about the content before and during reading</li>
              <li><strong>Visualize concepts</strong> - Create mental images to represent key ideas</li>
              <li><strong>Take strategic notes</strong> - Use methods like Cornell or mind mapping</li>
              <li><strong>Teach what you've learned</strong> - Explaining concepts to others reinforces your understanding</li>
              <li><strong>Apply spaced repetition</strong> - Review content at increasing intervals to cement knowledge</li>
            </ul>
          </div>`;
          
          data.content = data.content.replace(
            /<h2>How to take better notes<\/h2>/,
            `${activeReadingSection}<h2>How to take better notes</h2>`
          );
          
          data.content = data.content.replace(
            /<h3>Notes Section<\/h3>\s*<p>This is where you[^<]*<\/p>/,
            `<div class="p-4 my-6 bg-indigo-50 dark:bg-indigo-950/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
              <h3 class="text-xl font-bold mb-3">Notes Section</h3>
              <p class="mb-3">This is where you write your main notes during reading. Effective note-taking is essential for <strong>how to remember what you read in a book</strong>. Focus on capturing key ideas rather than copying text verbatim.</p>
            </div>`
          );
          
          data.content = data.content.replace(
            /<p>Example: "Author argues that deep work[^<]*<\/p>/,
            `<div class="p-3 my-3 bg-white dark:bg-gray-800/40 rounded-lg border border-indigo-100/50 dark:border-indigo-800/20 max-w-full overflow-x-hidden">
              <p class="italic text-sm md:text-base break-words">Example: "Author argues that deep work requires 4 hours of uninterrupted focus. Research shows elite performers practice deliberately for 3-4 hours daily. This insight helps explain <strong>how to retain more information when reading</strong> - dedicated focus is key."</p>
            </div>`
          );
          
          data.content = data.content.replace(
            /<h3>Cues\/Questions<\/h3>\s*<p>Write keywords or[^<]*<\/p>/,
            `<div class="p-4 my-6 bg-amber-50 dark:bg-amber-950/10 rounded-xl border border-amber-100 dark:border-amber-800/30">
              <h3 class="text-xl font-bold mb-3">Cues/Questions</h3>
              <p class="mb-3">Write keywords or questions that relate to your notes. This technique is particularly effective for those wondering <strong>why can't I retain what I read</strong> - creating questions forces active engagement with the material.</p>
            </div>`
          );
          
          data.content = data.content.replace(
            /<p>"Deep work duration\?"<\/p>\s*<p>"Why 4 hours specifically\?<\/p>/,
            `<div class="p-3 my-3 bg-white dark:bg-gray-800/40 rounded-lg border border-amber-100/50 dark:border-amber-800/20 max-w-full overflow-x-hidden">
              <p class="italic mb-2 text-sm md:text-base break-words">"Deep work duration?"</p>
              <p class="italic text-sm md:text-base break-words">"Why 4 hours specifically?"</p>
            </div>`
          );
          
          data.content = data.content.replace(
            /<h3>When to Use Voice Notes:<\/h3>\s*<p>When you want[^<]*<\/p>\s*<p>For complex[^<]*<\/p>\s*<p>When on the go[^<]*<\/p>\s*<p>To record[^<]*<\/p>/,
            `<div class="p-6 my-8 bg-blue-50 dark:bg-blue-950/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <h3 class="text-xl font-bold mb-4">When to Use Voice Notes:</h3>
              <ul class="list-disc pl-5 space-y-3">
                <li>When you want to capture your emotional reaction to a passage</li>
                <li>For complex ideas that are easier to explain verbally than in writing</li>
                <li>When on the go and reading in places where typing is impractical</li>
                <li>To record your thoughts during reading for later review and to help <strong>remember more of what you read</strong></li>
              </ul>
            </div>`
          );
          
          data.content = data.content.replace(
            /<h3>Ways to "teach" what you've read:<\/h3>\s*<p>Share book[^<]*<\/p>\s*<p>Write a summary[^<]*<\/p>\s*<p>Discuss the book[^<]*<\/p>\s*<p>Create voice[^<]*<\/p>/,
            `<div class="p-6 my-8 bg-green-50 dark:bg-green-950/10 rounded-xl border border-green-100 dark:border-green-800/30">
              <h3 class="text-xl font-bold mb-4">Ways to "teach" what you've read:</h3>
              <ul class="list-disc pl-5 space-y-3">
                <li>Share book recommendations with friends through BookishNotes</li>
                <li>Write a summary of the book in your own words to better <strong>retain what you read</strong></li>
                <li>Discuss the book's key points with a reading partner</li>
                <li>Create voice notes explaining complex concepts</li>
              </ul>
            </div>`
          );
          
          let conclusionSection = `
          <h2>Conclusion: Building a System to Remember What You Read</h2>
          <p>Learning <strong>how to remember what you read</strong> isn't about having a perfect memory—it's about creating a system that works for your specific learning style. By implementing the strategies outlined in this guide, you can dramatically improve <strong>how you retain more information when reading</strong>.</p>
          
          <p>Remember that retention improves with practice. The more you actively engage with text using these techniques, the better you'll become at remembering and applying what you learn. BookishNotes provides the perfect toolkit to support your journey toward better reading retention.</p>`;
          
          data.content = data.content.replace(
            /<h2>Putting it all together<\/h2>/,
            `${conclusionSection}<h2>Putting it all together</h2>`
          );
          
          data.content = data.content.replace(
            /<p>1<\/p>\s*<p>Before reading[^<]*<\/p>\s*<p>2<\/p>\s*<p>During reading[^<]*<\/p>\s*<p>3<\/p>\s*<p>Immediately after[^<]*<\/p>\s*<p>4<\/p>\s*<p>Follow the spaced[^<]*<\/p>\s*<p>5<\/p>\s*<p>Share what[^<]*<\/p>/,
            `<div class="p-6 my-8 bg-indigo-50 dark:bg-indigo-950/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
              <h3 class="text-xl font-bold mb-4">5-Step System to Remember What You Read</h3>
              <ol class="space-y-4 list-decimal pl-5">
                <li class="pl-2">
                  <p class="font-medium">Before reading, scan the book's structure and create a framework in BookishNotes for your notes</p>
                </li>
                <li class="pl-2">
                  <p class="font-medium">During reading, use active note-taking with your preferred method (Cornell, Q-E-C, etc.)</p>
                </li>
                <li class="pl-2">
                  <p class="font-medium">Immediately after finishing a chapter, create a visual map or record a voice summary to <strong>retain what you read</strong></p>
                </li>
                <li class="pl-2">
                  <p class="font-medium">Follow the spaced repetition schedule to review your notes and overcome the question of <strong>why can't I retain what I read</strong></p>
                </li>
                <li class="pl-2">
                  <p class="font-medium">Share what you've learned with others through BookishNotes' social features to solidify <strong>how to remember what you read in a book</strong></p>
                </li>
              </ol>
            </div>`
          );
        }
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

  const formattedDate = post ? format(new Date(post.published_at), "MMMM d, yyyy") : '';

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
  
  const headings = extractHeadings(post?.content || '');
  
  const addIdsToHeadings = (content) => {
    return content.replace(
      /<h2[^>]*>(.*?)<\/h2>/g, 
      (match, group) => {
        const id = group.replace(/<[^>]*>/g, '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return `<h2 id="${id}" class="scroll-mt-20">${group}</h2>`;
      }
    );
  };
  
  const contentWithIds = post ? addIdsToHeadings(post.content) : '';

  return (
    <>
      <Helmet>
        <title>{post?.title} - BookishNotes Blog</title>
        <meta name="description" content={post?.meta_description || post?.excerpt} />
        {post?.meta_keywords?.length > 0 && (
          <meta name="keywords" content={post.meta_keywords.join(", ")} />
        )}
        <meta property="og:title" content={post?.title} />
        <meta property="og:description" content={post?.meta_description || post?.excerpt} />
        {post?.cover_image && <meta property="og:image" content={post.cover_image} />}
      </Helmet>

      <article className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/10 dark:to-background">
        {!session && <Header />}
        
        <BlogHeader
          title={post?.title || ''}
          author={post?.author?.email || ''}
          date={formattedDate}
          readingTime={post?.reading_time || 0}
          coverImage={post?.cover_image}
          coverImageAlt={post?.cover_image_alt}
          className={!session ? 'mt-16' : ''}
        />

        <main className="flex-1 py-12 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-2/3">
                {post?.excerpt && (
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
