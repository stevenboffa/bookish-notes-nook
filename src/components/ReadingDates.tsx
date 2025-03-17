
import React, { useState, useEffect } from "react";
import { differenceInDays, parseISO, isValid } from "date-fns";
import { Book } from "@/types/books";
import { DatePickerField } from "./DatePickerField";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ReadingDatesProps {
  book: Book;
  onUpdate: (updates: Partial<Book>) => void;
}

export function ReadingDates({ book, onUpdate }: ReadingDatesProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    book.startDate && isValid(parseISO(book.startDate)) 
      ? parseISO(book.startDate) 
      : undefined
  );
  
  const [endDate, setEndDate] = useState<Date | undefined>(
    book.endDate && isValid(parseISO(book.endDate)) 
      ? parseISO(book.endDate) 
      : undefined
  );

  const [readingDays, setReadingDays] = useState<number | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (startDate && endDate && startDate <= endDate) {
      setReadingDays(differenceInDays(endDate, startDate) + 1); // +1 to include both start and end days
    } else {
      setReadingDays(null);
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      onUpdate({ startDate: date.toISOString() });
    } else {
      onUpdate({ startDate: undefined });
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date) {
      onUpdate({ endDate: date.toISOString() });
    } else {
      onUpdate({ endDate: undefined });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <DatePickerField
          date={startDate}
          onDateChange={handleStartDateChange}
          label="Started Reading"
          placeholder="When did you start?"
          className="flex-1"
        />
        <DatePickerField
          date={endDate}
          onDateChange={handleEndDateChange}
          label="Finished Reading"
          placeholder="When did you finish?"
          className="flex-1"
        />
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 mt-1">
        {readingDays !== null && (
          <Badge 
            variant="outline" 
            className="px-2.5 py-1 text-xs bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 text-primary flex items-center gap-1.5"
          >
            <Clock className="h-3 w-3 text-primary/70" />
            {readingDays} {readingDays === 1 ? 'day' : 'days'} to read
          </Badge>
        )}
        
        {book.status === "In progress" && startDate && !endDate && (
          <Badge 
            variant="outline" 
            className="px-2.5 py-1 text-xs bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-200 text-blue-700 flex items-center gap-1.5"
          >
            <BookOpen className="h-3 w-3 text-blue-500" />
            Currently reading
          </Badge>
        )}
      </div>
    </div>
  );
}
