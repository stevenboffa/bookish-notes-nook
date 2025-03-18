
import React from 'react';
import { Meta } from "@/components/Meta";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronLeft, Pencil, FileText, Tag, BookOpen, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const EditBookDetails = () => {
  return (
    <>
      <Meta 
        title="How to Edit Book Details - BookishNotes"
        description="Learn how to modify and update information about books in your library on BookishNotes."
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
                  <Pencil className="h-6 w-6" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  How to edit book details
                </h1>
              </div>
              <p className="text-gray-600">
                Keep your book collection accurate and organized by updating book information and reading status.
              </p>
            </div>
            
            {/* Content */}
            <div className="px-6 py-8 prose prose-blue max-w-none">
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Accessing the Edit Book Feature</h2>
                <p className="text-gray-700 mb-6">
                  BookishNotes allows you to edit any book details after you've added them to your library. Whether you need to correct information or change the reading status, we make it easy to keep your collection accurate.
                </p>
                
                <div className="my-8">
                  <img 
                    src="/lovable-uploads/photo-1498050108023-c5249f4df085.jpg" 
                    alt="Edit book interface" 
                    className="rounded-lg shadow-md w-full object-cover h-64"
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Ways to access book editing:</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                      <p className="text-gray-700">
                        <strong>From the book details page:</strong> Open any book in your library and click the "Edit" button in the top-right corner.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                      <p className="text-gray-700">
                        <strong>From your library:</strong> Hover over any book cover and click the pencil icon that appears.
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                      <p className="text-gray-700">
                        <strong>Quick actions menu:</strong> Click the three dots (...) next to any book in list view and select "Edit Details."
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Editing Basic Book Information</h2>
                <div className="space-y-6">
                  <p className="text-gray-700">
                    The edit form allows you to update all the essential information about your book.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
                          <FileText className="h-4 w-4" />
                        </div>
                        <h3 className="font-medium text-gray-900">Basic Details</h3>
                      </div>
                      <ul className="space-y-2 text-gray-700 pl-4">
                        <li><strong>Title:</strong> Update the book title</li>
                        <li><strong>Author:</strong> Change or correct author names</li>
                      </ul>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 text-green-600 rounded-full">
                          <Tag className="h-4 w-4" />
                        </div>
                        <h3 className="font-medium text-gray-900">Classification</h3>
                      </div>
                      <ul className="space-y-2 text-gray-700 pl-4">
                        <li><strong>Genre:</strong> Choose from predefined genres or create custom ones</li>
                        <li><strong>Book type:</strong> Book, Audiobook</li>
                        <li><strong>Collections:</strong> Add or remove the book from your collections</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mt-8">
                    <p className="text-green-700 text-sm">
                      <strong>Tip:</strong> Your changes are saved automatically as you update each field, so you don't need to worry about losing your edits.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Updating Reading Status and Progress</h2>
                <div className="space-y-6">
                  <p className="text-gray-700">
                    One of the most common edits you'll make is updating your reading status for each book.
                  </p>
                  
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium text-gray-900">Reading Status Options</h3>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-800">Reading Status:</h4>
                        <ul className="space-y-1 text-gray-700 pl-4 list-disc">
                          <li>Not Started</li>
                          <li>In Progress</li>
                          <li>Finished</li>
                          <li>Future Reads</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-800">Reading Dates:</h4>
                        <ul className="space-y-1 text-gray-700 pl-4 list-disc">
                          <li>Date Started</li>
                          <li>Date Finished</li>
                          <li>Reading Time (calculated automatically)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              
              <Separator className="my-10" />
              
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
                <p className="text-gray-700 mb-4">
                  If you're having trouble editing book details, our support team is here to assist you.
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  asChild
                  trackingId="contact_from_edit_books"
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

export default EditBookDetails;
