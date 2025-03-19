import React from 'react';
import { Meta } from "@/components/Meta";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronLeft, Mail, UserPlus, LucideGithub } from "lucide-react";

const CreateAccount = () => {
  return (
    <>
      <Meta 
        title="How to Create an Account - BookishNotes"
        description="Learn how to create an account and sign in to BookishNotes to start tracking your reading journey."
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
                  <UserPlus className="h-6 w-6" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  How to create an account / sign in
                </h1>
              </div>
              <p className="text-gray-600">
                Learn how to join BookishNotes and start your reading journey in just a few simple steps.
              </p>
            </div>
            
            {/* Content */}
            <div className="px-6 py-8 prose prose-indigo max-w-none">
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started with BookishNotes</h2>
                <p className="text-gray-700 mb-6">
                  Creating an account on BookishNotes is quick and easy. We offer several ways to sign up so you can choose the method that works best for you.
                </p>
                
                <div className="my-8">
                  <img 
                    src="/lovable-uploads/photo-1488590528505-98d2b5aba04b.jpg" 
                    alt="BookishNotes signup screen" 
                    className="rounded-lg shadow-md w-full object-cover h-64"
                  />
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Method 1: Sign up with Email</h2>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Step 1: Navigate to the Sign Up Page</h3>
                    <p className="text-gray-700">
                      From the BookishNotes homepage, click the "Sign Up" button in the top right corner of the navigation bar, or visit <Link to="/auth/sign-up" className="text-indigo-600 hover:underline">https://bookishnotes.app/auth/sign-up</Link> directly.
                    </p>
                    <img 
                      src="/lovable-uploads/photo-1486312338219-ce68d2c6f44d.jpg" 
                      alt="BookishNotes signup page" 
                      className="rounded-lg border border-gray-200 shadow-sm w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Step 2: Fill in Your Information</h3>
                    <p className="text-gray-700">
                      Enter your email address and create a secure password. We recommend using a password that's at least 8 characters and includes a mix of letters, numbers, and special characters for better security.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Step 3: Verify Your Email</h3>
                    <p className="text-gray-700">
                      After submitting the form, check your email inbox for a verification link from BookishNotes. Click the link to verify your email address and activate your account.
                    </p>
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                      <p className="text-amber-700 text-sm">
                        <strong>Note:</strong> If you don't see the verification email, check your spam or junk folder. The email should arrive within a few minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Method 2: Sign up with Google</h2>
                <div className="space-y-6">
                  <p className="text-gray-700">
                    For a faster signup process, you can use your Google account to create a BookishNotes account.
                  </p>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Step 1: Click "Continue with Google"</h3>
                    <p className="text-gray-700">
                      On the signup page, look for the "Continue with Google" button.
                    </p>
                    <img 
                      src="/lovable-uploads/photo-1531297484001-80022131f5a1.jpg" 
                      alt="Continue with Google button" 
                      className="rounded-lg border border-gray-200 shadow-sm w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Step 2: Select Your Google Account</h3>
                    <p className="text-gray-700">
                      A popup window will appear asking you to select which Google account you want to use. Choose your preferred account.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Step 3: Grant Permissions</h3>
                    <p className="text-gray-700">
                      Google will ask for your permission to share certain information with BookishNotes. Review the permissions and click "Allow" to proceed.
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                      <p className="text-blue-700 text-sm">
                        <strong>Privacy Note:</strong> We only request basic profile information from Google, such as your name and email address. We don't access your contacts or other Google account data.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Signing In to Your Account</h2>
                <div className="space-y-6">
                  <p className="text-gray-700">
                    Once you've created your account, signing in is simple:
                  </p>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Step 1: Go to the Sign In Page</h3>
                    <p className="text-gray-700">
                      Visit <Link to="/auth/sign-in" className="text-indigo-600 hover:underline">https://bookishnotes.app/auth/sign-in</Link> or click the "Sign In" button in the navigation bar.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Step 2: Enter Your Credentials</h3>
                    <p className="text-gray-700">
                      Enter the email address and password you used when creating your account, or click "Continue with Google" if you signed up using Google.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Step 3: Start Using BookishNotes</h3>
                    <p className="text-gray-700">
                      After signing in, you'll be directed to your dashboard where you can start adding books to your library and tracking your reading progress.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Forgot Your Password?</h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    If you forget your password, you can easily reset it:
                  </p>
                  
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>On the sign-in page, click "Forgot password?" below the password field</li>
                    <li>Enter the email address associated with your account</li>
                    <li>Check your email for a password reset link</li>
                    <li>Click the link and follow the instructions to create a new password</li>
                  </ol>
                </div>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
                <p className="text-gray-700 mb-4">
                  If you're having trouble creating an account or signing in, please contact our support team. We're here to help!
                </p>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  asChild
                  trackingId="contact_from_create_account"
                >
                  <Link to="/contact">
                    <Mail className="mr-2 h-4 w-4" />
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Books to Your Library</h3>
                  <p className="text-gray-600 mb-4">Learn how to add books to your personal reading collection.</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                    trackingId="next_add_books"
                  >
                    <Link to="/resources/add-books">
                      Read Guide →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-100 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Taking Reading Notes</h3>
                  <p className="text-gray-600 mb-4">Master the art of taking meaningful notes while reading.</p>
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
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default CreateAccount;
