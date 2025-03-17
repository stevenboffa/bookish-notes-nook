
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface DatePickerFieldProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  label: string;
  placeholder?: string;
  className?: string;
  compact?: boolean;
}

export function DatePickerField({
  date,
  onDateChange,
  label,
  placeholder = "Select date",
  className,
  compact = false,
}: DatePickerFieldProps) {
  return (
    <div className={cn("w-full", className)}>
      <Label className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        compact && "text-xs"
      )}>
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal relative text-sm mt-1.5",
              compact ? "h-7 px-2 py-1 text-xs" : "h-8 px-2.5 py-1.5",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className={cn(
              "opacity-70",
              compact ? "mr-1 h-3 w-3" : "mr-1.5 h-3.5 w-3.5"
            )} />
            {date 
              ? format(date, compact ? "MMM d" : "MMM d, yyyy") 
              : placeholder
            }
            {date && (
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "p-0 absolute right-1 rounded-full hover:bg-gray-200",
                  compact ? "h-4 w-4" : "h-5 w-5"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onDateChange(undefined);
                }}
              >
                <X className={cn(compact ? "h-2.5 w-2.5" : "h-3 w-3")} />
              </Button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            className="p-3 pointer-events-auto"
            disabled={(date) => date > new Date()} // Disable future dates
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
