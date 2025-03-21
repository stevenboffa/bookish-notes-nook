
import React, { useState } from "react";
import { FolderPlus, Tag, ChevronLeft, PlusCircle, X, ListFilter, BookOpenText } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

const Collections = () => {
  const [collections, setCollections] = useState([
    { id: "1", name: "Summer Reading" },
    { id: "2", name: "Sci-Fi Favorites" }
  ]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [tags, setTags] = useState(["fiction", "non-fiction", "recommended", "borrowed"]);
  const [newTag, setNewTag] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | null>("1");

  const handleAddCollection = () => {
    if (newCollectionName.trim() === "") return;
    const newCollection = {
      id: (collections.length + 1).toString(),
      name: newCollectionName.trim()
    };
    setCollections([...collections, newCollection]);
    setNewCollectionName("");
  };

  const handleRemoveCollection = (id: string) => {
    setCollections(collections.filter(c => c.id !== id));
    if (selectedCollection === id) {
      setSelectedCollection(collections.length > 1 ? collections[0].id : null);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() === "" || tags.includes(newTag.trim().toLowerCase())) return;
    setTags([...tags, newTag.trim().toLowerCase()]);
    setNewTag("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: "tag" | "collection") => {
    if (e.key === 'Enter') {
      if (action === "tag") handleAddTag();
      else handleAddCollection();
    }
  };

  return (
    <>
      <Meta
        title="Creating Collections and Tagging Books - Resources"
        description="Learn how to organize your library with collections and tags in BookishNotes."
      />
      <Header />
      
      <main className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button - consistent with other resource pages */}
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
            {/* Title Section - styled like other resource pages */}
            <div className="bg-[#fff9e6] px-6 py-8 border-b border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-full p-3 bg-amber-100 text-amber-600">
                  <FolderPlus className="h-6 w-6" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Creating Collections and Tagging Books
                </h1>
              </div>
              <p className="text-gray-600">
                Learn how to organize your library effectively with collections and tags in BookishNotes, making it easier to find and group your books.
              </p>
            </div>
            
            {/* Content */}
            <div className="px-6 py-8 prose prose-blue max-w-none">
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  What are Collections and Tags?
                </h2>
                <div className="prose prose-indigo max-w-none">
                  <p>
                    Collections and tags are two powerful ways to organize your books in BookishNotes:
                  </p>
                  <ul>
                    <li>
                      <strong>Collections</strong> are like virtual bookshelves that help you group books together. For example, you might create collections for "Summer Reading," "Book Club Selections," or "Favorites of 2024."
                    </li>
                    <li>
                      <strong>Tags</strong> are flexible labels that can be applied to books across different collections. A book can have multiple tags like "history," "borrowed," "to-discuss," etc.
                    </li>
                  </ul>
                  <p>
                    Using both collections and tags gives you a flexible system to organize your reading and find books quickly when you need them.
                  </p>
                </div>
              </section>
              
              {/* Collections Section */}
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Creating and Managing Collections
                </h2>
                <div className="prose prose-indigo max-w-none mb-6">
                  <p>
                    Collections help you organize books into meaningful groups. Each book can belong to multiple collections, and you can easily browse your library by collection.
                  </p>
                </div>
                
                {/* Demo for Creating Collections */}
                <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Demo: Creating Collections</h3>
                  
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <Label htmlFor="new-collection" className="text-sm font-medium text-gray-700 mb-2 block">
                      Create a new collection
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="new-collection"
                        placeholder="Collection name (e.g. 'Summer 2024', 'Sci-Fi Favorites')"
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, "collection")}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleAddCollection}
                        disabled={newCollectionName.trim() === ""}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Your collections
                    </Label>
                    {collections.length > 0 ? (
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex flex-wrap gap-2">
                          {collections.map(collection => (
                            <div 
                              key={collection.id} 
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-md border ${selectedCollection === collection.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200'}`}
                            >
                              <button 
                                className="text-sm font-medium"
                                onClick={() => setSelectedCollection(collection.id)}
                              >
                                {collection.name}
                              </button>
                              <button 
                                className="text-gray-400 hover:text-gray-600 ml-1"
                                onClick={() => handleRemoveCollection(collection.id)}
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
                        <div className="flex flex-col items-center">
                          <BookOpenText className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 mb-3">You haven't created any collections yet</p>
                          <p className="text-xs text-gray-500 mb-4">Collections help you organize your books into custom groups</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500 italic">
                    <p>Note: This is a demo only. Collections created here won't be saved to your account.</p>
                  </div>
                </Card>
                
                <div className="prose prose-indigo max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Create and Manage Collections</h3>
                  
                  <ol className="space-y-6 mt-4">
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Find the Collections Section</h4>
                        <p className="text-gray-600 mt-1">In your BookishNotes library, look for the "Collections" section near the top of your dashboard.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Create a New Collection</h4>
                        <p className="text-gray-600 mt-1">Click the "New" button and enter a name for your collection (e.g., "Summer Reading," "To Read Next," or "Book Club Picks").</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Add Books to Your Collection</h4>
                        <p className="text-gray-600 mt-1">From any book's detail page, look for the "Add to Collection" option and select your collection from the dropdown.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-gray-900">View and Manage Collections</h4>
                        <p className="text-gray-600 mt-1">Click on any collection name to view just the books in that collection. Use the "Edit" button to reorder or delete collections.</p>
                      </div>
                    </li>
                  </ol>
                  
                  <Alert className="bg-amber-50 border-amber-200 text-amber-800 my-6">
                    <AlertDescription>
                      <div className="flex items-start gap-3">
                        <FolderPlus className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Pro Tip: Think About Your Collection Strategy</p>
                          <p className="text-amber-700/80">
                            Create collections that are meaningful to you. Some readers organize by genre, some by reading timeline ("Summer 2024"), and others by status ("Currently Reading," "Want to Read"). The best system is one that helps you find books quickly when you need them.
                          </p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </section>
              
              {/* Tags Section */}
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Using Tags for Flexible Organization
                </h2>
                <div className="prose prose-indigo max-w-none mb-6">
                  <p>
                    While collections help you group books, tags give you a more flexible way to label and categorize your books. A book can have multiple tags, and you can filter your library by tag.
                  </p>
                </div>
                
                {/* Demo for Adding Tags */}
                <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Demo: Adding Tags</h3>
                  
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <Label htmlFor="new-tag" className="text-sm font-medium text-gray-700 mb-2 block">
                      Create a new tag
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="new-tag"
                        placeholder="Tag name (e.g. 'fiction', 'favorite', 'to-discuss')"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, "tag")}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleAddTag}
                        disabled={newTag.trim() === "" || tags.includes(newTag.trim().toLowerCase())}
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Your tags
                    </Label>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="py-1.5 px-3 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-1 group"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                            <button 
                              className="text-gray-400 group-hover:text-gray-600 ml-1"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 italic">
                    <p>Note: This is a demo only. Tags created here won't be saved to your account.</p>
                  </div>
                </Card>
                
                <div className="prose prose-indigo max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Add and Use Tags</h3>
                  
                  <ol className="space-y-6 mt-4">
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Open the Book Details</h4>
                        <p className="text-gray-600 mt-1">Navigate to any book in your library and open its details page.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Find the Tags Section</h4>
                        <p className="text-gray-600 mt-1">Scroll to the "Tags" section in the book details (or click "Edit" if you're viewing the book details).</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Add Tags to the Book</h4>
                        <p className="text-gray-600 mt-1">Type tag names in the input field and press Enter after each tag. You can also select from existing tags that you've used before.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Filter Books by Tag</h4>
                        <p className="text-gray-600 mt-1">From your library view, use the filter option to show only books with specific tags.</p>
                      </div>
                    </li>
                  </ol>
                  
                  <Alert className="bg-indigo-50 border-indigo-200 text-indigo-800 my-6">
                    <AlertDescription>
                      <div className="flex items-start gap-3">
                        <Tag className="h-5 w-5 text-indigo-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Tag Ideas for Better Organization</p>
                          <p className="text-indigo-700/80">
                            Consider using tags like "to-discuss" for book club picks, "borrowed" for books you need to return, "reference" for books you frequently consult, or emotion-based tags like "inspiring" or "thought-provoking" to help remember how books made you feel.
                          </p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </section>
              
              {/* Combined Strategy Section */}
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Combining Collections and Tags for Better Organization
                </h2>
                
                <div className="prose prose-indigo max-w-none">
                  <p>
                    The most powerful approach is to use both collections and tags together:
                  </p>
                  
                  <div className="my-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Example Organization System</h3>
                    
                    <div className="mb-4">
                      <strong className="text-indigo-700">Collections:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>📚 Currently Reading</li>
                        <li>📚 Book Club Selections</li>
                        <li>📚 Summer 2024</li>
                        <li>📚 To Read Next</li>
                      </ul>
                    </div>
                    
                    <div>
                      <strong className="text-amber-700">Tags:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>🏷️ fiction, non-fiction, biography, history</li>
                        <li>🏷️ favorite, recommended, must-read</li>
                        <li>🏷️ borrowed, library-book, owned</li>
                        <li>🏷️ work-related, personal-development</li>
                      </ul>
                    </div>
                  </div>
                  
                  <p>
                    With this system, you could have a book in your "Book Club Selections" collection that has tags like "fiction," "favorite," and "owned."
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Advanced Filtering</h3>
                  <p>
                    When you combine collections and tags, you can perform powerful filtering operations like:
                  </p>
                  <ul>
                    <li>Show all "fiction" books in your "Summer 2024" collection</li>
                    <li>Find all "borrowed" books that are in your "Currently Reading" collection</li>
                    <li>View all books tagged as "favorite" across all your collections</li>
                  </ul>
                </div>
                
                <div className="mt-8 p-5 bg-amber-50 border border-amber-100 rounded-lg">
                  <h3 className="text-lg font-medium text-amber-800 mb-3 flex items-center">
                    <ListFilter className="h-5 w-5 mr-2" />
                    Filtering Your Library
                  </h3>
                  <p className="text-amber-700">
                    In your BookishNotes library, use the filtering options in the sidebar to combine collection and tag filters. This allows you to find exactly the books you're looking for, even in a large library.
                  </p>
                </div>
              </section>

              <Separator className="my-10" />
              
              {/* Need Help section - consistent with other resource pages */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
                <p className="text-gray-700 mb-4">
                  If you're having trouble with collections or tags, our support team is here to assist you.
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  asChild
                  trackingId="contact_from_collections"
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
          
          {/* Next Steps - consistent with other resource pages */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Next Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Scores</h3>
                  <p className="text-gray-600 mb-4">Learn how to rate books and track your favorites with personal review scores.</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                    trackingId="next_review_scores"
                  >
                    <Link to="/resources/add-review-score">
                      Read Guide →
                    </Link>
                  </Button>
                </div>
              </Card>
              
              <Card className="border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect with Friends</h3>
                  <p className="text-gray-600 mb-4">Discover how to connect with friends and share your reading journey.</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                    trackingId="next_connect_friends"
                  >
                    <Link to="/resources/connect-friends">
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

export default Collections;
