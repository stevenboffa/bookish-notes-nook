
import React, { useState } from "react";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";
import { Meta } from "@/components/Meta";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

      <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Resource Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-500">Reading Tools</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How to Add Your Own Personal Review Score
            </h1>
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                2 min read
              </span>
            </div>
            <div className="prose prose-indigo max-w-none">
              <p className="text-lg text-gray-700">
                BookishNotes allows you to add your own personal review scores to books you've read, helping you track your favorites and remember your impressions of each book. These scores reflect <strong>your personal opinion</strong> and aren't visible to others unless you share your library.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-12 mb-12">
            {/* Section 1: What are Personal Review Scores */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
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
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Using the Rating Slider
              </h2>
              <div className="prose prose-indigo max-w-none mb-6">
                <p>
                  When viewing a book in your library, you'll find a rating slider that lets you set a score from 1 to 10. Try out the interactive demo below:
                </p>
              </div>

              {/* Interactive Demo */}
              <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <Label htmlFor="rating-demo" className="text-base font-medium text-gray-900">
                      Your Rating
                    </Label>
                    <div className="text-2xl font-bold text-indigo-600">{rating}/10</div>
                  </div>
                  <Slider
                    id="rating-demo"
                    min={1}
                    max={10}
                    step={1}
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
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tips for Consistent Rating
              </h2>
              <div className="prose prose-indigo max-w-none">
                <p>
                  To make your personal rating system more meaningful, consider these tips:
                </p>
                <ul>
                  <li>Develop your own consistent scale (e.g., what makes a "7" versus an "8")</li>
                  <li>Consider rating books shortly after finishing while your impressions are fresh</li>
                  <li>Use the full range of the scale - don't be afraid to give low scores to books you didn't enjoy</li>
                  <li>Remember that ratings can be changed later if your opinion evolves</li>
                  <li>Consider what aspects matter most to you: plot, characters, writing style, themes, etc.</li>
                </ul>
              </div>
            </section>

            {/* How-To Steps */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
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
                    <p className="text-gray-600 mt-1">Move the slider to your desired rating from 1 to 10</p>
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
          </div>

          {/* FAQ */}
          <section className="bg-indigo-50 rounded-xl p-6 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
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

          {/* Next Steps */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ready to start rating your books?</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                asChild
              >
                <a href="/auth/sign-in">Sign In to Your Account</a>
              </Button>
              <Button
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                asChild
              >
                <a href="/resources">Explore More Resources</a>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AddReviewScore;
