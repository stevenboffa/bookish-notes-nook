
import React from 'react';
import { Meta } from "@/components/Meta";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronLeft, Users, Mail, Check, Clipboard, BookPlus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const ConnectFriends = () => {
  return (
    <>
      <Meta 
        title="How to Connect with Your Friends - BookishNotes"
        description="Learn how to connect with friends on BookishNotes, share your reading journey, and discover what your friends are reading."
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
            {/* Title Section with specified background color */}
            <div className="bg-[#fff9e6] px-6 py-8 border-b border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-full p-3 bg-amber-100 text-amber-600">
                  <Users className="h-6 w-6" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  How to Connect with Your Friends
                </h1>
              </div>
              <p className="text-gray-600">
                Share your reading journey and discover what your friends are reading on BookishNotes.
              </p>
            </div>
            
            {/* Content */}
            <div className="px-6 py-8 prose prose-amber max-w-none">
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Why Connect with Friends?</h2>
                
                <p className="text-gray-700 mb-6">
                  Reading doesn't have to be a solitary activity. When you connect with friends on BookishNotes, you can:
                </p>
                
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Discover new books through your friends' libraries</li>
                  <li>See what ratings and reviews your friends have given to books</li>
                  <li>Easily add books from your friends' libraries to your own</li>
                  <li>Get inspired by what others are reading</li>
                  <li>Share your reading journey with people you know</li>
                </ul>
                
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-6 mb-8">
                  <img 
                    src="/lovable-uploads/416d1480-d11e-4030-881b-a11830e59197.png" 
                    alt="Friends page overview" 
                    className="rounded-lg shadow-sm mb-4 w-full"
                  />
                  <p className="text-sm text-gray-600 text-center">
                    The Friends page shows your connections and their reading activity
                  </p>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">How to Send a Friend Request</h2>
                
                <p className="text-gray-700 mb-6">
                  Currently, the only way to add a friend on BookishNotes is through their email address. Here's how to do it:
                </p>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-amber-600">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Go to the Friends Page</h3>
                      <p className="text-gray-700 mb-4">
                        Navigate to the Friends page by clicking on the Friends icon in the bottom navigation menu.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <img 
                          src="/lovable-uploads/41ae37f8-6871-4b3b-ad5d-9f6cc38a795e.png" 
                          alt="Friends navigation icon" 
                          className="rounded-lg shadow-sm w-full max-w-sm mx-auto"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-amber-600">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Enter Your Friend's Email</h3>
                      <p className="text-gray-700 mb-4">
                        At the top of the Friends page, you'll find a section to add friends. Enter your friend's email address in the text field.
                      </p>
                      <div className="flex items-center gap-2 mb-4 bg-slate-50 p-4 rounded-lg">
                        <Mail className="h-5 w-5 text-amber-500" />
                        <span className="text-gray-900 font-medium">friend@example.com</span>
                      </div>
                      <Alert className="bg-blue-50 border-blue-100 text-blue-800 mb-4">
                        <AlertDescription>
                          <div className="flex items-start gap-3">
                            <div>
                              <p className="font-medium">Important note:</p>
                              <p className="text-blue-700/80">
                                Your friend must have a BookishNotes account with this email address for the friend request to work.
                              </p>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-amber-600">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Send the Friend Request</h3>
                      <p className="text-gray-700 mb-4">
                        Click the "Add Friend" button to send your friend request. The system will verify if the email exists and send the request.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                            Add Friend
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-amber-600">4</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Wait for Acceptance</h3>
                      <p className="text-gray-700 mb-4">
                        After sending a request, your friend will need to accept it before you're connected. You'll see a confirmation message once the request has been sent.
                      </p>
                      <Alert className="bg-green-50 border-green-100 text-green-800">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <AlertDescription>
                          Friend request sent to friend@example.com. They will need to approve it.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Accepting Friend Requests</h2>
                
                <p className="text-gray-700 mb-6">
                  When someone sends you a friend request, you'll need to accept it to connect with them:
                </p>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-amber-600">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Go to the Friends Page</h3>
                      <p className="text-gray-700 mb-4">
                        Navigate to the Friends page where you'll see a "Pending Requests" section if you have any incoming friend requests.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-amber-600">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Review the Request</h3>
                      <p className="text-gray-700 mb-4">
                        Each pending request will show the user's email or username. Review it to make sure you know the person.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <Card className="border border-amber-100">
                          <CardContent className="p-4">
                            <h4 className="font-medium text-gray-900 mb-1">Friend Request</h4>
                            <p className="text-gray-600 text-sm mb-4">From: jane.reader@example.com</p>
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Accept</Button>
                              <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">Reject</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-amber-600">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Accept or Reject</h3>
                      <p className="text-gray-700 mb-4">
                        Click "Accept" to add this person as a friend, or "Reject" to decline the request. Once accepted, you'll be connected and able to see each other's libraries.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Viewing a Friend's Library</h2>
                
                <p className="text-gray-700 mb-6">
                  Once you're connected with a friend, you can explore their book library:
                </p>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-amber-600">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Navigate to Friends Page</h3>
                      <p className="text-gray-700 mb-4">
                        Go to the Friends page where you'll see a list of all your connected friends.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-amber-600">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Select a Friend</h3>
                      <p className="text-gray-700 mb-4">
                        Click on a friend's card to view their profile and library. You'll see their username, email, and the number of books in their library.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-amber-600">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Browse Their Books</h3>
                      <p className="text-gray-700 mb-4">
                        You'll see a list of books in your friend's library, including titles, authors, and their personal ratings.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <img 
                          src="/lovable-uploads/c6ef2801-ecc1-4254-84df-fb60eb4659c3.png" 
                          alt="Friend's book library" 
                          className="rounded-lg shadow-sm w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Adding Books from a Friend's Library</h2>
                
                <p className="text-gray-700 mb-6">
                  One of the great benefits of connecting with friends is the ability to add books from their library to yours:
                </p>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-amber-600">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Find a Book You Like</h3>
                      <p className="text-gray-700 mb-4">
                        While browsing your friend's library, find a book that interests you.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-amber-600">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Click "Add Book"</h3>
                      <p className="text-gray-700 mb-4">
                        Each book in your friend's library will have an "Add Book" button. Click it to add the book to your own library.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <BookPlus className="h-4 w-4 mr-2" />
                          Add Book
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-amber-600">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Customize Details (Optional)</h3>
                      <p className="text-gray-700 mb-4">
                        After adding the book, you can go to your library and update its details such as reading status, format, or add your own notes.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Alert className="bg-amber-50 border-amber-100 text-amber-800 my-6">
                  <AlertDescription>
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="font-medium">Privacy note:</p>
                        <p className="text-amber-700/80">
                          When you add a friend, they can see your entire library and your ratings. Be mindful of this when adding personal books that you might not want to share.
                        </p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Tips for Building Your Reading Community</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card className="bg-white border-amber-100">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <Clipboard className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Share With Book Clubs</h3>
                          <p className="text-gray-600">
                            If you're in a book club, connect with other members to easily share what you're reading and your thoughts on club selections.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white border-amber-100">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <Users className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Connect with Like-minded Readers</h3>
                          <p className="text-gray-600">
                            Find friends who enjoy similar genres to discover new books that align with your reading preferences.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Can I remove a friend?</h3>
                    <p className="text-gray-700">
                      Yes, you can remove a friend at any time. Go to the Friends page, find the friend you want to remove, and click on the menu option to remove them.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Can I add friends through methods other than email?</h3>
                    <p className="text-gray-700">
                      Currently, the only way to add friends is by using their email address. We may add additional methods in future updates.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Will my friends see my private notes?</h3>
                    <p className="text-gray-700">
                      No, your friends can see your book list and ratings, but they cannot see your private notes or highlights from books.
                    </p>
                  </div>
                </div>
              </section>
              
              <Separator className="my-10" />
              
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
                <p className="text-gray-700 mb-4">
                  If you're having trouble connecting with friends or have questions, our support team is here to assist you.
                </p>
                <Button
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  asChild
                  trackingId="contact_from_connect_friends"
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommending Books</h3>
                  <p className="text-gray-600 mb-4">Learn how to share your favorite books with your friends.</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                    trackingId="next_recommend_book"
                  >
                    <Link to="/resources/recommend-book">
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

export default ConnectFriends;
