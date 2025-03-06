
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Twitter, Linkedin, Facebook, Copy, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type BlogFooterProps = {
  title?: string;
  url?: string;
};

export function BlogFooter({ title = "", url = window.location.href }: BlogFooterProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank");
  };
  
  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
  };
  
  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
  };
  
  const shareEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this article: ${url}`)}`, "_blank");
  };

  return (
    <footer className="py-12 px-4 md:px-8 border-t">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <Button variant="ghost" asChild>
              <Link to="/blog" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to all posts
              </Link>
            </Button>
            
            <div className="flex flex-wrap items-center justify-center gap-2">
              <p className="text-sm text-muted-foreground mr-2">Share:</p>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-9 w-9" 
                onClick={shareTwitter}
                aria-label="Share on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-9 w-9" 
                onClick={shareLinkedIn}
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-9 w-9" 
                onClick={shareFacebook}
                aria-label="Share on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-9 w-9" 
                onClick={shareEmail}
                aria-label="Share via Email"
              >
                <Mail className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-9 w-9" 
                onClick={handleCopyLink}
                aria-label="Copy link"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
