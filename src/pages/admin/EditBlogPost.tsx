
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

export default function EditBlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    cover_image: "",
    status: "draft",
    meta_description: "",
    meta_keywords: "",
    reading_time: "5"
  });

  const { isLoading: isLoadingPost } = useQuery({
    queryKey: ["admin-blog-post", id],
    queryFn: async () => {
      if (isNew) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .single();

      if (!profile?.is_admin) {
        navigate("/blog");
        toast.error("You don't have access to this page");
        return null;
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .select()
        .eq("id", id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title,
        excerpt: data.excerpt || "",
        content: data.content,
        cover_image: data.cover_image || "",
        status: data.status,
        meta_description: data.meta_description || "",
        meta_keywords: data.meta_keywords?.join(", ") || "",
        reading_time: data.reading_time?.toString() || "5"
      });

      return data;
    },
    enabled: !isNew,
  });

  const { mutate: savePost, isPending } = useMutation({
    mutationFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) throw new Error("Not authenticated");

      const post = {
        title: formData.title,
        excerpt: formData.excerpt || null,
        content: formData.content,
        cover_image: formData.cover_image || null,
        status: formData.status,
        meta_description: formData.meta_description || null,
        meta_keywords: formData.meta_keywords ? formData.meta_keywords.split(",").map(k => k.trim()) : null,
        reading_time: parseInt(formData.reading_time),
        published_at: formData.status === "published" ? new Date().toISOString() : null,
        author_id: session.session.user.id
      };

      if (isNew) {
        const { data, error } = await supabase
          .rpc("generate_unique_slug", { title: formData.title })
          .single();
        
        if (error) throw error;
        
        const { error: insertError } = await supabase
          .from("blog_posts")
          .insert({ ...post, slug: data });

        if (insertError) throw insertError;
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .update(post)
          .eq("id", id);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(isNew ? "Post created successfully" : "Post updated successfully");
      navigate("/admin/posts");
    },
    onError: () => {
      toast.error("Failed to save post");
    },
  });

  if (isLoadingPost) {
    return (
      <div className="container max-w-4xl mx-auto p-4 animate-pulse">
        <div className="space-y-6">
          <div className="h-8 w-1/4 bg-muted rounded" />
          <div className="h-12 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{isNew ? "New Post" : "Edit Post"}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/posts")}>
            Cancel
          </Button>
          <Button onClick={() => savePost()} disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content (HTML)</Label>
          <Textarea
            id="content"
            value={formData.content}
            className="min-h-[300px] font-mono"
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cover_image">Cover Image URL</Label>
          <Input
            id="cover_image"
            value={formData.cover_image}
            onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reading_time">Reading Time (minutes)</Label>
            <Input
              id="reading_time"
              type="number"
              value={formData.reading_time}
              onChange={(e) => setFormData(prev => ({ ...prev, reading_time: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta_description">Meta Description</Label>
          <Textarea
            id="meta_description"
            value={formData.meta_description}
            onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta_keywords">Meta Keywords (comma-separated)</Label>
          <Input
            id="meta_keywords"
            value={formData.meta_keywords}
            onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
          />
        </div>
      </form>
    </div>
  );
}
