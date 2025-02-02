import { useState } from "react";
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
  const fallbackImage = getBookCoverFallback(genre);
  
  const sizeClasses = {
    sm: "w-16 h-24",
    md: "w-32 h-48",
    lg: "w-48 h-72"
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-md shadow-md transition-shadow hover:shadow-lg",
      sizeClasses[size],
      className
    )}>
      <img
        src={error ? fallbackImage : (size === "sm" ? thumbnailUrl : imageUrl) || fallbackImage}
        alt={`Cover of ${title}`}
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
}