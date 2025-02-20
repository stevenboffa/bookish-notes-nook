
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BlogFooter() {
  return (
    <footer className="py-12 px-4 md:px-8 border-t">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Button variant="ghost" asChild>
            <Link to="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <Link to="#" className="text-muted-foreground hover:text-primary">
              Share on Twitter
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-primary">
              Share on LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
