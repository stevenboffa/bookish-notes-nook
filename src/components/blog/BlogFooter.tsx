
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BlogFooter() {
  return (
    <footer className="py-12 px-4 md:px-8 border-t">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex justify-center">
            <Button variant="ghost" asChild>
              <Link to="/blog" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to all posts
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
