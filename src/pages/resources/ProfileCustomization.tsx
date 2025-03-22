
import React from "react";
import { UserRound, ChevronLeft, Edit2, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ProfileCustomization = () => {
  return (
    <>
      <Meta
        title="How to Change Your Username and Add a Profile Picture - BookishNotes"
        description="Learn how to personalize your BookishNotes profile by changing your username and adding a profile picture."
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
            {/* Title Section - with #f9f0ff color (Account Settings) */}
            <div className="bg-[#f9f0ff] px-6 py-8 border-b border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-full p-3 bg-purple-100 text-purple-600">
                  <UserRound className="h-6 w-6" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Changing your username and adding a profile picture
                </h1>
              </div>
              <p className="text-gray-600">
                Learn how to personalize your BookishNotes profile by updating your username and adding a profile picture.
              </p>
            </div>
            
            {/* Content */}
            <div className="px-6 py-8 prose prose-blue max-w-none">
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Personalizing Your Profile
                </h2>
                <p className="text-gray-700 mb-6">
                  Your BookishNotes profile is your identity in the reading community. Personalizing it with a unique username and profile picture helps friends recognize you and makes your reading experience more enjoyable.
                </p>
              </section>
              
              {/* Username Change Section */}
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  How to Change Your Username
                </h2>
                
                <Alert className="bg-blue-50 border-blue-200 text-blue-800 mb-6">
                  <AlertDescription>
                    <div className="flex items-start gap-3">
                      <Edit2 className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Choose a username that reflects your reading identity</p>
                        <p className="text-blue-700/80">
                          Your username will be visible to other BookishNotes users, including your friends and fellow readers.
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
                      <h3 className="text-lg font-medium text-gray-900">Go to your profile</h3>
                      <p className="text-gray-600 mt-1">Navigate to your profile by clicking on your avatar in the bottom navigation bar, then select "Profile" from the menu.</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Find the edit button</h3>
                      <p className="text-gray-600 mt-1">On your profile page, look for the "Edit Profile" button near your username.</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Change your username</h3>
                      <p className="text-gray-600 mt-1">In the edit profile form, find the "Username" field and enter your desired new username.</p>
                      
                      {/* Username Change Demo */}
                      <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm mt-4">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="username" className="text-sm font-medium">
                              Username
                            </Label>
                            <Input
                              id="username"
                              placeholder="BookLover123"
                              className="mt-1"
                              disabled
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Choose a unique username that will be visible to other users.
                            </p>
                          </div>
                          
                          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled>
                            Save Changes
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
                      <h3 className="text-lg font-medium text-gray-900">Save your changes</h3>
                      <p className="text-gray-600 mt-1">Click the "Save Changes" button to update your username. Your new username will be immediately visible across BookishNotes.</p>
                    </div>
                  </li>
                </ol>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mt-6">
                  <p className="text-yellow-700 text-sm">
                    <strong>Note:</strong> Your username must be unique. If someone else is already using the username you want, you'll need to choose a different one.
                  </p>
                </div>
              </section>
              
              <Separator className="my-10" />
              
              {/* Profile Picture Section */}
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  How to Add or Change Your Profile Picture
                </h2>
                
                <Alert className="bg-green-50 border-green-200 text-green-800 mb-6">
                  <AlertDescription>
                    <div className="flex items-start gap-3">
                      <Upload className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Show your reading personality</p>
                        <p className="text-green-700/80">
                          A profile picture helps your friends recognize you and adds personality to your reading profile.
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
                      <h3 className="text-lg font-medium text-gray-900">Go to your profile page</h3>
                      <p className="text-gray-600 mt-1">Navigate to your profile by clicking on your avatar in the bottom navigation bar, then select "Profile" from the menu.</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Click on your profile picture</h3>
                      <p className="text-gray-600 mt-1">On your profile, click on your current profile picture or the placeholder avatar to change it.</p>
                      
                      <div className="flex items-center justify-center my-6">
                        <div className="relative group cursor-pointer">
                          <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                            <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                              JD
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit2 className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Upload a new image</h3>
                      <p className="text-gray-600 mt-1">You'll be prompted to select a file from your device. Choose a clear, recognizable image that represents you.</p>
                      
                      {/* Profile Picture Upload Demo */}
                      <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm mt-4">
                        <div className="space-y-4">
                          <div className="flex flex-col items-center">
                            <Avatar className="h-20 w-20 mb-4">
                              <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                                JD
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="text-center mb-4">
                              <h4 className="text-base font-medium">Upload Profile Picture</h4>
                              <p className="text-sm text-gray-500">JPG, PNG or GIF. 1MB max size.</p>
                            </div>
                            
                            <Button className="relative bg-purple-600 hover:bg-purple-700 text-white" disabled>
                              <Upload className="h-4 w-4 mr-2" />
                              Choose File
                              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" disabled />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Crop and adjust</h3>
                      <p className="text-gray-600 mt-1">After selecting an image, you may be given options to crop or adjust the picture to fit the profile picture format.</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
                      5
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Save your new profile picture</h3>
                      <p className="text-gray-600 mt-1">Click "Save" or "Upload" to confirm your new profile picture. It will be visible immediately across BookishNotes.</p>
                    </div>
                  </li>
                </ol>
                
                <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded mt-6">
                  <p className="text-gray-700 text-sm">
                    <strong>Pro tip:</strong> Choose a clear, well-lit photo where your face is visible if you're using a personal photo. Alternatively, you can use book-related images that represent your reading personality.
                  </p>
                </div>
              </section>
              
              <Separator className="my-10" />
              
              {/* FAQ Section */}
              <section className="bg-purple-50 rounded-xl p-6 mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Why can't I use certain usernames?</h3>
                    <p className="text-gray-600">
                      Usernames must be unique across BookishNotes, so if someone else has already chosen the username you want, you'll need to select a different one. Additionally, usernames cannot contain offensive language or special characters.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">What types of profile pictures are allowed?</h3>
                    <p className="text-gray-600">
                      You can upload JPG, PNG, or GIF files for your profile picture. The maximum file size is 1MB. Profile pictures should not contain offensive or inappropriate content, as they are visible to the BookishNotes community.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Will my friends be notified when I change my username or profile picture?</h3>
                    <p className="text-gray-600">
                      No, your friends will not receive a direct notification when you update your username or profile picture, but they will see the changes when they visit your profile or when you appear in their friends list.
                    </p>
                  </div>
                </div>
              </section>
              
              {/* Need Help section */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
                <p className="text-gray-700 mb-4">
                  If you're having issues updating your username or profile picture, our support team is here to assist you.
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  asChild
                  trackingId="contact_from_profile_customization"
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Setting Favorite Genres</h3>
                  <p className="text-gray-600 mb-4">Learn how to set your favorite book genres for better recommendations.</p>
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
              
              <Card className="border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Security</h3>
                  <p className="text-gray-600 mb-4">Learn how to manage your account security settings and protect your data.</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                    trackingId="next_account_settings"
                  >
                    <Link to="/resources/account-settings">
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

export default ProfileCustomization;
