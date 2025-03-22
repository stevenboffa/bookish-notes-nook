
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function SeedBlogPost() {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    const createBlogPost = async () => {
      if (!session?.user) {
        toast.error("You must be signed in to create a blog post");
        navigate("/auth/sign-in");
        return;
      }

      try {
        // Check if post with this slug already exists
        const { data: existingPost } = await supabase
          .from("blog_posts")
          .select("id")
          .eq("slug", "how-to-remember-what-you-read")
          .maybeSingle();

        if (existingPost) {
          toast.info("This blog post already exists");
          navigate(`/blog/how-to-remember-what-you-read`);
          return;
        }

        const post = {
          title: "7 Proven Methods: How to Remember What You Read",
          slug: "how-to-remember-what-you-read",
          excerpt: "Struggling to retain information from books? Discover 7 effective note-taking techniques that will dramatically improve how you remember what you read, featuring practical examples from BookishNotes' system.",
          content: `<div class="mb-8 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
  <p class="text-lg">We've all been there. You finish reading a book that seemed valuable and insightful, but a week later you can barely recall what it was about. Whether you're reading for school, work, or personal growth, the ability to remember what you read is crucial. In this guide, we'll explore seven proven methods to help you retain more information from your reading.</p>
</div>

<img src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" alt="A person reading and taking notes on a laptop" class="w-full rounded-xl mb-12 shadow-lg" />

<h2>Why We Forget What We Read</h2>

<p>Before diving into solutions, it's important to understand why we forget in the first place. According to cognitive science, there are several reasons:</p>

<ul>
  <li><strong>The Forgetting Curve</strong> - German psychologist Hermann Ebbinghaus discovered that without active recall, we forget approximately 70% of what we learn within 24 hours.</li>
  <li><strong>Passive Reading</strong> - Simply passing your eyes over text without active engagement results in minimal retention.</li>
  <li><strong>Information Overload</strong> - Our brains are constantly bombarded with information, making it difficult to prioritize and store new knowledge.</li>
  <li><strong>Lack of Connection</strong> - Information that isn't connected to existing knowledge is harder to remember.</li>
</ul>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
  <div class="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 p-6 rounded-xl shadow-sm">
    <h3 class="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-300">The Problem:</h3>
    <p>If you've ever thought "why can't I retain what I read?" you're not alone. Even when we're genuinely interested in the material, our retention naturally declines without the right strategies.</p>
  </div>
  
  <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 rounded-xl shadow-sm">
    <h3 class="text-xl font-semibold mb-4 text-emerald-700 dark:text-emerald-300">The Solution:</h3>
    <p>Active note-taking and strategic reading techniques can dramatically improve how you remember more of what you read, allowing you to retain information for months and years, not just days.</p>
  </div>
</div>

<h2>Method 1: Active Note-Taking with BookishNotes</h2>

<p>The BookishNotes system is designed specifically to help readers retain what they read through strategic note-taking. Unlike passive reading, active note-taking engages multiple cognitive processes, significantly improving retention.</p>

<div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 my-8">
  <h3 class="font-semibold text-xl mb-4">Inside the BookishNotes System:</h3>
  
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="flex items-start gap-3">
      <div class="bg-indigo-100 dark:bg-indigo-800/50 p-2 rounded-full text-indigo-600 dark:text-indigo-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div>
        <p class="font-medium">Dedicated note space for each book</p>
      </div>
    </div>
    
    <div class="flex items-start gap-3">
      <div class="bg-indigo-100 dark:bg-indigo-800/50 p-2 rounded-full text-indigo-600 dark:text-indigo-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div>
        <p class="font-medium">Page/chapter reference tracking</p>
      </div>
    </div>
    
    <div class="flex items-start gap-3">
      <div class="bg-indigo-100 dark:bg-indigo-800/50 p-2 rounded-full text-indigo-600 dark:text-indigo-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div>
        <p class="font-medium">Tagging system for easy retrieval</p>
      </div>
    </div>
    
    <div class="flex items-start gap-3">
      <div class="bg-indigo-100 dark:bg-indigo-800/50 p-2 rounded-full text-indigo-600 dark:text-indigo-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div>
        <p class="font-medium">Multi-format notes (text, voice, images)</p>
      </div>
    </div>
  </div>
</div>

<h3>What Makes a Good Note?</h3>

<p>The best notes don't just repeat information verbatim – they transform it. Here's what effective notes in the BookishNotes system include:</p>

<div class="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
  <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
    <div class="bg-red-50 dark:bg-red-900/20 p-4 border-b border-gray-200 dark:border-gray-700">
      <h4 class="font-medium text-red-700 dark:text-red-300">Ineffective Note</h4>
    </div>
    <div class="p-4 bg-white dark:bg-gray-800">
      <p>"The author discusses motivation and says it's important to build habits."</p>
    </div>
  </div>
  
  <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
    <div class="bg-green-50 dark:bg-green-900/20 p-4 border-b border-gray-200 dark:border-gray-700">
      <h4 class="font-medium text-green-700 dark:text-green-300">Effective Note</h4>
    </div>
    <div class="p-4 bg-white dark:bg-gray-800">
      <p>"Motivation is finite; habits are critical for long-term success. Key insight: build small, consistent habits rather than relying on fluctuating motivation. How I'll apply this: set up a 10-minute daily reading ritual before breakfast."</p>
    </div>
  </div>
</div>

<h2>Method 2: The Cornell Note-Taking Method</h2>

<p>Originally developed for students, the Cornell method is excellent for book notes as well. It divides your notes into three sections:</p>

<div class="my-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
  <div class="grid grid-cols-3 h-full">
    <div class="col-span-2 p-6 border-r border-gray-200 dark:border-gray-700">
      <h3 class="font-medium mb-3">Notes Section</h3>
      <p>This is where you write your main notes during reading.</p>
      <p class="mt-2 text-indigo-600 dark:text-indigo-400 italic">Example: "Author argues that deep work requires 4 hours of uninterrupted focus. Research shows elite performers practice deliberately for 3-4 hours daily."</p>
    </div>
    
    <div class="p-6">
      <h3 class="font-medium mb-3">Cues/Questions</h3>
      <p>Write keywords or questions that relate to your notes.</p>
      <p class="mt-2 text-indigo-600 dark:text-indigo-400 italic">"Deep work duration?"<br/>"Why 4 hours specifically?"</p>
    </div>
  </div>
  
  <div class="border-t border-gray-200 dark:border-gray-700 p-6">
    <h3 class="font-medium mb-3">Summary</h3>
    <p>After completing your notes, write a brief summary in your own words.</p>
    <p class="mt-2 text-indigo-600 dark:text-indigo-400 italic">"Optimal deep work sessions should be limited to ~4 hours daily, matching patterns observed in elite performers across fields. This contradicts my belief that longer work sessions are always better."</p>
  </div>
</div>

<p>The Cornell method works particularly well with BookishNotes because you can organize your digital notes in a similar structure, making them more effective for retrieval practice later.</p>

<h2>Method 3: Visual Mapping Techniques</h2>

<p>Visual representations of information can dramatically improve how you retain more information when reading, especially for visual learners. BookishNotes supports adding images to your notes, allowing you to:</p>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
    <div class="h-12 w-12 bg-purple-100 dark:bg-purple-800/30 rounded-full flex items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-network text-purple-600 dark:text-purple-300"><circle cx="12" cy="9" r="6"/><path d="M12 3v6"/><path d="M9 9h6"/><path d="M15.5 15.5 17 20l2-2 2 2 1-4-4-1Z"/><path d="m8.5 15.5-1.5 4.5-2-2-2 2-1-4 4-1Z"/><path d="M13.5 15.5V20"/><path d="M10.5 15.5V20"/></svg>
    </div>
    <h3 class="font-medium text-lg mb-2">Mind Maps</h3>
    <p>Create visual networks of related ideas and concepts with the main topic in the center and subtopics branching outward.</p>
  </div>
  
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
    <div class="h-12 w-12 bg-blue-100 dark:bg-blue-800/30 rounded-full flex items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-check text-blue-600 dark:text-blue-300"><path d="m3 7 3 3 3-3"/><path d="M6 10V4"/><path d="M21 11h-8"/><path d="m3 17 3 3 3-3"/><path d="M6 20v-6"/><path d="M21 17h-8"/></svg>
    </div>
    <h3 class="font-medium text-lg mb-2">Concept Maps</h3>
    <p>Show relationships between ideas with labeled connections, helping you understand the book's logical structure.</p>
  </div>
  
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
    <div class="h-12 w-12 bg-orange-100 dark:bg-orange-800/30 rounded-full flex items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list text-orange-600 dark:text-orange-300"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
    </div>
    <h3 class="font-medium text-lg mb-2">Flowcharts</h3>
    <p>Visualize processes or sequences described in the book, making complex procedures easier to remember.</p>
  </div>
</div>

<p>BookishNotes allows you to upload these visual maps as images directly to your notes, or even sketch them using the image upload feature.</p>

<h2>Method 4: Voice Notes for Auditory Learners</h2>

<p>One of BookishNotes' unique features is the ability to record voice notes. This is particularly powerful for auditory learners or when you want to capture ideas quickly.</p>

<div class="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 p-6 rounded-xl my-8">
  <h3 class="font-medium text-xl mb-4">When to Use Voice Notes:</h3>
  
  <ul class="space-y-3">
    <li class="flex items-start gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic text-indigo-600 dark:text-indigo-400 mt-1"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
      <span>When you want to capture your emotional reaction to a passage</span>
    </li>
    <li class="flex items-start gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic text-indigo-600 dark:text-indigo-400 mt-1"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
      <span>For complex ideas that are easier to explain verbally than in writing</span>
    </li>
    <li class="flex items-start gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic text-indigo-600 dark:text-indigo-400 mt-1"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
      <span>When on the go and reading in places where typing is impractical</span>
    </li>
    <li class="flex items-start gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic text-indigo-600 dark:text-indigo-400 mt-1"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
      <span>To record your thoughts during reading for later review</span>
    </li>
  </ul>
  
  <div class="mt-6 italic text-gray-700 dark:text-gray-300">
    "I've found that explaining a concept out loud as if teaching someone else dramatically improves my retention. BookishNotes' voice note feature makes this easy." — BookishNotes user
  </div>
</div>

<h2>Method 5: The Question-Evidence-Conclusion Framework</h2>

<p>This powerful framework transforms passive reading into active investigation. For each major idea in a book:</p>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
  <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <div class="h-10 w-10 rounded-full bg-red-100 dark:bg-red-800/30 flex items-center justify-center mb-3">
      <span class="text-red-600 dark:text-red-300 font-bold">Q</span>
    </div>
    <h3 class="font-medium mb-2">Question</h3>
    <p>What is the author claiming? What question are they answering?</p>
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">Example: "Does willpower work for long-term habit change?"</p>
  </div>
  
  <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <div class="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-800/30 flex items-center justify-center mb-3">
      <span class="text-amber-600 dark:text-amber-300 font-bold">E</span>
    </div>
    <h3 class="font-medium mb-2">Evidence</h3>
    <p>What evidence or arguments does the author provide?</p>
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">Example: "Studies show willpower is depleted throughout the day. Author cites Stanford research on ego depletion."</p>
  </div>
  
  <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <div class="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center mb-3">
      <span class="text-green-600 dark:text-green-300 font-bold">C</span>
    </div>
    <h3 class="font-medium mb-2">Conclusion</h3>
    <p>What is your takeaway? Do you agree with the author?</p>
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">Example: "Environment design is more reliable than willpower. I'll focus on removing friction from my reading habit rather than forcing myself."</p>
  </div>
</div>

<p>This framework is easy to implement in BookishNotes by using its structured note-taking features. You can create a template with these three headings and apply it to each major concept you encounter.</p>

<h2>Method 6: Spaced Repetition Review</h2>

<p>Reviewing your notes at strategic intervals dramatically improves retention. BookishNotes helps you implement this scientifically-proven technique:</p>

<div class="relative overflow-hidden rounded-xl my-8">
  <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-10"></div>
  <div class="relative p-6">
    <h3 class="text-xl font-medium mb-6">Optimal Review Schedule:</h3>
    
    <div class="space-y-6">
      <div class="flex items-center gap-4">
        <div class="h-12 w-12 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700">
          <span class="font-bold text-indigo-600 dark:text-indigo-400">1</span>
        </div>
        <div>
          <h4 class="font-medium">First review: 24 hours after reading</h4>
          <p class="text-gray-600 dark:text-gray-400">This is when forgetting begins to accelerate</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <div class="h-12 w-12 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700">
          <span class="font-bold text-indigo-600 dark:text-indigo-400">2</span>
        </div>
        <div>
          <h4 class="font-medium">Second review: 7 days after reading</h4>
          <p class="text-gray-600 dark:text-gray-400">Strengthens neural pathways before major decay</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <div class="h-12 w-12 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700">
          <span class="font-bold text-indigo-600 dark:text-indigo-400">3</span>
        </div>
        <div>
          <h4 class="font-medium">Third review: 30 days after reading</h4>
          <p class="text-gray-600 dark:text-gray-400">Moves information toward long-term memory</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <div class="h-12 w-12 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700">
          <span class="font-bold text-indigo-600 dark:text-indigo-400">4</span>
        </div>
        <div>
          <h4 class="font-medium">Final review: 90 days after reading</h4>
          <p class="text-gray-600 dark:text-gray-400">Solidifies information for long-term retention</p>
        </div>
      </div>
    </div>
  </div>
</div>

<p>BookishNotes makes this process easier by keeping all your notes organized by book and accessible wherever you are, so you can quickly review your insights at these optimal intervals.</p>

<h2>Method 7: Teaching and Sharing What You've Learned</h2>

<p>One of the most powerful ways to remember what you read is to teach the material to someone else. The BookishNotes platform facilitates this through its social features:</p>

<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 my-8">
  <div class="flex flex-col md:flex-row gap-6">
    <div class="md:w-1/2">
      <h3 class="font-medium text-xl mb-4">Ways to "teach" what you've read:</h3>
      <ul class="space-y-3">
        <li class="flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-600 dark:text-green-400 mt-1"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Share book recommendations with friends through BookishNotes</span>
        </li>
        <li class="flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-600 dark:text-green-400 mt-1"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Write a summary of the book in your own words</span>
        </li>
        <li class="flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-600 dark:text-green-400 mt-1"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Discuss the book's key points with a reading partner</span>
        </li>
        <li class="flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-600 dark:text-green-400 mt-1"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Create voice notes explaining complex concepts</span>
        </li>
      </ul>
    </div>
    
    <div class="md:w-1/2">
      <blockquote class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-gray-700 dark:text-gray-300 italic border-l-4 border-indigo-500">
        "When you teach something, you end up learning it twice."<br/>— Richard Feynman
      </blockquote>
      
      <p class="mt-4">Research shows that explaining material to others requires deeper processing and identifies gaps in your understanding. This process, sometimes called the "Feynman Technique," is one of the most effective ways to ensure you truly understand and remember what you've read.</p>
    </div>
  </div>
</div>

<div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 my-12">
  <h2 class="text-2xl font-bold mb-4">Putting It All Together: Your Action Plan</h2>
  
  <p class="mb-6">To maximize how much you remember from your reading, combine these approaches into a cohesive system:</p>
  
  <ol class="space-y-4">
    <li class="flex items-start gap-3">
      <div class="bg-indigo-100 dark:bg-indigo-800/50 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <span class="text-indigo-700 dark:text-indigo-300 font-medium">1</span>
      </div>
      <div>
        <p class="font-medium">Before reading, scan the book's structure and create a framework in BookishNotes for your notes</p>
      </div>
    </li>
    
    <li class="flex items-start gap-3">
      <div class="bg-indigo-100 dark:bg-indigo-800/50 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <span class="text-indigo-700 dark:text-indigo-300 font-medium">2</span>
      </div>
      <div>
        <p class="font-medium">During reading, use active note-taking with your preferred method (Cornell, Q-E-C, etc.)</p>
      </div>
    </li>
    
    <li class="flex items-start gap-3">
      <div class="bg-indigo-100 dark:bg-indigo-800/50 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <span class="text-indigo-700 dark:text-indigo-300 font-medium">3</span>
      </div>
      <div>
        <p class="font-medium">Immediately after finishing a chapter, create a visual map or record a voice summary</p>
      </div>
    </li>
    
    <li class="flex items-start gap-3">
      <div class="bg-indigo-100 dark:bg-indigo-800/50 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <span class="text-indigo-700 dark:text-indigo-300 font-medium">4</span>
      </div>
      <div>
        <p class="font-medium">Follow the spaced repetition schedule to review your notes</p>
      </div>
    </li>
    
    <li class="flex items-start gap-3">
      <div class="bg-indigo-100 dark:bg-indigo-800/50 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <span class="text-indigo-700 dark:text-indigo-300 font-medium">5</span>
      </div>
      <div>
        <p class="font-medium">Share what you've learned with others through BookishNotes' social features</p>
      </div>
    </li>
  </ol>
</div>

<p>Reading shouldn't be a passive activity where you simply consume information that quickly fades from memory. With these methods and the BookishNotes system, you can transform reading into an active process of knowledge acquisition that stays with you for years to come.</p>

<p>Remember: the goal isn't to remember every single detail, but to retain the key insights that are most valuable to you. Focus on quality over quantity in your note-taking, and you'll see a dramatic improvement in how much you remember from what you read.</p>

<div class="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-xl p-6 my-8">
  <h3 class="text-xl font-bold mb-4">Start Your Better Reading Journey Today</h3>
  <p class="mb-6">Ready to remember more of what you read? Sign up for BookishNotes and transform your reading experience with our specialized note-taking system.</p>
  <a href="/auth/sign-up" class="inline-block bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-medium py-3 px-6 rounded-lg">Create Your Free Account</a>
</div>`,
          cover_image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
          cover_image_alt: "A laptop with a book and reading glasses on a desk",
          status: "published",
          meta_description: "Discover 7 proven methods to remember what you read, including note-taking techniques, visual mapping, and spaced repetition. Learn how BookishNotes can help you retain information longer.",
          meta_keywords: ["how to remember what you read", "how to retain what you read", "why can't i retain what i read", "how to retain more information when reading", "how to remember more of what you read", "how to remember what you read in a book", "reading notes", "book notes", "note taking", "spaced repetition"],
          reading_time: 8,
          published_at: new Date().toISOString(),
          author_id: session.user.id
        };

        const { error: insertError } = await supabase
          .from("blog_posts")
          .insert(post);

        if (insertError) throw insertError;

        toast.success("Blog post created successfully!");
        navigate(`/blog/how-to-remember-what-you-read`);
      } catch (error) {
        console.error("Error creating blog post:", error);
        toast.error("Failed to create blog post");
      }
    };

    createBlogPost();
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Creating Blog Post...</h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
          <p className="mt-4 text-gray-600">
            Preparing your blog post on "How to Remember What You Read"...
          </p>
        </div>
      </div>
    </div>
  );
}
