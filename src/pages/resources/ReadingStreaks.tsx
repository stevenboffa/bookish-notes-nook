
import React from 'react';
import { Meta } from "@/components/Meta";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Calendar, Flame, CheckCircle2, Trophy, Sparkles, BarChart4, Clock, CalendarCheck2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { ReadingStreak } from "@/components/ReadingStreak";

const ReadingStreaks = () => {
  return (
    <>
      <Meta 
        title="Daily Reading Streaks - BookishNotes"
        description="Learn how to build a consistent reading habit with BookishNotes' reading streak feature."
      />
      <Header />
      
      <main className="min-h-screen py-24 bg-gradient-to-b from-amber-50/50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-amber-100 to-orange-200 p-3 rounded-full">
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Daily Reading Streaks</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Build a consistent reading habit and track your progress with our reading streak feature.
            </p>
          </div>

          {/* Example of the feature */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">How Reading Streaks Work</h2>
            <div className="mb-8">
              <ReadingStreak />
            </div>
            <p className="text-gray-700 mb-6">
              The reading streak feature shown above is available on your dashboard. Here's how it works and how you can use it to maintain a consistent reading habit.
            </p>
          </div>

          {/* Why Reading Streaks Matter */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Why Daily Reading Habits Matter</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white border-amber-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <BarChart4 className="h-5 w-5 text-amber-600" />
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
              
              <Card className="bg-white border-amber-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-amber-600" />
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
          </div>

          {/* How to Use the Feature */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">How to Use Reading Streaks</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-amber-600">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Daily Check-ins</h3>
                  <p className="text-gray-700 mb-4">
                    After you've completed some reading for the day, click the "Check In" button on your dashboard. This records your activity and extends your streak.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-amber-600">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Track Your Progress</h3>
                  <p className="text-gray-700 mb-4">
                    Watch your current streak grow day by day. The streak counter shows how many consecutive days you've read.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-amber-600">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Reach Milestones</h3>
                  <p className="text-gray-700 mb-4">
                    Earn badges for reaching streak milestones (7 days, 30 days, 100 days). These achievements help motivate you to keep your streak going.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-amber-600">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Daily Inspiration</h3>
                  <p className="text-gray-700 mb-4">
                    Each day you'll receive a new literary quote to inspire your reading journey and motivate you to maintain your streak.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips for Maintaining Streaks */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Tips for Maintaining Your Reading Streak</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white border-amber-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <CalendarCheck2 className="h-5 w-5 text-amber-600" />
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
              
              <Card className="bg-white border-amber-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <Sparkles className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Start Small</h3>
                      <p className="text-gray-600">
                        Begin with just 10-15 minutes per day. It's better to read a little consistently than to burn out trying to read too much at once.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Alert className="bg-orange-50 border-orange-200 text-amber-800 mb-6">
              <AlertDescription>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Don't Break the Chain</p>
                    <p className="text-amber-700/80">
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
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
            
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
              
              <div>
                <h3 className="text-lg font-semibold mb-2">What are the milestones I can reach?</h3>
                <p className="text-gray-700">
                  The current milestones are 7 days, 30 days, and 100 days. Each milestone awards you with a special badge that appears on your profile and reading streak card.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ReadingStreaks;
