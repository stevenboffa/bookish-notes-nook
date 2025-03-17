
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Bookmark, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Genre categories and their respective genres
const genreCategories = [
  {
    name: "Fiction",
    genres: [
      "Contemporary Fiction",
      "Literary Fiction",
      "Mystery & Thriller",
      "Science Fiction",
      "Fantasy",
      "Horror",
      "Romance",
      "Historical Fiction",
      "Young Adult",
      "Dystopian",
    ],
  },
  {
    name: "Non-Fiction",
    genres: [
      "Biography & Memoir",
      "Self-Help & Personal Development",
      "History",
      "Science & Technology",
      "Philosophy",
      "Psychology",
      "Business & Economics",
      "Travel",
      "True Crime",
      "Politics & Current Affairs",
    ],
  },
  {
    name: "Other",
    genres: [
      "Poetry",
      "Classics",
      "Comics & Graphic Novels",
      "Essays",
      "Short Stories",
      "Religion & Spirituality",
      "Art & Photography",
      "Cookbooks & Food",
      "Children's Books",
    ],
  },
];

// Flatten all genres into a single array for validation
const allGenres = genreCategories.flatMap(category => category.genres);

export function FavoriteGenres() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();

  // Fetch the user's current favorite genres when the dialog opens
  useEffect(() => {
    if (isOpen) {
      const fetchFavoriteGenres = async () => {
        try {
          setIsLoading(true);
          if (!session?.user) return;

          const { data, error } = await supabase
            .from("profiles")
            .select("favorite_genres")
            .eq("id", session.user.id)
            .single();

          if (error) throw error;

          // Filter out any invalid genres that might be in the database
          const validGenres = (data.favorite_genres || []).filter(
            (genre: string) => allGenres.includes(genre)
          );
          
          setSelectedGenres(validGenres);
        } catch (error) {
          console.error("Error fetching favorite genres:", error);
          toast({
            title: "Error",
            description: "Could not load your favorite genres. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchFavoriteGenres();
    }
  }, [isOpen, session]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const saveGenres = async () => {
    try {
      setIsSaving(true);
      if (!session?.user) return;

      const { error } = await supabase
        .from("profiles")
        .update({ favorite_genres: selectedGenres })
        .eq("id", session.user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your favorite genres have been updated.",
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving favorite genres:", error);
      toast({
        title: "Error",
        description: "Could not save your favorite genres. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Genre pill component
  const GenrePill = ({ genre }: { genre: string }) => {
    const isSelected = selectedGenres.includes(genre);
    return (
      <Button
        type="button"
        variant="outline"
        className={`rounded-full px-4 py-2 h-auto text-sm font-medium transition-colors ${
          isSelected 
            ? 'bg-[#9b87f5] text-white border-[#9b87f5] hover:bg-[#7E69AB] hover:border-[#7E69AB]' 
            : 'bg-background border-input hover:bg-accent/30'
        }`}
        onClick={() => toggleGenre(genre)}
      >
        {genre}
      </Button>
    );
  };

  return (
    <>
      <Button 
        className="w-full flex items-center justify-center gap-2 py-6 bg-gradient-to-r from-[#9b87f5] to-[#b199ff] text-white hover:from-[#8A78DA] hover:to-[#9F89E5] shadow-md hover:shadow-lg transition-all"
        onClick={() => setIsOpen(true)}
      >
        <Bookmark className="h-5 w-5" />
        <span className="text-base font-medium">My Favorite Genres</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">What genres do you usually like to read?</DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-8 py-4">
              {genreCategories.map((category) => (
                <div key={category.name} className="space-y-4">
                  <h3 className="font-medium text-lg text-muted-foreground">{category.name} genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.genres.map((genre) => (
                      <GenrePill key={genre} genre={genre} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-2 text-sm text-muted-foreground">
                Selected: {selectedGenres.length} genres
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)} 
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={saveGenres} 
              disabled={isSaving} 
              className="w-full sm:w-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
