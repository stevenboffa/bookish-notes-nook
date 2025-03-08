import { useState, useEffect } from "react";
import { Book } from "@/types/books";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Trash2 } from "lucide-react";

interface QuoteSectionProps {
  book: Book;
  onUpdateBook: (book: Book) => void;
}

export function QuoteSection({ book, onUpdateBook }: QuoteSectionProps) {
  const [newQuote, setNewQuote] = useState("");
  const [localQuotes, setLocalQuotes] = useState(book.quotes || []);

  useEffect(() => {
    setLocalQuotes(book.quotes || []);
  }, [book.quotes]);

  const handleAddQuote = async () => {
    if (!newQuote.trim()) return;

    try {
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .insert({
          content: newQuote,
          book_id: book.id,
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      const newQuoteObject = {
        id: quoteData.id,
        content: quoteData.content,
        createdAt: quoteData.created_at,
      };

      const updatedQuotes = [newQuoteObject, ...localQuotes];
      setLocalQuotes(updatedQuotes);

      const updatedBook = {
        ...book,
        quotes: updatedQuotes,
      };

      onUpdateBook(updatedBook);
      setNewQuote("");
    } catch (error) {
      console.error('Error adding quote:', error);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quoteId);

      if (error) throw error;

      const updatedQuotes = localQuotes.filter(quote => quote.id !== quoteId);
      setLocalQuotes(updatedQuotes);

      const updatedBook = {
        ...book,
        quotes: updatedQuotes,
      };

      onUpdateBook(updatedBook);
    } catch (error) {
      console.error('Error deleting quote:', error);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground italic">Save the words that stood out to you.</p>
          <div className="flex flex-col space-y-2">
            <Textarea
              value={newQuote}
              onChange={(e) => setNewQuote(e.target.value)}
              placeholder="Add a quote..."
              className="min-h-[100px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.metaKey) {
                  handleAddQuote();
                }
              }}
            />
            <Button onClick={handleAddQuote}>Add Quote</Button>
          </div>
          <div className="space-y-2 mt-4">
            {localQuotes.map((quote) => (
              <div
                key={quote.id}
                className="p-3 bg-white rounded-lg shadow animate-fade-in group relative"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteQuote(quote.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
                <p className="text-sm whitespace-pre-wrap pr-8">{quote.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
