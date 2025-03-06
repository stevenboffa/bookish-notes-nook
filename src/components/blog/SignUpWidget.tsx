
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export function SignUpWidget() {
  return (
    <div className="rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 p-6 shadow-sm border">
      <div className="flex flex-col items-center text-center">
        <BookOpen className="h-12 w-12 text-primary mb-3" />
        <h3 className="text-xl font-semibold mb-2">Track Your Reading Journey</h3>
        <p className="text-muted-foreground mb-4">
          Join BookishNotes to track your books, take notes, and connect with other readers.
        </p>
        <Button asChild size="lg" className="w-full">
          <Link to="/auth/sign-up">Sign Up Free</Link>
        </Button>
      </div>
    </div>
  );
}
