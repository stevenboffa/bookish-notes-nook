
import React, { useState, useEffect } from "react";
import { differenceInDays, parseISO, isValid } from "date-fns";
import { Book } from "@/types/books";
import { DatePickerField } from "./DatePickerField";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, BookCheck } from "lucide-react";

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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DatePickerField
          date={startDate}
          onDateChange={handleStartDateChange}
          label="Started Reading"
          placeholder="When did you start?"
        />
        <DatePickerField
          date={endDate}
          onDateChange={handleEndDateChange}
          label="Finished Reading"
          placeholder="When did you finish?"
        />
      </div>
      
      {readingDays !== null && (
        <div className="flex justify-center mt-2">
          <Badge 
            variant="outline" 
            className="px-3 py-1.5 text-sm bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 text-primary flex items-center gap-2"
          >
            <Clock className="h-4 w-4 text-primary/70" />
            You read this book in {readingDays} {readingDays === 1 ? 'day' : 'days'}!
          </Badge>
        </div>
      )}
      
      {book.status === "In progress" && startDate && !endDate && (
        <div className="flex justify-center mt-2">
          <Badge 
            variant="outline" 
            className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-200 text-blue-700 flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4 text-blue-500" />
            Currently reading
          </Badge>
        </div>
      )}
      
      {book.status === "Finished" && startDate && endDate && (
        <div className="flex justify-center mt-2">
          <Badge 
            variant="outline" 
            className="px-3 py-1.5 text-sm bg-gradient-to-r from-green-50 to-green-100/50 border-green-200 text-green-700 flex items-center gap-2"
          >
            <BookCheck className="h-4 w-4 text-green-500" />
            Completed
          </Badge>
        </div>
      )}
    </div>
  );
}
