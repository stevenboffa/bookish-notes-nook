import React from 'react';
import { Meta } from "@/components/Meta";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronLeft, Search, BookPlus, Users, Badge } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const AddBooks = () => {
  return (
    <>
      <Meta 
        title="How to Add Books to Your Library - BookishNotes"
        description="Learn the different ways to add books to your personal reading collection on BookishNotes."
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
            <div className="bg-[#f2fcf6] px-6 py-8 border-b border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-full p-3 bg-green-100 text-green-600">
                  <BookPlus className="h-6 w-6" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  How to add books to your library
                </h1>
              </div>
              <p className="text-gray-600">
                Discover multiple ways to populate your BookishNotes library with books you've read, are reading, or want to read in the future.
              </p>
            </div>
            
            {/* Content */}
            <div className="px-6 py-8 prose prose-blue max-w-none">
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started with Your Library</h2>
                <p className="text-gray-700 mb-6">
                  Your BookishNotes library is where all your reading life comes together. We offer several ways to add books to your collection, making it easy to build a complete record of your reading journey.
                </p>
                
                <div className="my-8">
                  <img 
                    src="/lovable-uploads/photo-1649972904349-6e44c42644a7.jpg" 
                    alt="BookishNotes library screen" 
                    className="rounded-lg shadow-md w-full object-cover h-64"
                  />
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Method 1: Search for Books</h2>
                <div className="space-y-6">
                  <p className="text-gray-700">
                    The quickest way to add books to your library is by searching our extensive database.
                  </p>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Step 1: Navigate to "Add Book"</h3>
                    <p className="text-gray-700">
                      From your dashboard, click the "+ Add Book" button in the top right corner or navigate to the dedicated Add Book page.
                    </p>
                    <img 
                      src="/lovable-uploads/photo-1498050108023-c5249f4df085.jpg" 
                      alt="Add Book button" 
                      className="rounded-lg border border-gray-200 shadow-sm w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Step 2: Search for Your Book</h3>
                    <p className="text-gray-700">
                      Enter the title, author, or ISBN in the search field. You can be as specific or general as you like—our search engine will find the best matches.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Search className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-gray-500 italic">The Great Gatsby, F. Scott Fitzgerald</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Step 3: Select the Correct Book</h3>
                    <p className="text-gray-700">
                      Browse through the search results and click on the book you want to add. Review the details to make sure it's the correct edition.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Step 4: Add to Your Library</h3>
                    <p className="text-gray-700">
                      Click the "Add to Library" button. You'll then be prompted to set the book's status (Not Started, In Progress, Finished, or Future Reads) and add other optional details.
                    </p>
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                      <p className="text-green-700 text-sm">
                        <strong>Tip:</strong> Setting the status helps you organize your reading journey and enables features like reading progress tracking.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Method 2: Manually Add a Book</h2>
                <div className="space-y-6">
                  <p className="text-gray-700">
                    Can't find your book in our database? No problem! You can manually add all the details.
                  </p>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Step 1: Choose "Manual Entry"</h3>
                    <p className="text-gray-700">
                      On the Add Book page, click the "Manual Entry" tab or button.
                    </p>
                    <img 
                      src="/lovable-uploads/photo-1486312338219-ce68d2c6f44d.jpg" 
                      alt="Manual Entry tab" 
                      className="rounded-lg border border-gray-200 shadow-sm w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Step 2: Fill in Book Details</h3>
                    <p className="text-gray-700">
                      Complete the form with the book's information. Required fields include:
                    </p>
                    <ul className="list-disc pl-5 text-gray-700">
                      <li>Title</li>
                      <li>Author</li>
                      <li>Genre (select from dropdown or enter your own)</li>
                    </ul>
                    <p className="text-gray-700">
                      Optional fields include:
                    </p>
                    <ul className="list-disc pl-5 text-gray-700">
                      <li>Cover image (upload or provide URL)</li>
                      <li>Publication date</li>
                      <li>Book format (paperback, hardcover, e-book, etc.)</li>
                      <li>Description</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Step 3: Save to Your Library</h3>
                    <p className="text-gray-700">
                      After filling in the details, click "Add to Library" to save the book to your collection.
                    </p>
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                      <p className="text-amber-700 text-sm">
                        <strong>Note:</strong> Manually added books still support all BookishNotes features, including notes, quotes, and tracking reading progress.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              
              <Separator className="my-10" />
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Methods</h2>
                
                <div className="space-y-10">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                        <Users className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium text-gray-900">Add from Friend's Library</h3>
                    </div>
                    <p className="text-gray-700 mb-3">
                      You can add books by browsing your friends' libraries and clicking the "Add Book" button from their collection.
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700 pl-4">
                      <li>Navigate to the "Friends" page from your dashboard</li>
                      <li>Select a friend to view their book collection</li>
                      <li>Browse their library and find a book you'd like to add</li>
                      <li>Click the "Add Book" button next to any book to add it to your "Not Started" list</li>
                    </ol>
                    <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-700 text-sm">
                        <strong>Tip:</strong> This is a great way to discover new books that your friends have enjoyed and build your reading list based on recommendations from people you trust.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Managing Book Status</h2>
                <p className="text-gray-700 mb-4">
                  After adding books to your library, you can organize them by reading status:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">Not Started</span>
                    </div>
                    <p className="text-sm text-gray-600">Books you own or want to read but haven't begun yet</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-gray-900">In Progress</span>
                    </div>
                    <p className="text-sm text-gray-600">Books you're currently reading</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-gray-900">Finished</span>
                    </div>
                    <p className="text-sm text-gray-600">Books you've completed reading</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="h-4 w-4 text-purple-500" />
                      <span className="font-medium text-gray-900">Future Reads</span>
                    </div>
                    <p className="text-sm text-gray-600">Books on your wishlist or TBR (to be read) pile</p>
                  </div>
                </div>
                
                <p className="text-gray-700">
                  You can change a book's status at any time by going to the book details page and selecting the new status from the dropdown menu.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
                <p className="text-gray-700 mb-4">
                  If you're having trouble adding books to your library, our support team is here to assist you.
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  asChild
                  trackingId="contact_from_add_books"
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
          
          {/* Next Steps */}
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

export default AddBooks;
