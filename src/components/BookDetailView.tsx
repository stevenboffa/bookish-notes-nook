import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NoteSection } from "./NoteSection";
import { Rating } from "./Rating";
import { Checkbox } from "./ui/checkbox";
import { Book } from "./BookList";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().min(1, "Genre is required"),
  dateRead: z.string().optional(),
  rating: z.number().min(0).max(10),
  status: z.enum(["Not started", "In Progress", "Finished"]),
  notes: z.array(z.object({ content: z.string() })).optional(),
  isFavorite: z.boolean().optional(),
});

type BookFormValues = z.infer<typeof bookSchema>;

interface BookDetailViewProps {
  book: Book | null;
  onSave: (book: Book) => void;
  onClose: () => void;
}

export const BookDetailView = ({ book, onSave, onClose }: BookDetailViewProps) => {
  const isNewBook = !book?.id;
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title || "",
      author: book?.author || "",
      genre: book?.genre || "",
      dateRead: book?.dateRead || "",
      rating: book?.rating || 0,
      status: book?.status || "Not started",
      isFavorite: book?.isFavorite || false,
    },
  });

  const onSubmit = (data: BookFormValues) => {
    onSave({
      id: book?.id || "",
      title: data.title,
      author: data.author,
      genre: data.genre,
      dateRead: data.dateRead || "",
      rating: data.rating,
      status: data.status,
      isFavorite: data.isFavorite || false,
      notes: book?.notes || [],
    });
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {isNewBook ? (
            <>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter book title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter book genre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{book?.title}</h2>
              <p className="text-gray-600">by {book?.author}</p>
              <p className="text-gray-600">Genre: {book?.genre}</p>
            </div>
          )}

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <Rating
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFavorite"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Add to favorites</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select
                    className="w-full p-2 border rounded"
                    {...field}
                  >
                    <option value="Not started">Not started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Finished">Finished</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateRead"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Read</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isNewBook && book && (
            <NoteSection book={book} onUpdateBook={onSave} />
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};