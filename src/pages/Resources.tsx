import { Meta } from "@/components/Meta";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ResourceSection from "@/components/resources/ResourceSection";
import { 
  UserPlus, 
  BookPlus, 
  NotebookText, 
  Flame, 
  Users, 
  FolderPlus,
  Key,
  Video,
  List,
  Share,
  Pencil,
  Star,
  UserRound,
  BookmarkPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Resources = () => {
  const gettingStartedResources = [
    {
      id: "create-account",
      title: "How to create an account / sign in",
      description: "Learn how to sign up for BookishNotes and get started with your reading journey.",
      icon: UserPlus,
      readTime: "2 min",
      link: "/resources/create-account"
    },
    {
      id: "add-books",
      title: "How to add books to your library",
      description: "Discover different ways to add books to your personal reading collection.",
      icon: BookPlus,
      readTime: "3 min",
      link: "/resources/add-books"
    },
    {
      id: "edit-book-details",
      title: "How to edit book details",
      description: "Learn how to modify and update information about books in your library.",
      icon: Pencil,
      readTime: "2 min",
      link: "/resources/edit-book-details"
    }
  ];

  const readingToolsResources = [
    {
      id: "note-taking",
      title: "Guide to insightful note taking",
      description: "Master the art of taking meaningful notes that help you remember what you read.",
      icon: NotebookText,
      readTime: "5 min",
      link: "/resources/note-taking"
    },
    {
      id: "reading-streaks",
      title: "Daily reading streaks",
      description: "Learn how to build a consistent reading habit with our streak feature.",
      icon: Flame,
      readTime: "2 min",
      link: "/resources/reading-streaks"
    },
    {
      id: "add-review-score",
      title: "How to add your own personal review score",
      description: "Rate the books you've read and keep track of your favorites with our rating system.",
      icon: Star,
      readTime: "2 min",
      link: "/resources/add-review-score"
    }
  ];

  const organizationResources = [
    {
      id: "collections",
      title: "Creating collections and tagging books",
      description: "Organize your library effectively with collections and tags.",
      icon: FolderPlus,
      readTime: "4 min",
      link: "/resources/collections"
    },
    {
      id: "connect-friends",
      title: "How to connect with your friends",
      description: "Share your reading journey and discover what your friends are reading.",
      icon: Users,
      readTime: "3 min",
      link: "/resources/connect-friends"
    },
    {
      id: "recommend-book",
      title: "How to recommend a book to a friend",
      description: "Learn how to share your favorite books and reading discoveries with friends.",
      icon: Share,
      readTime: "3 min",
      link: "/resources/recommend-book"
    }
  ];

  const accountSettingsResources = [
    {
      id: "account-settings",
      title: "How to change your password / delete your account",
      description: "Manage your account security and settings.",
      icon: Key,
      readTime: "2 min",
      link: "/resources/account-settings"
    },
    {
      id: "profile-customization",
      title: "Changing your username and adding a profile picture",
      description: "Personalize your profile to make it uniquely yours.",
      icon: UserRound,
      readTime: "3 min",
      link: "/resources/profile-customization"
    },
    {
      id: "favorite-genres",
      title: "Setting your favorite book genres",
      description: "Customize your reading preferences by selecting your favorite literary genres.",
      icon: BookmarkPlus,
      readTime: "2 min",
      link: "/resources/favorite-genres"
    }
  ];

  const videoResources = [
    {
      id: "intro-video",
      title: "Getting started with BookishNotes",
      description: "A comprehensive video guide to all the features of BookishNotes.",
      icon: Video,
      readTime: "10 min video",
      link: "/resources/videos/intro"
    }
  ];

  return (
    <>
      <Meta 
        title="Resources - Learn How to Use BookishNotes"
        description="Explore guides, tutorials and videos to help you get the most out of your BookishNotes experience."
      />
      <Header />
      
      <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/lovable-uploads/339047fc-5091-496e-9e2a-2f7a356dd1b4.png')] bg-no-repeat bg-cover opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Welcome to BookishNotes Resources
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Your complete guide to tracking your reading journey, taking notes on books, and connecting with other readers.
              </p>
              <div className="mt-8">
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 py-6 h-auto text-lg"
                  asChild
                  trackingId="start_learning_resources"
                >
                  <Link to="/auth/sign-up">
                    Start Your Reading Journey
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
              What do you want to learn?
            </h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
              Check out our curated content to help you get the most out of BookishNotes
              <br />
              Want to see all of our guides? Browse the <Link to="/resources" className="text-indigo-600 hover:underline font-medium">full resource library</Link>!
            </p>

            {/* Resource Sections */}
            <ResourceSection 
              title="Getting Started" 
              resources={gettingStartedResources} 
              bgColor="bg-[#f2fcf6]"
            />
            
            <ResourceSection 
              title="Reading Tools" 
              resources={readingToolsResources} 
              bgColor="bg-[#f0f5ff]"
            />
            
            <ResourceSection 
              title="Organization" 
              resources={organizationResources} 
              bgColor="bg-[#fff9e6]"
            />
            
            <ResourceSection 
              title="Account Settings" 
              resources={accountSettingsResources} 
              bgColor="bg-[#f9f0ff]"
            />
            
            <ResourceSection 
              title="Video Tutorials" 
              resources={videoResources} 
              bgColor="bg-[#e6f9ff]"
            />
          </section>

          {/* Newsletter Signup */}
          <section className="bg-indigo-50 rounded-2xl p-8 mb-16">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Stay updated with new resources
              </h3>
              <p className="text-gray-600 mb-6">
                We're constantly adding new guides and tutorials. Sign up to get notified when new resources are available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  asChild
                  trackingId="already_registered_resources"
                >
                  <Link to="/auth/sign-in">
                    Already registered? Sign In
                  </Link>
                </Button>
                <Button 
                  className="bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700"
                  asChild
                  trackingId="sign_up_resources"
                >
                  <Link to="/auth/sign-up">
                    Sign Up Free
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Resources;
