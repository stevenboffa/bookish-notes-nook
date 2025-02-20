
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
  return (
    <header className={cn("w-full", className)}>
      {coverImage ? (
        <div className="relative h-[60vh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10" />
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 z-20 p-8 text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-shadow">
              {title}
            </h1>
            <div className="flex items-center gap-4 text-sm md:text-base">
              <span>{author}</span>
              <span>•</span>
              <time dateTime={date}>{date}</time>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 px-4 md:px-8 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {title}
            </h1>
            <div className="flex items-center gap-4 text-sm md:text-base text-muted-foreground">
              <span>{author}</span>
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
