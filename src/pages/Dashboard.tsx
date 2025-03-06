import { useState, useEffect } from "react";
import { BookList, type Book } from "@/components/BookList";
import { BookFilters } from "@/components/BookFilters";
import { BookDetailView } from "@/components/BookDetailView";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { type SortOption } from "@/components/SortingOptions";
import { Collection } from "@/types/books";
import { CollectionManager } from "@/components/CollectionManager";
import { toast } from "sonner";

const Dashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentSort, setCurrentSort] = useState<SortOption>("recently_added");
  const [isReversed, setIsReversed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const { session } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (session?.user?.id) {
      fetchBooks();
      fetchCollections();
    }
  }, [session?.user?.id]);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          notes (
            id,
            content,
            created_at,
            page_number,
            timestamp_seconds,
            chapter,
            category,
            is_pinned,
            reading_progress
          ),
          quotes (
            id,
            content,
            created_at
          )
        `)
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedBooks = data.map((book: any) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre || 'Unknown',
        dateRead: book.date_read,
        rating: Number(book.rating) || 0,
        status: book.status === 'In Progress' ? 'In progress' : book.status || 'Not started',
        isFavorite: book.is_favorite || false,
        imageUrl: book.image_url || null,
        thumbnailUrl: book.thumbnail_url || null,
        format: book.format || 'physical_book',
        description: book.description || '',
        collections: book.collections || [],
        notes: book.notes.map((note: any) => ({
          id: note.id,
          content: note.content,
          createdAt: note.created_at,
          pageNumber: note.page_number,
          timestampSeconds: note.timestamp_seconds,
          chapter: note.chapter,
          category: note.category,
          isPinned: note.is_pinned,
          readingProgress: note.reading_progress,
        })),
        quotes: book.quotes.map((quote: any) => ({
          id: quote.id,
          content: quote.content,
          createdAt: quote.created_at,
        })) || [],
      }));

      setBooks(formattedBooks);
      
      if (selectedBook) {
        const updatedSelectedBook = formattedBooks.find(book => book.id === selectedBook.id);
        if (updatedSelectedBook) {
          setSelectedBook(updatedSelectedBook);
        }
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Error loading books: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      if (!session?.user?.id) return;
      
      // @ts-ignore - collections table exists but TypeScript doesn't know about it yet
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', session.user.id)
        .order('position', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedCollections = data.map((collection: any) => ({
          id: collection.id,
          name: collection.name,
          createdAt: collection.created_at,
          position: collection.position,
        }));
        
        setCollections(formattedCollections);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Error loading collections');
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;

      setBooks(books.filter((book) => book.id !== bookId));
      if (selectedBook?.id === bookId) {
        setSelectedBook(null);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
  };

  const handleUpdateBook = async (updatedBook: Book) => {
    try {
      console.log('Updating book with status:', updatedBook.status);
      console.log('Collections to save:', updatedBook.collections);
      
      const status = updatedBook.status === 'In progress' ? 'In Progress' : updatedBook.status;
      
      // Ensure collections is an array
      const collections = Array.isArray(updatedBook.collections) ? updatedBook.collections : [];
      
      // Log the payload we're sending to Supabase
      const updatePayload = {
        title: updatedBook.title,
        author: updatedBook.author,
        genre: updatedBook.genre,
        status: status,
        rating: updatedBook.rating,
        date_read: updatedBook.dateRead,
        is_favorite: updatedBook.isFavorite,
        format: updatedBook.format,
        description: updatedBook.description,
        collections: collections
      };
      
      console.log('Update payload:', updatePayload);
      
      const { error, data } = await supabase
        .from('books')
        .update(updatePayload)
        .eq('id', updatedBook.id)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        toast.error('Failed to update book: ' + error.message);
        throw error;
      }

      console.log('Supabase response:', data);
      
      // Success notification
      toast.success('Book updated successfully');

      // Update the local state
      setBooks(books.map(book => 
        book.id === updatedBook.id ? updatedBook : book
      ));
      
      setSelectedBook(updatedBook);
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Error updating book: ' + (error as Error).message);
    }
  };

  const handleAddCollection = async (name: string): Promise<string> => {
    if (!session?.user?.id) {
      throw new Error("You must be logged in to create collections");
    }
    
    try {
      // Find the highest position
      const maxPosition = collections.reduce(
        (max, collection) => Math.max(max, collection.position || 0), 
        0
      );
      
      const newCollection = {
        name,
        user_id: session.user.id,
        position: maxPosition + 1
      };
      
      // @ts-ignore - collections table exists but TypeScript doesn't know about it yet
      const { data, error } = await supabase
        .from('collections')
        .insert(newCollection)
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("Failed to create collection");
      }
      
      const createdCollection: Collection = {
        id: data[0].id,
        name: data[0].name, 
        createdAt: data[0].created_at,
        position: data[0].position,
      };
      
      setCollections([...collections, createdCollection]);
      
      return createdCollection.id;
    } catch (error) {
      console.error("Error creating collection:", error);
      toast.error("Failed to create collection");
      throw error;
    }
  };

  const handleUpdateCollections = (updatedCollections: Collection[]) => {
    setCollections(updatedCollections);
  };

  const handleSelectCollection = (collectionId: string | null) => {
    setActiveCollection(collectionId);
  };

  const handleSortChange = (sortOption: SortOption) => {
    setCurrentSort(sortOption);
    sortBooks(sortOption, isReversed);
  };
  
  const handleReverseChange = (reversed: boolean) => {
    setIsReversed(reversed);
    sortBooks(currentSort, reversed);
  };
  
  const sortBooks = (sortOption: SortOption, reversed: boolean) => {
    const sortedBooks = [...books];
    
    switch (sortOption) {
      case "title":
        sortedBooks.sort((a, b) => {
          const result = a.title.localeCompare(b.title);
          return reversed ? -result : result;
        });
        break;
      case "author":
        sortedBooks.sort((a, b) => {
          const result = a.author.localeCompare(b.author);
          return reversed ? -result : result;
        });
        break;
      case "rating":
        sortedBooks.sort((a, b) => {
          const result = b.rating - a.rating;
          return reversed ? -result : result;
        });
        break;
      case "recently_added":
      default:
        if (reversed) {
          sortedBooks.reverse();
        }
        break;
    }
    
    setBooks(sortedBooks);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">No books yet</h2>
        <p className="text-gray-600 mb-6">Start by adding your first book to your collection</p>
        <button
          onClick={() => navigate('/add-book')}
          className="bg-black text-white px-6 py-2 rounded-full hover:bg-black/90 transition-colors"
        >
          Add your first book
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Not sticky */}
        <div className="bg-white border-b">
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-text">My Books</h1>
              <p className="text-sm text-text-muted">{books.length} books in your collection</p>
            </div>
            <Button
              onClick={() => navigate('/add-book')}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Book
            </Button>
          </div>
        </div>
        
        {/* Sticky elements: Collections and Filters */}
        <div className="sticky top-0 z-20 bg-white shadow-sm">
          <div className="px-4 pt-2 pb-0">
            <CollectionManager 
              collections={collections}
              onAddCollection={handleAddCollection}
              onSelectCollection={handleSelectCollection}
              activeCollection={activeCollection}
              onUpdateCollections={handleUpdateCollections}
            />
          </div>
          <BookFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            currentSort={currentSort}
            onSortChange={handleSortChange}
            isReversed={isReversed}
            onReverseChange={handleReverseChange}
          />
        </div>
        
        {/* Book List */}
        <div className="flex-1 overflow-auto pb-20">
          <div className="pt-4 px-2">
            <BookList
              books={books}
              selectedBook={selectedBook}
              onSelectBook={handleSelectBook}
              onDeleteBook={handleDeleteBook}
              activeFilter={activeFilter}
              activeCollection={activeCollection || undefined}
            />
          </div>
        </div>
      </div>
      
      {isMobile ? (
        <Sheet open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
          <SheetContent 
            side="bottom" 
            className="h-[100dvh] p-0 mt-0"
          >
            {selectedBook && (
              <BookDetailView
                book={selectedBook}
                onSave={handleUpdateBook}
                onClose={() => setSelectedBook(null)}
                collections={collections}
              />
            )}
          </SheetContent>
        </Sheet>
      ) : (
        selectedBook && (
          <div className="w-1/3 border-l border-gray-200 h-screen sticky top-0">
            <BookDetailView
              book={selectedBook}
              onSave={handleUpdateBook}
              onClose={() => setSelectedBook(null)}
              collections={collections}
            />
          </div>
        )
      )}
    </div>
  );
};

export default Dashboard;
