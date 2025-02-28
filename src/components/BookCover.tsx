
import { useState, useEffect } from "react";
import { getBookCoverFallback } from "@/utils/bookCovers";
import { cn } from "@/lib/utils";

interface BookCoverProps {
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  genre: string;
  title: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BookCover({ 
  imageUrl, 
  thumbnailUrl, 
  genre, 
  title,
  className,
  size = "md"
}: BookCoverProps) {
  const [error, setError] = useState(false);
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const fallbackImage = getBookCoverFallback(genre);
  
  const sizeClasses = {
    sm: "w-16 h-24",
    md: "w-32 h-48",
    lg: "w-48 h-72"
  };

  // Process the image URL to handle different formats and fix common issues
  useEffect(() => {
    // Reset error state when props change
    setError(false);
    
    // Determine which URL to use based on size and availability
    // For small sizes, prefer thumbnail URL, otherwise use full image URL
    const urlToUse = size === "sm" && thumbnailUrl ? thumbnailUrl : 
                    imageUrl || thumbnailUrl;
    
    if (urlToUse) {
      try {
        // Convert to HTTPS for security and to prevent mixed content warnings
        let fixedUrl = urlToUse.replace(/^http:/i, 'https:');
        
        // Handle Google Books API URLs specifically
        if (fixedUrl.includes('books.google.com')) {
          // Add zoom parameter for better image quality if missing
          if (!fixedUrl.includes('zoom=')) {
            fixedUrl = fixedUrl.includes('&source=gbs_api') 
              ? fixedUrl.replace('&source=gbs_api', '&zoom=1&source=gbs_api')
              : fixedUrl + '&zoom=1';
          }
          
          // Ensure edge=curl parameter for better rendering
          if (!fixedUrl.includes('edge=curl')) {
            fixedUrl = fixedUrl.includes('?') 
              ? fixedUrl + '&edge=curl' 
              : fixedUrl + '?edge=curl';
          }
        }
        
        setFinalImageUrl(fixedUrl);
      } catch (e) {
        console.error("Error processing image URL:", e);
        setError(true);
        setFinalImageUrl(null);
      }
    } else {
      setFinalImageUrl(null);
    }
  }, [imageUrl, thumbnailUrl, size]);

  // Function to validate image URL
  const isValidImageUrl = (url?: string | null) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const validImageUrl = !error && isValidImageUrl(finalImageUrl);
  const fallbackAvailable = !!fallbackImage;

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-md shadow-md transition-shadow hover:shadow-lg",
        "flex items-center justify-center bg-[#F1F1F1]",
        sizeClasses[size],
        className
      )}
    >
      {validImageUrl || fallbackAvailable ? (
        <img
          src={validImageUrl ? finalImageUrl as string : fallbackImage}
          alt={`Cover of ${title}`}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
          loading="lazy"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <span className="text-gray-500 text-sm font-medium">
            No Image Available
          </span>
          <span className="text-gray-400 text-xs mt-1 line-clamp-2">
            {title}
          </span>
        </div>
      )}
    </div>
  );
}
