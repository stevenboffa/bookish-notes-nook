
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { BookDetailView } from "@/components/BookDetailView";
import { BookList, Book } from "@/components/BookList";
import { BookRecommendations } from "@/components/friends/BookRecommendations";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { BookFilters } from "@/components/BookFilters";
import { Plus, BookOpen } from "lucide-react";
import { BookCategoryCard } from "@/components/BookCategoryCard";
import { Note, Quote } from "@/types/books";

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("recent");
  const [isSearching, setIsSearching] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchBooks();
  }, [session?.user?.id]);

  useEffect(() => {
    filterBooks();
  }, [activeTab, books, searchTerm, selectedGenre, sortBy]);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("books")
        .select("*, notes(*), quotes(*)")
        .eq("user_id", session?.user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedBooks: Book[] = (data || []).map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre || "Unknown",
        dateRead: book.date_read,
        rating: book.rating || 0,
        status: book.status || "Not started",
        isFavorite: book.is_favorite || false,
        imageUrl: book.image_url || null,
        thumbnailUrl: book.thumbnail_url || null,
        format: book.format || "physical_book",
        notes: book.notes as Note[],
        quotes: book.quotes as Quote[],
      }));

      setBooks(formattedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch books. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = [...books];

    // Filter by tab (reading status)
    if (activeTab !== "all") {
      filtered = filtered.filter((book) => {
        if (activeTab === "in-progress") return book.status === "In Progress";
        if (activeTab === "finished") return book.status === "Finished";
        if (activeTab === "future-reads") return book.status === "Future Reads";
        if (activeTab === "not-started") return book.status === "Not started";
        return true;
      });
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term)
      );
    }

    // Filter by genre
    if (selectedGenre) {
      filtered = filtered.filter((book) => book.genre === selectedGenre);
    }

    // Sort books
    filtered.sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "author") return a.author.localeCompare(b.author);
      if (sortBy === "recent") {
        // Default sort, already sorted by created_at in the query
        return 0;
      }
      return 0;
    });

    setFilteredBooks(filtered);
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
  };

  const handleAddBook = () => {
    navigate("/add-book");
  };

  const handleReturn = () => {
    setSelectedBook(null);
    fetchBooks(); // Refresh books when returning from detail view
  };

  const renderCategories = () => {
    const inProgressCount = books.filter(
      (book) => book.status === "In Progress"
    ).length;
    const finishedCount = books.filter(
      (book) => book.status === "Finished"
    ).length;
    const futureReadsCount = books.filter(
      (book) => book.status === "Future Reads"
    ).length;
    const notStartedCount = books.filter(
      (book) => book.status === "Not started"
    ).length;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <BookCategoryCard
          title="In Progress"
          icon={<BookOpen className="text-blue-500" />}
          count={inProgressCount}
          onClick={() => setActiveTab("in-progress")}
          isActive={activeTab === "in-progress"}
        />
        <BookCategoryCard
          title="Finished"
          icon={<BookOpen className="text-green-500" />}
          count={finishedCount}
          onClick={() => setActiveTab("finished")}
          isActive={activeTab === "finished"}
        />
        <BookCategoryCard
          title="Future Reads"
          icon={<BookOpen className="text-purple-500" />}
          count={futureReadsCount}
          onClick={() => setActiveTab("future-reads")}
          isActive={activeTab === "future-reads"}
        />
        <BookCategoryCard
          title="Not Started"
          icon={<BookOpen className="text-gray-500" />}
          count={notStartedCount}
          onClick={() => setActiveTab("not-started")}
          isActive={activeTab === "not-started"}
        />
      </div>
    );
  };

  const handleAddToLibrary = async (book: Book) => {
    try {
      const { error } = await supabase.from("books").insert({
        title: book.title,
        author: book.author,
        genre: book.genre,
        status: "Future Reads",
        date_read: new Date().toISOString().split("T")[0],
        user_id: session?.user?.id,
        image_url: book.imageUrl,
        thumbnail_url: book.thumbnailUrl,
        format: book.format || "physical_book",
      });

      if (error) throw error;

      toast({
        title: "Book Added",
        description: `${book.title} has been added to your library.`,
      });

      fetchBooks();
    } catch (error) {
      console.error("Error adding book:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add book to your library.",
      });
    }
  };

  if (isMobile && selectedBook) {
    return (
      <div className="container mx-auto px-4 py-6">
        <BookDetailView
          book={selectedBook}
          onReturn={handleReturn}
          isMobile={true}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Books</h1>
        <Button onClick={handleAddBook}>
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </div>

      <BookRecommendations onAddToLibrary={handleAddToLibrary} />

      {renderCategories()}

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Books</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="finished">Finished</TabsTrigger>
            <TabsTrigger value="future-reads">Future Reads</TabsTrigger>
          </TabsList>
        </div>

        <BookFilters
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          genres={Array.from(new Set(books.map((book) => book.genre)))}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          sortBy={sortBy}
          onSortChange={setSortBy}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
        />

        <TabsContent value={activeTab} className="mt-0">
          <div className="flex flex-col md:flex-row gap-6">
            <div className={`${!isMobile && selectedBook ? "w-1/2" : "w-full"}`}>
              <BookList
                books={filteredBooks}
                onBookSelect={handleBookSelect}
                isLoading={isLoading}
                selectedBookId={selectedBook?.id}
              />
            </div>

            {!isMobile && selectedBook && (
              <div className="w-1/2 sticky top-20">
                <BookDetailView
                  book={selectedBook}
                  onReturn={handleReturn}
                  isInReadingList={activeTab === "in-progress"}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
