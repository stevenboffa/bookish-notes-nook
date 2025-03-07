
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const fallbackImage = getBookCoverFallback(genre);
  
  const sizeClasses = {
    sm: "w-28 h-40",
    md: "w-32 h-48",
    lg: "w-48 h-72"
  };

  // Reset error state when props change
  useEffect(() => {
    setError(false);
    setImageLoaded(false);
  }, [imageUrl, thumbnailUrl]);

  // Function to validate image URL
  const isValidImageUrl = (url?: string | null) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const validImageUrl = !error && isValidImageUrl(imageUrl);
  const validThumbnailUrl = !error && isValidImageUrl(thumbnailUrl);
  const showImage = validImageUrl || validThumbnailUrl || !!fallbackImage;
  const imageToShow = size === "sm" && validThumbnailUrl ? thumbnailUrl : 
                      validImageUrl ? imageUrl : fallbackImage;

  const handleImageError = () => {
    console.log(`Image failed to load: ${imageToShow}`);
    setError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-md shadow-md transition-shadow hover:shadow-lg",
        "flex items-center justify-center bg-[#F1F1F1]",
        sizeClasses[size],
        className
      )}
    >
      {showImage ? (
        <>
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}
          <img
            src={imageToShow || ''}
            alt={`Cover of ${title}`}
            className={cn(
              "w-full h-full object-cover",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </>
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
