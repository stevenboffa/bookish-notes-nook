
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Footer } from "@/components/Footer";

export function BlogFooter() {
  const location = useLocation();
  const isOnBlogPost = location.pathname.startsWith('/blog/') && !location.pathname.endsWith('/blog');

  return (
    <>
      {isOnBlogPost && (
        <div className="py-12 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
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
      )}
      <Footer />
    </>
  );
}
