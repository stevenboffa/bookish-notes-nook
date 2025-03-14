
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";
import { trackButtonClick } from "@/components/GoogleAnalytics";

export function SignUpWidget() {
  return (
    <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-sm border border-indigo-100/50">
      <div className="flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
          <BookOpen className="h-6 w-6 text-indigo-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-slate-800">Track Your Reading Journey</h3>
        <p className="text-slate-600 mb-5">
          Join BookishNotes to track your books, take notes, and connect with other readers.
        </p>
        <Button 
          asChild 
          size="lg" 
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          onClick={() => trackButtonClick("blog_signup_widget", "blog")}
        >
          <Link to="/auth/sign-up">
            Sign Up Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <p className="text-xs text-slate-500 mt-3">
          Free Forever. No Credit Card Required.
        </p>
      </div>
    </div>
  );
}
