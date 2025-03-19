import React, { useEffect, useState } from 'react';
import { Meta } from "@/components/Meta";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronLeft, Flame, CheckCircle2, Clock, BarChart4, CalendarCheck2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ReadingStreak } from "@/components/ReadingStreak";
import { supabase } from "@/integrations/supabase/client";

// Define DailyQuote interface to match the one in ReadingStreak component
interface DailyQuote {
  id: number;
  quoted: string;
  qauthor: string;
  qbook: string | null;
}

const ReadingStreaks = () => {
  const [exampleQuote, setExampleQuote] = useState<DailyQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);

  useEffect(() => {
    // Fetch a random quote for demonstration purposes
    const fetchRandomQuote = async () => {
      try {
        setQuoteLoading(true);
        const { data, error } = await supabase
          .from('streak_quotes')
          .select('*')
          .order('id', { ascending: false })
          .limit(1);

        if (error) throw error;
        
        if (data && data.length > 0) {
          setExampleQuote(data[0] as DailyQuote);
        } else {
          // Fallback quote if no quotes found in the database
          setExampleQuote({
            id: 0,
            quoted: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
            qauthor: "Dr. Seuss",
            qbook: "I Can Read With My Eyes Shut!"
          });
        }
      } catch (error) {
        console.error('Error fetching random quote:', error);
        // Fallback quote on error
        setExampleQuote({
          id: 0,
          quoted: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
          qauthor: "Dr. Seuss",
          qbook: "I Can Read With My Eyes Shut!"
        });
      } finally {
        setQuoteLoading(false);
      }
    };

    fetchRandomQuote();
  }, []);

  // Pass the quote to the ReadingStreak component using custom props
  const demoProps = exampleQuote ? { 
    demoQuote: exampleQuote,
    isQuoteLoading: quoteLoading
  } : undefined;

  return (
    <>
      <Meta 
        title="Daily Reading Streaks - BookishNotes"
        description="Learn how to build a consistent reading habit with BookishNotes' reading streak feature."
      />
      <Header />
      
      <main className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button - consistent with other resource pages */}
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
            {/* Title Section - styled consistently with other pages */}
            <div className="bg-[#f0f5ff] px-6 py-8 border-b border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-full p-3 bg-blue-100 text-blue-600">
                  <Flame className="h-6 w-6" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Daily Reading Streaks
                </h1>
              </div>
              <p className="text-gray-600">
                Build a consistent reading habit and track your progress with our reading streak feature.
              </p>
            </div>
            
            {/* Content */}
            <div className="px-6 py-8 prose prose-blue max-w-none">
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">How Reading Streaks Work</h2>
                <div className="mb-8">
                  <ReadingStreak demoQuote={demoProps?.demoQuote} isQuoteLoading={demoProps?.isQuoteLoading} />
                </div>
                <p className="text-gray-700 mb-6">
                  The reading streak feature shown above is available on your dashboard. Here's how it works and how you can use it to maintain a consistent reading habit.
                </p>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Why Daily Reading Habits Matter</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card className="bg-white border-orange-100">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-orange-100 p-2 rounded-full">
                          <BarChart4 className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Consistency Builds Skills</h3>
                          <p className="text-gray-600">
                            Reading every day, even if just for 10-15 minutes, compounds over time and significantly improves your comprehension and retention.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white border-orange-100">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-orange-100 p-2 rounded-full">
                          <Clock className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Forms a Lasting Habit</h3>
                          <p className="text-gray-600">
                            Research shows it takes about 66 days to form a habit. Tracking your streak helps you reach that crucial threshold.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <p className="text-gray-700 mb-6">
                  A daily reading habit has numerous benefits beyond just finishing more books:
                </p>
                
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Improves focus and concentration in an age of digital distractions</li>
                  <li>Builds neural pathways that enhance memory and cognitive function</li>
                  <li>Creates a predictable routine that signals to your brain it's time to focus</li>
                  <li>Helps you consistently make progress through longer, more challenging books</li>
                  <li>Provides daily moments of calm and intellectual engagement</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">How to Use Reading Streaks</h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-orange-600">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Daily Check-ins</h3>
                      <p className="text-gray-700 mb-4">
                        After you've completed some reading for the day, click the "Check In" button on your dashboard. This records your activity and extends your streak.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-orange-600">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Track Your Progress</h3>
                      <p className="text-gray-700 mb-4">
                        Watch your current streak grow day by day. The streak counter shows how many consecutive days you've read.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-orange-600">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Reach Milestones</h3>
                      <p className="text-gray-700 mb-4">
                        Earn badges for reaching streak milestones (7 days, 30 days, 100 days). These achievements help motivate you to keep your streak going.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-orange-600">4</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Daily Inspiration</h3>
                      <p className="text-gray-700 mb-4">
                        Each day you'll receive a new literary quote to inspire your reading journey and motivate you to maintain your streak.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Tips for Maintaining Your Reading Streak</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card className="bg-white border-orange-100">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-orange-100 p-2 rounded-full">
                          <CalendarCheck2 className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Set a Daily Reading Time</h3>
                          <p className="text-gray-600">
                            Designate a specific time each day for reading. Whether it's during your morning coffee, lunch break, or before bed.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Alert className="bg-orange-50 border-orange-200 text-orange-800 mb-6">
                  <AlertDescription>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Don't Break the Chain</p>
                        <p className="text-orange-700/80">
                          The concept of "don't break the chain" was popularized by comedian Jerry Seinfeld, who used a calendar to mark each day he wrote jokes. The growing chain of marks became a powerful motivator.
                        </p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
                
                <p className="text-gray-700 mb-6">
                  Additional strategies to maintain your reading streak:
                </p>
                
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Keep your current book visible and accessible, not hidden away on a shelf</li>
                  <li>Use the BookishNotes mobile app to read or track your reading on the go</li>
                  <li>Set a daily reminder on your phone to check in after reading</li>
                  <li>Join a reading challenge or book club for added accountability</li>
                  <li>If you miss a day, don't give up—just start a new streak the next day</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">What happens if I miss a day?</h3>
                    <p className="text-gray-700">
                      If you miss a day of reading or forget to check in, your current streak will reset. However, your longest streak record will still be preserved, so you'll always know your personal best.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">How much do I need to read each day?</h3>
                    <p className="text-gray-700">
                      There's no minimum requirement. The goal is consistency, not quantity. Even a few pages counts as reading for the day. What matters is building the habit.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Do audiobooks count for my reading streak?</h3>
                    <p className="text-gray-700">
                      Absolutely! Listening to audiobooks counts as reading. The goal is to engage with books regularly, regardless of format.
                    </p>
                  </div>
                </div>
              </section>
              
              <Separator className="my-10" />
              
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
                <p className="text-gray-700 mb-4">
                  If you're having trouble with reading streaks or have questions, our support team is here to assist you.
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  asChild
                  trackingId="contact_from_reading_streaks"
                >
                  <Link to="/contact">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Contact Support
                  </Link>
                </Button>
              </section>
            </div>
          </div>
          
          {/* Next Steps - consistent with other resource pages */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Next Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-gray-100 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Taking Reading Notes</h3>
                  <p className="text-gray-600 mb-4">Learn how to capture your thoughts and insights while reading.</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                    trackingId="next_note_taking"
                  >
                    <Link to="/resources/note-taking">
                      Read Guide →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-100 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating Collections</h3>
                  <p className="text-gray-600 mb-4">Discover how to organize your books into custom collections.</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                    trackingId="next_collections"
                  >
                    <Link to="/resources/collections">
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

export default ReadingStreaks;
