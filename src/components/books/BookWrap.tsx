import { Book, Note, Quote } from "@/types/books";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calendar, BookOpen, Clock, X, MessageSquare, Quote as QuoteIcon, FileText, Lightbulb, HelpCircle, Users } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { useRef, useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BookWrapProps {
  book: Book;
  onClose: () => void;
  onSummaryGenerated: () => void;
}

interface NoteStats {
  stats: { [key: string]: number };
  totalNotes: number;
}

interface AISummary {
  overview: string;
  themes: string[];
  engagement: string;
  criticalThinking: string;
  emotionalResponse: string;
  keyTakeaways: string[];
  suggestedReflections: string[];
  conclusion?: string;
}

export function BookWrap({ book, onClose, onSummaryGenerated }: BookWrapProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [aiSummary, setAISummary] = useState<AISummary | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSummaryNoteCount, setLastSummaryNoteCount] = useState<number | undefined>(book?.last_summary_note_count);

  // Update local state when book prop changes
  useEffect(() => {
    setLastSummaryNoteCount(book?.last_summary_note_count);
  }, [book?.last_summary_note_count]);

  const calculateReadingTime = () => {
    if (!book.startDate || !book.endDate) return "N/A";
    const start = parseISO(book.startDate);
    const end = parseISO(book.endDate);
    const diffDays = differenceInDays(end, start) + 1; // +1 to include both start and end days
    return `${diffDays} days`;
  };

  // Update reading time when book dates change
  useEffect(() => {
    calculateReadingTime();
  }, [book.startDate, book.endDate]);

  const getReadingTime = () => calculateReadingTime();

  const getNoteStats = (): NoteStats => {
    const stats: { [key: string]: number } = {};
    const countedQuoteIds = new Set<string>();
    
    // Count notes by type
    book.notes?.forEach(note => {
      // Handle notes that are marked as quotes
      if (note.noteType?.toLowerCase() === 'quote') {
        stats['quote'] = (stats['quote'] || 0) + 1;
        countedQuoteIds.add(note.id);
      } else {
        const type = note.noteType?.toLowerCase() || 'general';
        stats[type] = (stats[type] || 0) + 1;
      }
    });

    // Add quotes from the quotes array only if they haven't been counted in notes
    if (book.quotes?.length) {
      const additionalQuotes = book.quotes.filter(quote => !countedQuoteIds.has(quote.id)).length;
      stats['quote'] = (stats['quote'] || 0) + additionalQuotes;
    }

    // Calculate total notes
    const totalNotes = Object.values(stats).reduce((sum, count) => sum + count, 0);

    // Sort the stats in the same order as the categories
    const categoryOrder = ['overview', 'quote', 'insight', 'analysis', 'question', 'character-profile', 'general'];
    const sortedStats = Object.fromEntries(
      Object.entries(stats)
        .filter(([_, count]) => count > 0) // Only keep categories with notes
        .sort(([a], [b]) => {
          const indexA = categoryOrder.indexOf(a);
          const indexB = categoryOrder.indexOf(b);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        })
    );

    return { stats: sortedStats, totalNotes };
  };

  const getNoteTypeIcon = (type: string) => {
    switch (type) {
      case 'overview':
        return <BookOpen className="h-5 w-5 text-purple-500" />;
      case 'quote':
        return <QuoteIcon className="h-5 w-5 text-blue-500" />;
      case 'analysis':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'insight':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case 'question':
        return <HelpCircle className="h-5 w-5 text-purple-500" />;
      case 'character-profile':
        return <Users className="h-5 w-5 text-pink-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNoteTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'overview': 'Overview',
      'quote': 'Quotes',
      'insight': 'Insights',
      'analysis': 'Analysis',
      'question': 'Questions',
      'character-profile': 'Character Profiles',
      'general': 'General Notes'
    };
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const groupNotesByCategory = () => {
    const groupedNotes: { [key: string]: (Note | Quote)[] } = {};
    
    // Group all notes by their type
    book.notes?.forEach((note) => {
      const type = note.noteType?.toLowerCase() || 'general';
      if (!groupedNotes[type]) {
        groupedNotes[type] = [];
      }
      groupedNotes[type].push(note);
    });

    // Add quotes separately if they're not already included in the notes
    if (book.quotes?.length && !groupedNotes['quote']) {
      groupedNotes['quote'] = book.quotes;
    }

    // Sort the categories in a specific order
    const categoryOrder = ['overview', 'quote', 'insight', 'analysis', 'question', 'character-profile', 'general'];
    
    return Object.fromEntries(
      Object.entries(groupedNotes)
        .filter(([_, notes]) => notes.length > 0) // Only keep categories with notes
        .sort(([a], [b]) => {
          const indexA = categoryOrder.indexOf(a);
          const indexB = categoryOrder.indexOf(b);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        })
    );
  };

  // Simple effect to load the stored summary
  useEffect(() => {
    if (book?.ai_summary) {
      console.log('Loading stored summary:', {
        bookId: book.id,
        hasAiSummary: true,
        currentNoteCount: (book.notes?.length || 0) + (book.quotes?.length || 0),
        lastSummaryCount: book.last_summary_note_count
      });
      setAISummary(book.ai_summary);
    }
  }, [book?.id, book?.ai_summary, book?.last_summary_note_count]);

  // Check if there are new notes since last summary
  const hasNewNotes = useMemo(() => {
    // If no summary exists, don't show the "Generate New" button
    if (!book?.ai_summary) return false;

    // If last_summary_note_count is undefined, don't show the "Generate New" button
    if (typeof lastSummaryNoteCount === 'undefined') return false;

    const currentNoteCount = (book.notes?.length || 0) + (book.quotes?.length || 0);
    
    // Debug logging
    console.log('Note count comparison:', {
      currentNoteCount,
      lastGeneratedCount: lastSummaryNoteCount,
      notesLength: book.notes?.length,
      quotesLength: book.quotes?.length,
      hasNewNotes: currentNoteCount > lastSummaryNoteCount,
      bookId: book.id,
      timestamp: new Date().toISOString()
    });
    
    // Only show the button if there are more notes now than when the summary was last generated
    return currentNoteCount > lastSummaryNoteCount;
  }, [book?.notes?.length, book?.quotes?.length, lastSummaryNoteCount, book?.ai_summary]);

  const generateAISummary = async () => {
    if (isGenerating || !book) return;

    if (book.status !== "Finished") {
      toast.error("Book wrap can only be generated for finished books.");
      return;
    }

    try {
      setIsGenerating(true);
      setIsLoadingSummary(true);

      const allNotes = book.notes || [];
      const currentNoteCount = allNotes.length + (book.quotes?.length || 0);

      console.log('Starting summary generation:', {
        bookId: book.id,
        currentNoteCount,
        previousCount: book.last_summary_note_count
      });

      const bookContext = {
        title: book.title,
        author: book.author,
        genre: book.genre,
        rating: book.rating,
        readingTime: getReadingTime(),
        startDate: book.startDate,
        endDate: book.endDate,
        totalNotes: getNoteStats().totalNotes,
        notes: allNotes.map(note => ({
          type: note.noteType || 'general',
          content: note.content,
          pageNumber: note.pageNumber,
          chapter: note.chapter
        }))
      };

      const systemPrompt = `You are an AI Reading Analyst creating a personalized summary of a reader's experience with a book. Your analysis should be based entirely on their notes and reading patterns.

First, assess the quantity and quality of notes:
- If there are few notes (less than 3) or they lack substance, acknowledge this limitation in your overview.
- If there are many detailed notes, create a thorough, personalized analysis.

Structure your response as a JSON object with these sections:
{
  "overview": "A warm, engaging introduction that sets the tone for your analysis and acknowledges the reader's effort in note-taking. If notes are sparse, gently mention this.",
  
  "themes": ["List key themes that emerge from the reader's notes, focusing on what THEY emphasized"],
  
  "engagement": "Analyze their reading style based on note patterns. Are they detail-oriented? Do they focus on plot, characters, or deeper meanings? What aspects of the book captured their attention most?",
  
  "criticalThinking": "Highlight their analytical observations about plot structure, character development, writing style, etc. Quote or reference specific notes that show deeper thinking.",
  
  "emotionalResponse": "Describe their emotional connection to the book, referencing specific reactions or personal reflections from their notes.",
  
  "keyTakeaways": ["List main insights, favorite moments, or impactful quotes they noted"],
  
  "suggestedReflections": ["3-5 thoughtful questions that build on THEIR specific observations and encourage deeper thinking"],
  
  "conclusion": "A friendly wrap-up that encourages continued note-taking and reflection. If notes were sparse, gently suggest how more detailed notes could enrich future analyses."
}

Write in a friendly, conversational tone, like a supportive book club friend. Every observation must be grounded in their actual notes - avoid generic statements.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { 
              role: 'user', 
              content: `Please analyze this reader's engagement with "${bookContext.title}" based on their reading journey:
              
Reading Duration: ${bookContext.readingTime}
Total Notes: ${bookContext.totalNotes}
Rating: ${bookContext.rating}/10

Their notes and observations:
${JSON.stringify(bookContext.notes.map(note => ({
  type: note.type,
  content: note.content,
  location: note.pageNumber ? `Page ${note.pageNumber}` : note.chapter ? `Chapter: ${note.chapter}` : 'No location specified'
})), null, 2)}`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI summary');
      }

      const data = await response.json();
      const summary = JSON.parse(data.choices[0].message.content);
      
      // Update both the AI summary and the note count
      const { data: updateData, error: updateError } = await supabase
        .from('books')
        .update({ 
          ai_summary: summary,
          last_summary_note_count: currentNoteCount
        })
        .eq('id', book.id)
        .select('id, ai_summary, last_summary_note_count');

      if (updateError) {
        throw new Error('Failed to save AI summary');
      }

      console.log('Successfully updated book:', {
        bookId: book.id,
        newNoteCount: currentNoteCount,
        updatedData: updateData?.[0]
      });

      // Update local state with new data
      setAISummary(summary);
      setLastSummaryNoteCount(currentNoteCount);
      
      // Update the parent component with the new data
      const updatedBook = {
        ...book,
        ai_summary: summary,
        last_summary_note_count: currentNoteCount
      };
      onSummaryGenerated();
      
      // Don't close the modal, just show success message
      toast.success("Reading analysis generated successfully!");
    } catch (error) {
      console.error('Error generating AI summary:', error);
      toast.error("Unable to generate reading analysis. Please try again later.");
    } finally {
      setIsLoadingSummary(false);
      setIsGenerating(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div 
            className="relative w-full sm:max-w-2xl bg-white rounded-lg shadow-xl flex flex-col"
            style={{ maxHeight: 'calc(100vh - 2rem)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed header */}
            <div className="sticky top-0 z-10 p-4 border-b bg-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Book Wrap</h2>
                <div className="flex items-center gap-2">
                  {book.status !== "Finished" ? (
                    <div className="text-xs sm:text-sm text-amber-600">
                      Note: Book wrap can only be generated once you've finished reading.
                    </div>
                  ) : !aiSummary ? (
                    <Button 
                      onClick={generateAISummary} 
                      disabled={isLoadingSummary}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base px-4 py-2 h-auto min-h-[44px] touch-manipulation"
                    >
                      Generate Book Wrap
                    </Button>
                  ) : hasNewNotes ? (
                    <div className="flex flex-col items-end gap-1">
                      <Button 
                        onClick={generateAISummary} 
                        disabled={isLoadingSummary}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base px-4 py-2 h-auto min-h-[44px] touch-manipulation"
                      >
                        Generate New
                      </Button>
                      <span className="hidden sm:inline text-xs text-emerald-600">
                        New notes detected
                      </span>
                    </div>
                  ) : null}
                  <Button 
                    onClick={onClose} 
                    variant="ghost"
                    className="h-9 sm:h-9 w-9 sm:w-9 p-0 min-h-[44px] touch-manipulation"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto">
              <div className="p-4">
                <div ref={wrapRef} className="space-y-4">
                  {/* Header */}
                  <div className="text-center mb-3 sm:mb-8">
                    <h1 className="text-xl sm:text-3xl font-bold text-indigo-900 mb-1 sm:mb-2">{book.title}</h1>
                    <p className="text-base sm:text-xl text-indigo-700">by {book.author}</p>
                  </div>

                  {/* Enhanced Book Info Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-8">
                    <Card className="p-2 sm:p-4 flex items-center space-x-2 sm:space-x-3">
                      <div className="bg-yellow-100 p-1 sm:p-2 rounded-full">
                        <Star className="text-yellow-500 h-4 w-4 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Rating</p>
                        <p className="font-semibold text-sm sm:text-lg">{book.rating}/10</p>
                      </div>
                    </Card>

                    <Card className="p-2 sm:p-4 flex items-center space-x-2 sm:space-x-3">
                      <div className="bg-blue-100 p-1 sm:p-2 rounded-full">
                        <Calendar className="text-blue-500 h-4 w-4 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Reading Time</p>
                        <p className="font-semibold text-sm sm:text-lg">{getReadingTime()}</p>
                      </div>
                    </Card>

                    <Card className="p-2 sm:p-4 flex items-center space-x-2 sm:space-x-3 col-span-2 sm:col-span-1">
                      <div className="bg-green-100 p-1 sm:p-2 rounded-full">
                        <BookOpen className="text-green-500 h-4 w-4 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Genre</p>
                        <p className="font-semibold text-sm sm:text-lg">{book.genre || "N/A"}</p>
                      </div>
                    </Card>

                    {/* Notes Stats Card */}
                    <Card className="p-2 sm:p-6 col-span-full bg-gradient-to-r from-indigo-50 to-purple-50">
                      <div className="flex justify-between items-center mb-2 sm:mb-4">
                        <h3 className="text-sm sm:text-lg font-semibold text-indigo-900">Notes & Insights</h3>
                        <div className="flex items-center gap-2">
                          <div className="bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200 flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5 text-indigo-600" />
                            <span className="text-xs sm:text-sm text-indigo-600 font-semibold">
                              {getNoteStats().totalNotes} notes
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                        {Object.entries(getNoteStats().stats).map(([type, count]) => (
                          <div key={type} className="bg-white p-2 sm:p-4 rounded-lg shadow-sm">
                            <div className="flex items-center gap-1 sm:gap-3 mb-1 sm:mb-2">
                              <div className="p-1 sm:p-2 rounded-full bg-gray-50">
                                {getNoteTypeIcon(type)}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xs font-medium text-gray-600">{getNoteTypeLabel(type)}</h4>
                                <span className="text-lg sm:text-2xl font-bold text-indigo-600">{count}</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                              <div 
                                className="bg-indigo-600 h-full rounded-full"
                                style={{ 
                                  width: `${(count / getNoteStats().totalNotes) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* AI Summary Card */}
                  <Card className="p-2 sm:p-6 bg-gradient-to-r from-emerald-50 to-teal-50">
                    <h3 className="text-sm sm:text-lg font-semibold text-emerald-800 flex items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
                      <Lightbulb className="h-3 w-3 sm:h-5 sm:w-5 text-emerald-600" />
                      <span>AI Reading Analysis</span>
                    </h3>
                    
                    {isLoadingSummary ? (
                      <div className="space-y-2 sm:space-y-4">
                        <div className="h-3 sm:h-4 bg-emerald-100 rounded animate-pulse" />
                        <div className="h-3 sm:h-4 bg-emerald-100 rounded animate-pulse w-3/4" />
                        <div className="h-3 sm:h-4 bg-emerald-100 rounded animate-pulse w-5/6" />
                      </div>
                    ) : aiSummary ? (
                      <div className="space-y-2 sm:space-y-6">
                        {/* Overview */}
                        <div className="prose prose-sm sm:prose-base prose-emerald">
                          <p className="text-sm sm:text-base text-emerald-800 leading-relaxed">{aiSummary.overview}</p>
                        </div>

                        {/* Themes */}
                        {aiSummary.themes.length > 0 && (
                          <div>
                            <h4 className="text-xs sm:text-sm font-medium text-emerald-800 mb-1 sm:mb-2">Key Themes</h4>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {aiSummary.themes.map((theme, index) => (
                                <span
                                  key={index}
                                  className="px-1.5 sm:px-3 py-0.5 sm:py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-medium"
                                >
                                  {theme}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reading Style */}
                        <div className="grid grid-cols-1 gap-2 sm:gap-6">
                          <div className="bg-emerald-50/50 rounded-lg p-2 sm:p-4">
                            <h4 className="text-xs sm:text-sm font-medium text-emerald-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                              Reading Engagement
                            </h4>
                            <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed">{aiSummary.engagement}</p>
                          </div>
                          
                          <div className="bg-emerald-50/50 rounded-lg p-2 sm:p-4">
                            <h4 className="text-xs sm:text-sm font-medium text-emerald-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                              Critical Analysis
                            </h4>
                            <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed">{aiSummary.criticalThinking}</p>
                          </div>

                          <div className="bg-emerald-50/50 rounded-lg p-2 sm:p-4">
                            <h4 className="text-xs sm:text-sm font-medium text-emerald-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                              Emotional Connection
                            </h4>
                            <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed">{aiSummary.emotionalResponse}</p>
                          </div>
                        </div>

                        {/* Key Takeaways */}
                        {aiSummary.keyTakeaways.length > 0 && (
                          <div className="bg-emerald-50/50 rounded-lg p-2 sm:p-4">
                            <h4 className="text-xs sm:text-sm font-medium text-emerald-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                              <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />
                              Key Takeaways
                            </h4>
                            <ul className="list-disc list-inside space-y-1 sm:space-y-2">
                              {aiSummary.keyTakeaways.map((takeaway, index) => (
                                <li key={index} className="text-xs sm:text-sm text-emerald-700 leading-relaxed">
                                  {takeaway}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Suggested Reflections */}
                        {aiSummary.suggestedReflections.length > 0 && (
                          <div className="bg-emerald-50/50 rounded-lg p-2 sm:p-4">
                            <h4 className="text-xs sm:text-sm font-medium text-emerald-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                              <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              Questions for Reflection
                            </h4>
                            <ul className="list-disc list-inside space-y-1 sm:space-y-2">
                              {aiSummary.suggestedReflections.map((reflection, index) => (
                                <li key={index} className="text-xs sm:text-sm text-emerald-700 leading-relaxed">
                                  {reflection}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Add body scroll lock when modal is open
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Find the BookDetailView modal
    const bookDetailView = document.querySelector('[role="dialog"]');
    
    if (bookDetailView) {
      // Store original styles
      const originalStyles = {
        overflow: bookDetailView.style.overflow,
        touchAction: bookDetailView.style.touchAction
      };
      
      // Prevent the BookDetailView from scrolling
      bookDetailView.style.overflow = 'hidden';
      bookDetailView.style.touchAction = 'none';
      
      return () => {
        // Restore original styles
        Object.assign(bookDetailView.style, originalStyles);
      };
    }
  }, []);

  // Find the BookDetailView modal to use as the portal target
  const portalTarget = document.querySelector('[role="dialog"]') || document.body;

  return createPortal(modalContent, portalTarget);
} 