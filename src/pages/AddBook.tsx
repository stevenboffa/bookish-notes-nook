
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookDetailView } from "@/components/BookDetailView";
import { NoteSection } from "@/components/NoteSection";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Plus,
  Save,
  Star,
  Tags,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const statusOptions = [
  { value: "Not started", icon: Clock },
  { value: "Reading", icon: BookOpen },
  { value: "Completed", icon: Save },
];

const genreOptions = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Science Fiction",
  "Fantasy",
  "Romance",
  "Thriller",
  "Biography",
  "History",
  "Science",
  "Self-Help",
  "Other",
];

const AddBook = () => {
  const { id } = useParams();
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    date_read: "",
    status: "Not started",
    rating: 0,
    image_url: "",
    thumbnail_url: "",
    is_favorite: false,
  });

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    onSuccess: (data) => {
      if (data) {
        setFormData(data);
        setSelectedDate(new Date(data.date_read));
      }
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!session?.user?.id) throw new Error("No user ID");

      const bookData = {
        ...data,
        user_id: session.user.id,
      };

      if (id) {
        const { error } = await supabase
          .from("books")
          .update(bookData)
          .eq("id", id);
        if (error) throw error;
        return bookData;
      } else {
        const { data: newBook, error } = await supabase
          .from("books")
          .insert([bookData])
          .select()
          .single();
        if (error) throw error;
        return newBook;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast({
        title: id ? "Book updated!" : "Book added!",
        description: id
          ? "Your book has been updated successfully."
          : "Your book has been added to your library.",
      });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleRatingChange = (newRating: number) => {
    setFormData((prev) => ({ ...prev, rating: newRating }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {id ? "Edit Book" : "Add New Book"}
            </h1>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <BookDetailView
                imageUrl={formData.image_url || "/placeholder.svg"}
                thumbnailUrl={formData.thumbnail_url}
                rating={formData.rating}
                onRatingChange={handleRatingChange}
              />
              
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => {
                    const Icon = status.icon;
                    return (
                      <Badge
                        key={status.value}
                        variant={
                          formData.status === status.value
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            status: status.value,
                          }))
                        }
                      >
                        <Icon className="w-4 h-4 mr-1" />
                        {status.value}
                      </Badge>
                    );
                  })}
                </div>

                <Progress
                  value={
                    formData.status === "Not started"
                      ? 0
                      : formData.status === "Reading"
                      ? 50
                      : 100
                  }
                  className="h-2"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <NoteSection bookId={id} />
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Collapsible
              open={isDetailsOpen}
              onOpenChange={setIsDetailsOpen}
              className="space-y-2"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <span className="text-sm font-medium">Additional Details</span>
                {isDetailsOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Tags className="w-4 h-4" />
                    Genre
                  </Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {genreOptions.map((genre) => (
                      <Badge
                        key={genre}
                        variant={
                          formData.genre === genre ? "default" : "outline"
                        }
                        className="cursor-pointer text-center"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, genre }))
                        }
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date Read
                  </Label>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-2",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Select Date</SheetTitle>
                        <SheetDescription>
                          Choose when you read this book
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-4">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            if (date) {
                              setFormData((prev) => ({
                                ...prev,
                                date_read: format(date, "yyyy-MM-dd"),
                              }));
                            }
                          }}
                          initialFocus
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        is_favorite: !prev.is_favorite,
                      }))
                    }
                    className={cn(
                      formData.is_favorite &&
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {formData.is_favorite
                      ? "Remove from favorites"
                      : "Add to favorites"}
                  </span>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default AddBook;
