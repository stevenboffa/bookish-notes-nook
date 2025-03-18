
import React from 'react';
import { Meta } from "@/components/Meta";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  NotebookText, 
  BookOpenText, 
  Quote, 
  Lightbulb, 
  HelpCircle, 
  Users, 
  Image, 
  Pin, 
  Pencil, 
  List,
  FileText,
  BrainCircuit,
  BookOpen,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const NoteTaking = () => {
  return (
    <>
      <Meta 
        title="Guide to Insightful Note Taking - BookishNotes"
        description="Master the art of taking meaningful book notes that enhance your reading experience and improve retention."
      />
      <Header />
      
      <main className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              asChild
              trackingId="back_to_resources"
            >
              <Link to="/resources">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to resources
              </Link>
            </Button>
          </div>
          
          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Title Section */}
            <div className="bg-blue-50 px-6 py-8 border-b border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-full p-3 bg-blue-100 text-blue-600">
                  <NotebookText className="h-6 w-6" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Guide to Insightful Note Taking
                </h1>
              </div>
              <p className="text-gray-600">
                Master the art of capturing meaningful insights, quotes, and observations that will enhance your reading experience and help you remember what you've read.
              </p>
            </div>
            
            {/* Content */}
            <div className="px-6 py-8 prose prose-blue max-w-none">
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Why Take Notes While Reading?</h2>
                
                <div className="my-8">
                  <img 
                    src="/lovable-uploads/photo-1581091226825-a6a2a5aee158.jpg" 
                    alt="Person taking notes while reading" 
                    className="rounded-lg shadow-md w-full object-cover h-64"
                  />
                </div>
                
                <p className="text-gray-700">
                  Note-taking is one of the most powerful ways to engage with a book beyond simply reading it. Research shows that readers who take notes:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 my-6">
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-indigo-100 rounded-full">
                        <BrainCircuit className="h-5 w-5 text-indigo-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">Improve retention</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Combat the "forgetting curve" by actively engaging with the material. Studies show we forget up to 70% of what we learn within 24 hours without reinforcement.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Sparkles className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">Make connections</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Discover patterns and connections between different books and ideas that you would otherwise miss, building a personal knowledge network.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">Deepen understanding</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Achieve a more profound level of understanding by articulating concepts in your own words and reflecting on their significance.
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-amber-100 rounded-full">
                        <FileText className="h-5 w-5 text-amber-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">Build a reference library</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Create a personalized collection of ideas, quotes, and insights that you can revisit long after you've finished the book.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Types of Notes in BookishNotes</h2>
                <p className="text-gray-700 mb-6">
                  BookishNotes offers a structured approach to note-taking with different note types to help organize your thoughts and insights. Each type serves a specific purpose in your reading journey:
                </p>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-r from-purple-50 to-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-200 text-purple-700 rounded-full">
                        <BookOpenText className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium text-gray-900">Overview Notes</h3>
                    </div>
                    <p className="text-gray-700 mb-3">
                      Capture the main ideas, themes, or summaries of chapters or sections. These notes help you remember the broad strokes of what you've read.
                    </p>
                    <div className="bg-white rounded p-3 border border-gray-200 text-sm text-gray-700">
                      <strong>Example:</strong> "Chapters 1-3 establish the protagonist's background as someone who grew up in poverty but developed a unique perspective on wealth that will drive the rest of the narrative."
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <strong>Best for:</strong> Chapter summaries, section recaps, main themes
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-r from-blue-50 to-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-200 text-blue-700 rounded-full">
                        <Quote className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium text-gray-900">Quote Notes</h3>
                    </div>
                    <p className="text-gray-700 mb-3">
                      Save memorable passages, striking phrases, or powerful statements directly from the text. These serve as reference points and inspiration.
                    </p>
                    <div className="bg-white rounded p-3 border border-gray-200 text-sm text-gray-700">
                      <strong>Example:</strong> ""It is our choices, Harry, that show what we truly are, far more than our abilities." - Albus Dumbledore, page 333"
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <strong>Best for:</strong> Memorable passages, impactful statements, wisdom to remember
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-r from-yellow-50 to-yellow-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-yellow-200 text-yellow-700 rounded-full">
                        <Lightbulb className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium text-gray-900">Insight Notes</h3>
                    </div>
                    <p className="text-gray-700 mb-3">
                      Record your personal realizations, interpretations, and the "aha moments" that occur while reading. These notes transform information into personal knowledge.
                    </p>
                    <div className="bg-white rounded p-3 border border-gray-200 text-sm text-gray-700">
                      <strong>Example:</strong> "The author's point about decision fatigue explains why I feel drained after a day of small choices. I could apply this by making fewer trivial decisions in my morning routine."
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <strong>Best for:</strong> Personal revelations, connections to your life, practical applications
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-r from-purple-50 to-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-200 text-purple-700 rounded-full">
                        <HelpCircle className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium text-gray-900">Question Notes</h3>
                    </div>
                    <p className="text-gray-700 mb-3">
                      Note questions that arise during reading, points you'd like to research further, or concepts you don't fully understand yet. Questions drive deeper engagement.
                    </p>
                    <div className="bg-white rounded p-3 border border-gray-200 text-sm text-gray-700">
                      <strong>Example:</strong> "How does the author's perspective on leadership compare to modern management theory? Look up studies on servant leadership principles."
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <strong>Best for:</strong> Points to research later, concepts to clarify, critical thinking prompts
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-5 bg-gradient-to-r from-pink-50 to-pink-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-pink-200 text-pink-700 rounded-full">
                        <Users className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium text-gray-900">Character Profile Notes</h3>
                    </div>
                    <p className="text-gray-700 mb-3">
                      Track character development, relationships, and key attributes. Especially useful for fiction with complex character webs or lengthy narratives.
                    </p>
                    <div className="bg-white rounded p-3 border border-gray-200 text-sm text-gray-700">
                      <strong>Example:</strong> "Elizabeth Bennet: Strong-willed, intelligent, prejudiced initially against Darcy. Her transformation begins after receiving his letter in chapter 36."
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <strong>Best for:</strong> Character traits, development arcs, relationship dynamics
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What Makes a Good Note?</h2>
                
                <div className="my-8">
                  <img 
                    src="/lovable-uploads/photo-1519389950473-47ba0277781c.jpg" 
                    alt="Collaborative note taking" 
                    className="rounded-lg shadow-md w-full object-cover h-64"
                  />
                </div>
                
                <p className="text-gray-700 mb-6">
                  The quality of your notes is more important than quantity. The best notes are:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                    <div>
                      <h3 className="font-medium text-gray-900">Specific and Contextual</h3>
                      <p className="text-gray-700">
                        Include enough context that you'll understand the note even months later. Mention page numbers, chapters, or timestamps for audiobooks.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                    <div>
                      <h3 className="font-medium text-gray-900">In Your Own Words</h3>
                      <p className="text-gray-700">
                        Except for quotes, try to paraphrase concepts in your own language. This process helps with understanding and retention.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                    <div>
                      <h3 className="font-medium text-gray-900">Connected to Other Ideas</h3>
                      <p className="text-gray-700">
                        Great notes make connections to other books, personal experiences, or existing knowledge. "This reminds me of..." statements create a knowledge network.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                    <div>
                      <h3 className="font-medium text-gray-900">Action-Oriented When Applicable</h3>
                      <p className="text-gray-700">
                        For non-fiction especially, note how you might apply this information in your life or work. What actions could you take based on this knowledge?
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">5</div>
                    <div>
                      <h3 className="font-medium text-gray-900">Succinct and Focused</h3>
                      <p className="text-gray-700">
                        While there's no strict limit on note length, focused notes centered around one clear idea or insight are easier to review and use later.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Note-Taking Techniques for Different Book Types</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">Fiction</Badge>
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>Track character development and relationships</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>Note significant plot developments and twists</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>Identify themes, symbols, and motifs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>Collect memorable quotes and passages</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>Note your emotional responses to key scenes</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">Non-Fiction</Badge>
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">•</span>
                        <span>Summarize key concepts and arguments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">•</span>
                        <span>Note statistical data or research findings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">•</span>
                        <span>Write potential applications in your life/work</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">•</span>
                        <span>Question assumptions and evidence presented</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">•</span>
                        <span>Connect ideas to other books or knowledge</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mt-6">
                  <p className="text-blue-700 text-sm">
                    <strong>Pro Tip:</strong> For complex books, consider creating a "reading plan" note at the start. Outline what aspects you want to pay attention to and what questions you're hoping to answer through your reading.
                  </p>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Enhancing Notes with Images</h2>
                
                <p className="text-gray-700 mb-6">
                  BookishNotes allows you to attach images to your notes, creating a more visual and comprehensive reading journal:
                </p>
                
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex-1 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gray-100 text-gray-600 rounded-full">
                        <Image className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium text-gray-900">Ways to Use Images</h3>
                    </div>
                    <ul className="space-y-2 text-gray-700 pl-4">
                      <li>Capture diagrams or charts from non-fiction books</li>
                      <li>Save map images for fantasy or historical fiction</li>
                      <li>Take photos of physical book passages to quote</li>
                      <li>Add concept sketches inspired by your reading</li>
                      <li>Include book cover variations or edition artwork</li>
                    </ul>
                  </div>
                  
                  <div className="flex-1 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gray-100 text-gray-600 rounded-full">
                        <Image className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium text-gray-900">How to Add Images</h3>
                    </div>
                    <ol className="space-y-2 text-gray-700 pl-4 list-decimal">
                      <li>Begin creating a new note or edit an existing one</li>
                      <li>Click the image icon in the note editor toolbar</li>
                      <li>Choose to upload from your device or add a URL</li>
                      <li>Add a caption or description if needed</li>
                      <li>Images will be attached to your note and viewable in full screen</li>
                    </ol>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-yellow-700 text-sm">
                    <strong>Note:</strong> Please respect copyright when capturing images. For personal use, capturing small portions of books typically falls under fair use, but sharing copyrighted material publicly may not be permitted.
                  </p>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Managing Your Notes</h2>
                
                <div className="my-8">
                  <img 
                    src="/lovable-uploads/photo-1498050108023-c5249f4df085.jpg" 
                    alt="Organized notes on computer" 
                    className="rounded-lg shadow-md w-full object-cover h-64"
                  />
                </div>
                
                <p className="text-gray-700 mb-6">
                  BookishNotes gives you powerful tools to organize and manage your growing collection of notes:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full">
                        <Pin className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium text-gray-900">Pinning Notes</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Pin your most important notes to the top of your notes list for quick access. Perfect for key insights you refer to frequently.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                        <Pencil className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium text-gray-900">Editing Notes</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Refine your notes over time. Add new insights, correct information, or expand on your thoughts as your understanding deepens.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                        <List className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium text-gray-900">Sorting Features</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Sort notes by newest/oldest, filter by note type, or search for specific content to quickly find exactly what you need.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-medium text-gray-900 mb-3">Note Organization Tips</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span><strong>Be consistent with note types</strong> - Using the appropriate note type consistently makes filtering more effective.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span><strong>Add page numbers/timestamps</strong> - These references make it easy to return to the original source material.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span><strong>Pin your reading plan</strong> - If you create a reading plan or objective note, pin it for easy reference while reading.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span><strong>Review and refine periodically</strong> - Set aside time to review, organize, and possibly consolidate your notes.</span>
                    </li>
                  </ul>
                </div>
              </section>
              
              <Separator className="my-10" />
              
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Ready to Take Better Notes?</h2>
                <p className="text-gray-700 mb-6">
                  Start transforming your reading experience today with BookishNotes' powerful note-taking features. The more you capture your thoughts and insights, the more valuable your personal library becomes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    asChild
                    trackingId="try_notes_feature"
                  >
                    <Link to="/auth/sign-up">
                      Start Taking Notes
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-blue-200 hover:bg-blue-50 text-blue-600"
                    asChild
                    trackingId="read_about_collections"
                  >
                    <Link to="/resources/collections">
                      Next: Organize with Collections
                    </Link>
                  </Button>
                </div>
              </section>
            </div>
          </div>
          
          {/* Related Resources */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-gray-100 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Reading Streaks</h3>
                  <p className="text-gray-600 mb-4">Learn how consistent reading habits enhance your note-taking practice.</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                    trackingId="related_reading_streaks"
                  >
                    <Link to="/resources/reading-streaks">
                      Read Guide →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-100 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Adding Books to Your Library</h3>
                  <p className="text-gray-600 mb-4">Discover how to build your collection and prepare for effective note-taking.</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                    trackingId="related_add_books"
                  >
                    <Link to="/resources/add-books">
                      Read Guide →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default NoteTaking;
