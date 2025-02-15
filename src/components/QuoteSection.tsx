
import { useState } from "react";
import { Book } from "./BookList";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface QuoteSectionProps {
  book: Book;
  onUpdateBook: (book: Book) => void;
}

export function QuoteSection({ book, onUpdateBook }: QuoteSectionProps) {
  const [newQuote, setNewQuote] = useState("");
  const [localQuotes, setLocalQuotes] = useState(book.quotes || []);

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

      // Update local state immediately
      setLocalQuotes(prevQuotes => [newQuoteObject, ...prevQuotes]);

      // Update parent component
      const updatedBook = {
        ...book,
        quotes: [newQuoteObject, ...book.quotes],
      };

      onUpdateBook(updatedBook);
      setNewQuote("");
    } catch (error) {
      console.error('Error adding quote:', error);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="space-y-4">
        <div className="space-y-2">
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
                className="p-3 bg-white rounded-lg shadow animate-fade-in"
              >
                <p className="text-sm whitespace-pre-wrap">{quote.content}</p>
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
