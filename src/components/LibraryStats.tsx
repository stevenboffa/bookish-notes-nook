
import { Book } from "@/components/BookList";
import { BookOpen, Clock, CheckCircle, ListTodo, Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LibraryStatsProps {
  books: Book[];
}

export function LibraryStats({ books }: LibraryStatsProps) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  
  // Calculate stats
  const totalBooks = books.length;
  const readingBooks = books.filter(book => book.status === "In progress").length;
  const finishedBooks = books.filter(book => book.status === "Finished").length;
  const notStartedBooks = books.filter(book => book.status === "Not started").length;
  
  const toggleExpanded = () => setExpanded(!expanded);
  
  if (!expanded) {
    return (
      <div className="flex items-center gap-2 mt-1">
        <p className="text-sm text-text-muted">{totalBooks} books in your library</p>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-xs text-primary hover:text-primary/80 hover:bg-primary/5"
          onClick={toggleExpanded}
        >
          <Info className="h-3.5 w-3.5 mr-1" />
          See stats
        </Button>
      </div>
    );
  }
  
  return (
    <div className="mt-2 bg-gray-50 rounded-lg p-3 border animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Library Statistics</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-xs"
          onClick={toggleExpanded}
        >
          Hide
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
        <div className="flex items-center gap-2 bg-white p-2 rounded border">
          <div className="bg-primary/10 p-1.5 rounded-md">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{totalBooks}</p>
            <p className="text-xs text-text-muted">Total</p>
          </div>
        </div>
        
        <div 
          className="flex items-center gap-2 bg-white p-2 rounded border cursor-pointer hover:bg-gray-50"
          onClick={() => {
            setExpanded(false);
            navigate('/dashboard');
          }}
        >
          <div className="bg-amber-100 p-1.5 rounded-md">
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="font-medium">{readingBooks}</p>
            <p className="text-xs text-text-muted">Reading</p>
          </div>
        </div>
        
        <div 
          className="flex items-center gap-2 bg-white p-2 rounded border cursor-pointer hover:bg-gray-50"
          onClick={() => {
            setExpanded(false);
            navigate('/dashboard');
          }}
        >
          <div className="bg-green-100 p-1.5 rounded-md">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="font-medium">{finishedBooks}</p>
            <p className="text-xs text-text-muted">Finished</p>
          </div>
        </div>
        
        <div 
          className="flex items-center gap-2 bg-white p-2 rounded border cursor-pointer hover:bg-gray-50"
          onClick={() => {
            setExpanded(false);
            navigate('/dashboard');
          }}
        >
          <div className="bg-blue-100 p-1.5 rounded-md">
            <ListTodo className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium">{notStartedBooks}</p>
            <p className="text-xs text-text-muted">Not Started</p>
          </div>
        </div>
      </div>
    </div>
  );
}
