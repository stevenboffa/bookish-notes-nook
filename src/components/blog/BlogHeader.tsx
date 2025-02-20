
import { cn } from "@/lib/utils";

type BlogHeaderProps = {
  className?: string;
  coverImage?: string | null;
  title: string;
  author: string;
  date: string;
  readingTime: number;
};

export function BlogHeader({ className, coverImage, title, author, date, readingTime }: BlogHeaderProps) {
  // Format author name
  const authorName = author === "hi@stevenboffa.com" ? "Steven B." : author;

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
              <div className="flex items-center gap-4 text-sm md:text-base text-white/90">
                <span className="font-medium">{authorName}</span>
                <span>•</span>
                <time dateTime={date}>{date}</time>
                <span>•</span>
                <span>{readingTime} min read</span>
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
            <div className="flex items-center gap-4 text-sm md:text-base text-muted-foreground">
              <span className="font-medium">{authorName}</span>
              <span>•</span>
              <time dateTime={date}>{date}</time>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
