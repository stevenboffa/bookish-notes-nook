
import React from "react";
import { Key, ChevronLeft, LogOut, X, AlertCircle } from "lucide-react";
import { Meta } from "@/components/Meta";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const AccountSettings = () => {
  return (
    <>
      <Meta
        title="How to Change Your Password and Delete Your Account - BookishNotes"
        description="Learn how to manage your account security settings and how to delete your account if needed."
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
            {/* Title Section - with #f9f0ff color */}
            <div className="bg-[#f9f0ff] px-6 py-8 border-b border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-full p-3 bg-purple-100 text-purple-600">
                  <Key className="h-6 w-6" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  How to change your password / delete your account
                </h1>
              </div>
              <p className="text-gray-600">
                Learn how to manage your account security settings and permanently delete your account if needed.
              </p>
            </div>
            
            {/* Content */}
            <div className="px-6 py-8 prose prose-blue max-w-none">
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Managing Your Account Security
                </h2>
                <p className="text-gray-700 mb-6">
                  BookishNotes takes your account security seriously. You can update your password or delete your account if necessary. This guide will walk you through both processes.
                </p>
              </section>
              
              {/* Password Change Section */}
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  How to Change Your Password
                </h2>
                
                <Alert className="bg-blue-50 border-blue-200 text-blue-800 mb-6">
                  <AlertDescription>
                    <div className="flex items-start gap-3">
                      <Key className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Good practice for password security</p>
                        <p className="text-blue-700/80">
                          We recommend changing your password periodically and using a unique password that you don't use for other services.
                        </p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
                
                <ol className="space-y-6">
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Go to your profile settings</h3>
                      <p className="text-gray-600 mt-1">Navigate to your profile by clicking on your avatar in the bottom navigation bar, then select "Profile" from the menu.</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Access security settings</h3>
                      <p className="text-gray-600 mt-1">In your profile page, scroll down to the "Account Security" section and click "Change Password".</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Enter your current and new password</h3>
                      <p className="text-gray-600 mt-1">You'll need to enter your current password for verification, then enter your new password twice to confirm.</p>
                      
                      {/* Password Change Demo */}
                      <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm mt-4">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="current-password" className="text-sm font-medium">
                              Current Password
                            </Label>
                            <Input
                              id="current-password"
                              type="password"
                              placeholder="••••••••"
                              className="mt-1"
                              disabled
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="new-password" className="text-sm font-medium">
                              New Password
                            </Label>
                            <Input
                              id="new-password"
                              type="password"
                              placeholder="••••••••"
                              className="mt-1"
                              disabled
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
                            </p>
                          </div>
                          
                          <div>
                            <Label htmlFor="confirm-password" className="text-sm font-medium">
                              Confirm New Password
                            </Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              placeholder="••••••••"
                              className="mt-1"
                              disabled
                            />
                          </div>
                          
                          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled>
                            Update Password
                          </Button>
                        </div>
                      </Card>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Confirm the password change</h3>
                      <p className="text-gray-600 mt-1">Click the "Update Password" button to save your new password. You'll receive a confirmation that your password has been updated successfully.</p>
                    </div>
                  </li>
                </ol>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mt-6">
                  <p className="text-yellow-700 text-sm">
                    <strong>Note:</strong> After changing your password, you'll remain logged in on your current device, but will need to use your new password when logging in on other devices.
                  </p>
                </div>
              </section>
              
              <Separator className="my-10" />
              
              {/* Account Deletion Section */}
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  How to Delete Your Account
                </h2>
                
                <Alert className="bg-red-50 border-red-200 text-red-800 mb-6">
                  <AlertDescription>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-medium">This action cannot be undone</p>
                        <p className="text-red-700/80">
                          Deleting your account will permanently remove all your data, including your reading history, notes, and collections. This action cannot be reversed.
                        </p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
                
                <ol className="space-y-6">
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Go to account settings</h3>
                      <p className="text-gray-600 mt-1">Navigate to your profile by clicking on your avatar in the bottom navigation bar, then select "Profile" from the menu.</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Scroll to the bottom of the page</h3>
                      <p className="text-gray-600 mt-1">At the bottom of your profile settings, you'll find a section titled "Delete Account".</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Click "Delete Account"</h3>
                      <p className="text-gray-600 mt-1">Click the "Delete Account" button to initiate the deletion process.</p>
                      
                      {/* Account Deletion Demo */}
                      <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm mt-4">
                        <div className="space-y-4">
                          <h4 className="text-base font-semibold text-gray-900 flex items-center">
                            <X className="h-5 w-5 text-red-500 mr-2" />
                            Delete Your Account
                          </h4>
                          
                          <p className="text-sm text-gray-600">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          
                          <div>
                            <Label htmlFor="delete-confirmation" className="text-sm font-medium">
                              Type "delete my account" to confirm
                            </Label>
                            <Input
                              id="delete-confirmation"
                              placeholder="delete my account"
                              className="mt-1"
                              disabled
                            />
                          </div>
                          
                          <Button className="w-full bg-red-600 hover:bg-red-700 text-white" disabled>
                            <LogOut className="h-4 w-4 mr-2" />
                            Permanently Delete Account
                          </Button>
                        </div>
                      </Card>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Confirm your decision</h3>
                      <p className="text-gray-600 mt-1">You'll be asked to confirm your decision by typing "delete my account" in a confirmation field. This step ensures you're not deleting your account by accident.</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-bold">
                      5
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Final confirmation</h3>
                      <p className="text-gray-600 mt-1">Click the "Permanently Delete Account" button to finalize the deletion. You'll be logged out and your account and all associated data will be permanently deleted.</p>
                    </div>
                  </li>
                </ol>
                
                <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded mt-6">
                  <p className="text-gray-700 text-sm">
                    <strong>Want to take a break instead?</strong> If you just need a break from BookishNotes, consider logging out instead of deleting your account. Your data will remain safe until you're ready to return.
                  </p>
                </div>
              </section>
              
              <Separator className="my-10" />
              
              {/* FAQ Section */}
              <section className="bg-purple-50 rounded-xl p-6 mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">What happens to my data when I delete my account?</h3>
                    <p className="text-gray-600">
                      When you delete your account, all of your personal data, including your profile information, reading history, notes, quotes, and collections are permanently removed from our servers. This action cannot be undone.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">I forgot my password. How can I reset it?</h3>
                    <p className="text-gray-600">
                      If you've forgotten your password, you can use the "Forgot Password" link on the login page. We'll send you an email with instructions to reset your password.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Will my friends be notified if I delete my account?</h3>
                    <p className="text-gray-600">
                      Your friends will not receive a direct notification, but your profile will no longer be visible to them, and they won't be able to see your books or interact with your account.
                    </p>
                  </div>
                </div>
              </section>
              
              {/* Need Help section */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
                <p className="text-gray-700 mb-4">
                  If you're having issues with changing your password or deleting your account, our support team is here to assist you.
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  asChild
                  trackingId="contact_from_account_settings"
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
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Customizing Your Profile</h3>
                  <p className="text-gray-600 mb-4">Learn how to update your username and add a profile picture.</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                    trackingId="next_profile_customization"
                  >
                    <Link to="/resources/profile-customization">
                      Read Guide →
                    </Link>
                  </Button>
                </div>
              </Card>
              
              <Card className="border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Setting Favorite Genres</h3>
                  <p className="text-gray-600 mb-4">Discover how to set your favorite book genres for better recommendations.</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                    trackingId="next_favorite_genres"
                  >
                    <Link to="/resources/favorite-genres">
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

export default AccountSettings;
