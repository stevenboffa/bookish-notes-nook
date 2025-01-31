import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const Welcome = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-book-light to-white">
        <div className="text-center space-y-6 p-8">
          <div className="flex justify-center">
            <BookOpen className="h-20 w-20 text-book-DEFAULT" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-book-DEFAULT">
            Welcome to BookNotes
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Your personal space to capture thoughts and reflections from your reading journey.
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;