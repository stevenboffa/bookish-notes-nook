
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  published_at: string;
  reading_time: number;
  author: {
    email: string;
  };
};

export function BlogCard({ post }: { post: BlogPost }) {
  // Format author name
  const authorName = post.author.email === "hi@stevenboffa.com" ? "Steven B." : post.author.email;

  return (
    <Link to={`/blog/${post.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
        {post.cover_image && (
          <div className="aspect-[2/1] relative overflow-hidden bg-muted">
            <img
              src={post.cover_image}
              alt={post.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardHeader className="flex-1">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
          </div>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="rounded-full">
            {post.reading_time} min read
          </Badge>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground border-t bg-muted/50">
          <div className="flex justify-between w-full items-center">
            <span className="font-medium">{authorName}</span>
            <time dateTime={post.published_at} className="text-xs">
              {formatDistance(new Date(post.published_at), new Date(), { addSuffix: true })}
            </time>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
