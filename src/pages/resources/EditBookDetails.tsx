
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
                Keep your book collection accurate and organized by updating book information, covers, and reading status.
              </p>
            </div>
            
            {/* Content */}
            <div className="px-6 py-8 prose prose-blue max-w-none">
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Accessing the Edit Book Feature</h2>
                <p className="text-gray-700 mb-6">
                  BookishNotes allows you to edit any book details after you've added them to your library. Whether you need to correct information, update covers, or change the reading status, we make it easy to keep your collection accurate.
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
                        <li><strong>Publication Date:</strong> Set or update when the book was published</li>
                        <li><strong>ISBN:</strong> Add or correct the book's identifier</li>
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
                        <li><strong>Format:</strong> Specify hardcover, paperback, e-book, audiobook, etc.</li>
                        <li><strong>Collections:</strong> Add or remove the book from your collections</li>
                        <li><strong>Language:</strong> Set the language of your book</li>
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
                    One of the most common edits you'll make is updating your reading status and progress for each book.
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
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800">Progress Tracking:</h4>
                      <ul className="space-y-1 text-gray-700 pl-4 list-disc">
                        <li>Page Progress: Update current page</li>
                        <li>Percentage Complete: Automatically calculated</li>
                        <li>Chapter Progress: Mark chapters as completed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Changing Book Covers</h2>
                <div className="space-y-6">
                  <p className="text-gray-700">
                    Personalize your library by changing book covers to editions you prefer or adding covers for books that don't have them.
                  </p>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Methods to update covers:</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                        <div>
                          <p className="text-gray-700 font-medium">Upload your own image</p>
                          <p className="text-gray-600 text-sm">
                            Click "Change Cover" then "Upload Image" to select a file from your device. Recommended size: 400×600 pixels.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                        <div>
                          <p className="text-gray-700 font-medium">Select from alternative covers</p>
                          <p className="text-gray-600 text-sm">
                            Click "Change Cover" then browse through alternative covers we've found for your book.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                        <div>
                          <p className="text-gray-700 font-medium">Provide an image URL</p>
                          <p className="text-gray-600 text-sm">
                            If you have a link to the cover image, click "Change Cover" then "Enter URL" and paste the image address.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                    <p className="text-amber-700 text-sm">
                      <strong>Note:</strong> Please ensure you have the rights to use any images you upload. BookishNotes respects copyright and intellectual property.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Adding Personal Reviews and Ratings</h2>
                <div className="space-y-6">
                  <p className="text-gray-700">
                    After finishing a book, you can add your personal review and rating to remember what you thought about it.
                  </p>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900">Rating and Review Options</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-800">Star Rating:</h4>
                        <p className="text-gray-700">
                          Rate books from 1-5 stars with half-star increments to indicate how much you enjoyed the book.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-800">Written Review:</h4>
                        <p className="text-gray-700">
                          Add your thoughts, opinions, and reflections about the book. Your review can be as brief or detailed as you'd like.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-800">Private Notes:</h4>
                        <p className="text-gray-700">
                          Add private notes about the book that only you can see, separate from your public review.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Advanced Editing Options</h2>
                <div className="space-y-6">
                  <p className="text-gray-700">
                    BookishNotes offers additional options for managing your book data.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        <h3 className="font-medium text-gray-900">Syncing with Book Databases</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        If book details are incorrect, you can re-sync with online databases to pull the latest information.
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        <h3 className="font-medium text-gray-900">Bulk Editing</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Select multiple books to update attributes like genre, collection, or format in a single operation.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded">
                    <h3 className="font-medium text-gray-900 mb-2">Did you know?</h3>
                    <p className="text-gray-700 text-sm">
                      When you edit a book's details, your changes only affect your personal library. If you're connected with friends, they'll still see the book in your collection, but with the original details unless they also choose to edit their copy.
                    </p>
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
