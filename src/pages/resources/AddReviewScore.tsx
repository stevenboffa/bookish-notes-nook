
import React, { useState } from "react";
import { Star, ThumbsUp, MessageCircle, ChevronLeft } from "lucide-react";
import { Meta } from "@/components/Meta";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const AddReviewScore = () => {
  const [rating, setRating] = useState(7);
  const [demoNotes, setDemoNotes] = useState("");

  const handleSliderChange = (value: number[]) => {
    setRating(value[0]);
  };

  const getScoreDescription = (score: number) => {
    if (score <= 2) return "Didn't enjoy at all";
    if (score <= 4) return "Not for me";
    if (score <= 6) return "It was okay";
    if (score <= 8) return "Really enjoyed it";
    return "Absolutely loved it!";
  };

  return (
    <>
      <Meta
        title="How to Add Your Own Personal Review Score - Resources"
        description="Learn how to add personal review scores to books in your BookishNotes library."
      />
      <Header />
      
      <main className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button - consistent with reading-streaks page */}
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
            {/* Title Section - styled like reading-streaks page */}
            <div className="bg-[#f0f5ff] px-6 py-8 border-b border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-full p-3 bg-yellow-100 text-yellow-600">
                  <Star className="h-6 w-6" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  How to Add Your Own Personal Review Score
                </h1>
              </div>
              <p className="text-gray-600">
                BookishNotes allows you to add your own personal review scores to books you've read, helping you track your favorites and remember your impressions of each book.
              </p>
            </div>
            
            {/* Content */}
            <div className="px-6 py-8 prose prose-blue max-w-none">
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  What are Personal Review Scores?
                </h2>
                <div className="prose prose-indigo max-w-none">
                  <p>
                    Personal review scores in BookishNotes are ratings on a scale from 1 to 10 that represent <em>your own opinion</em> of a book. These scores are:
                  </p>
                  <ul>
                    <li>Private to your account by default</li>
                    <li>A way to remember your impressions long after reading</li>
                    <li>Helpful for sorting your favorites from books you didn't enjoy</li>
                    <li>Completely subjective and based on your personal experience with the book</li>
                  </ul>
                  <p>
                    Remember, these scores aren't about how "good" a book is objectively - they're about how much <strong>you</strong> enjoyed it or found it valuable.
                  </p>
                </div>
              </section>

              {/* Section 2: Using the Rating Slider */}
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Using the Rating Slider
                </h2>
                <div className="prose prose-indigo max-w-none mb-6">
                  <p>
                    When viewing a book in your library, you'll find a rating slider that lets you set a score from 1 to 10, including half-point increments for more precise ratings. Try out the interactive demo below:
                  </p>
                </div>

                {/* Interactive Demo */}
                <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <div className="mb-8">
                    <div className="flex justify-between items-end mb-2">
                      <Label htmlFor="rating-demo" className="text-base font-medium text-gray-900">
                        Your Rating
                      </Label>
                      <div className="text-2xl font-bold text-indigo-600">{rating.toFixed(1)}/10</div>
                    </div>
                    <Slider
                      id="rating-demo"
                      min={1}
                      max={10}
                      step={0.5}
                      value={[rating]}
                      onValueChange={handleSliderChange}
                      className="mb-2"
                    />
                    <p className="text-sm text-gray-500 text-right">
                      {getScoreDescription(rating)}
                    </p>
                  </div>

                  <div className="mb-6">
                    <Label htmlFor="notes-demo" className="text-base font-medium text-gray-900 mb-2 block">
                      Add a note about why you gave this rating (optional)
                    </Label>
                    <Input
                      id="notes-demo"
                      placeholder="e.g., Loved the character development but the ending felt rushed"
                      value={demoNotes}
                      onChange={(e) => setDemoNotes(e.target.value)}
                      className="mb-2"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      Save Rating
                    </Button>
                  </div>
                </Card>

                <div className="mt-6 prose prose-indigo max-w-none">
                  <p>
                    <strong>Note:</strong> The demo above is just for illustration - your ratings on this page won't be saved. When using the actual feature in your library, your scores will be saved automatically.
                  </p>
                </div>
              </section>

              {/* Section 3: Tips for Consistent Rating */}
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Tips for Consistent Rating
                </h2>
                <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 mb-6">
                  <AlertDescription>
                    <div className="flex items-start gap-3">
                      <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-medium">These ratings reflect your personal opinion</p>
                        <p className="text-yellow-700/80">
                          Your personal review scores are about how <em>you</em> experienced the book, not an objective measure of its quality. Feel free to use the half-point increments to fine-tune your ratings.
                        </p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
                <div className="prose prose-indigo max-w-none">
                  <p>
                    To make your personal rating system more meaningful, consider these tips:
                  </p>
                  <ul>
                    <li>Develop your own consistent scale (e.g., what makes a "7" versus a "7.5")</li>
                    <li>Consider rating books shortly after finishing while your impressions are fresh</li>
                    <li>Use the full range of the scale - don't be afraid to give low scores to books you didn't enjoy</li>
                    <li>Remember that ratings can be changed later if your opinion evolves</li>
                    <li>Consider what aspects matter most to you: plot, characters, writing style, themes, etc.</li>
                  </ul>
                </div>
              </section>

              {/* How-To Steps */}
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  How to Add a Review Score to Your Books
                </h2>
                <ol className="space-y-6">
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Open book details</h3>
                      <p className="text-gray-600 mt-1">Navigate to your library and select the book you want to rate</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Find the rating section</h3>
                      <p className="text-gray-600 mt-1">Scroll down to the rating section in the book details view</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Adjust the slider</h3>
                      <p className="text-gray-600 mt-1">Move the slider to your desired rating from 1 to 10, using half-point increments for more precise ratings</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Your rating is saved automatically</h3>
                      <p className="text-gray-600 mt-1">BookishNotes saves your rating as soon as you set it - no need to click save</p>
                    </div>
                  </li>
                </ol>
              </section>
              
              {/* FAQ */}
              <section className="bg-indigo-50 rounded-xl p-6 mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Can others see my ratings?</h3>
                    <p className="text-gray-600">
                      By default, your ratings are private to your account. If you choose to share your library with friends, they will be able to see your ratings.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Can I change my rating later?</h3>
                    <p className="text-gray-600">
                      Yes! You can update your rating at any time by going back to the book details and adjusting the slider.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">How are ratings used in BookishNotes?</h3>
                    <p className="text-gray-600">
                      Your ratings help you sort and filter your library. You can easily find your highest-rated books or filter out books below a certain rating.
                    </p>
                  </div>
                </div>
              </section>

              <Separator className="my-10" />
              
              {/* Need Help section - consistent with reading-streaks page */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
                <p className="text-gray-700 mb-4">
                  If you're having trouble with review scores or have questions, our support team is here to assist you.
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  asChild
                  trackingId="contact_from_review_scores"
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
          
          {/* Next Steps - consistent with reading-streaks page */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Next Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-6">
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
                </div>
              </Card>
              
              <Card className="border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Reading Streaks</h3>
                  <p className="text-gray-600 mb-4">Discover how to build a consistent reading habit with reading streaks.</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                    trackingId="next_reading_streaks"
                  >
                    <Link to="/resources/reading-streaks">
                      Read Guide →
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default AddReviewScore;
