
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {post.cover_image && (
        <div className="aspect-video relative overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2">
          <Link to={`/blog/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <div className="flex justify-between w-full items-center">
          <span>{post.author.email}</span>
          <div className="flex items-center gap-2">
            <span>{post.reading_time} min read</span>
            <span>•</span>
            <time dateTime={post.published_at}>
              {formatDistance(new Date(post.published_at), new Date(), { addSuffix: true })}
            </time>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
