
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Book } from "@/types/books";
import { Button } from "@/components/ui/button";

interface QuoteSectionProps {
  book: Book;
  onUpdateBook: (book: Book) => void;
}

export function QuoteSection({ book, onUpdateBook }: QuoteSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [quoteContent, setQuoteContent] = useState("");

  const handleSaveQuote = () => {
    if (!quoteContent.trim()) {
      setIsAdding(false);
      return;
    }

    const newQuote = {
      id: crypto.randomUUID(),
      content: quoteContent,
      createdAt: new Date().toISOString(),
    };

    const updatedQuotes = [...(book.quotes || []), newQuote];
    onUpdateBook({ ...book, quotes: updatedQuotes });
    setQuoteContent("");
    setIsAdding(false);
  };

  const handleDeleteQuote = (quoteId: string) => {
    const updatedQuotes = (book.quotes || []).filter(
      (quote) => quote.id !== quoteId
    );
    onUpdateBook({ ...book, quotes: updatedQuotes });
  };

  return (
    <div className="my-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text">Quotes</h3>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Quote
        </Button>
      </div>

      {isAdding && (
        <div className="mb-4 border rounded-md p-4 bg-gray-50">
          <textarea
            value={quoteContent}
            onChange={(e) => setQuoteContent(e.target.value)}
            placeholder="Enter a memorable quote from this book..."
            className="w-full h-24 p-3 border rounded-md mb-2 text-sm"
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAdding(false);
                setQuoteContent("");
              }}
            >
              Cancel
            </Button>
            <Button variant="default" size="sm" onClick={handleSaveQuote}>
              Save Quote
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {book.quotes && book.quotes.length > 0 ? (
          book.quotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-accent/10 p-4 rounded-md border border-accent/20 relative"
            >
              <p className="text-text italic">"{quote.content}"</p>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-text-muted">
                  Added on {new Date(quote.createdAt).toLocaleDateString()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs hover:bg-accent/20"
                  onClick={() => handleDeleteQuote(quote.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-text-muted text-sm italic">
            No quotes added yet. Add your first quote by clicking the button
            above.
          </p>
        )}
      </div>
    </div>
  );
}
