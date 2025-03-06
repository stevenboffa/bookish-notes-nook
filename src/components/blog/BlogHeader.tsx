
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Facebook, Copy, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type BlogHeaderProps = {
  className?: string;
  coverImage?: string | null;
  title: string;
  author: string;
  date: string;
  readingTime: number;
  url?: string;
};

export function BlogHeader({ 
  className, 
  coverImage, 
  title, 
  author, 
  date, 
  readingTime,
  url = window.location.href
}: BlogHeaderProps) {
  // Format author name
  const authorName = author === "hi@stevenboffa.com" ? "Steven B." : author;
  
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
    <header className={cn("w-full", className)}>
      {coverImage ? (
        <div className="relative h-[70vh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent z-10" />
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center z-20">
            <div className="container max-w-4xl mx-auto px-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white text-shadow-lg">
                {title}
              </h1>
              <div className="flex items-center gap-4 text-sm md:text-base text-white/90 mb-6">
                <span className="font-medium">{authorName}</span>
                <span>•</span>
                <time dateTime={date}>{date}</time>
                <span>•</span>
                <span>{readingTime} min read</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-9 w-9 bg-white/10 hover:bg-white/20 border-white/20" 
                  onClick={shareTwitter}
                  aria-label="Share on Twitter"
                >
                  <Twitter className="h-4 w-4 text-white" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-9 w-9 bg-white/10 hover:bg-white/20 border-white/20" 
                  onClick={shareLinkedIn}
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="h-4 w-4 text-white" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-9 w-9 bg-white/10 hover:bg-white/20 border-white/20" 
                  onClick={shareFacebook}
                  aria-label="Share on Facebook"
                >
                  <Facebook className="h-4 w-4 text-white" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-9 w-9 bg-white/10 hover:bg-white/20 border-white/20" 
                  onClick={shareEmail}
                  aria-label="Share via Email"
                >
                  <Mail className="h-4 w-4 text-white" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-9 w-9 bg-white/10 hover:bg-white/20 border-white/20" 
                  onClick={handleCopyLink}
                  aria-label="Copy link"
                >
                  <Copy className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-24 px-4 md:px-8 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20">
          <div className="container max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <div className="flex items-center gap-4 text-sm md:text-base text-muted-foreground mb-6">
              <span className="font-medium">{authorName}</span>
              <span>•</span>
              <time dateTime={date}>{date}</time>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
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
      )}
    </header>
  );
}
