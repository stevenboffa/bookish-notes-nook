
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type SortOption = "recently_added" | "title" | "author" | "rating";

interface SortingOptionsProps {
  currentSort: SortOption;
  onSortChange: (value: SortOption) => void;
  isReversed: boolean;
  onReverseChange: (reversed: boolean) => void;
}

export function SortingOptions({ 
  currentSort, 
  onSortChange,
  isReversed,
  onReverseChange
}: SortingOptionsProps) {
  return (
    <div className="flex items-center gap-1">
      <Select value={currentSort} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recently_added">Recently added</SelectItem>
          <SelectItem value="title">Title</SelectItem>
          <SelectItem value="author">Author</SelectItem>
          <SelectItem value="rating">Rating</SelectItem>
        </SelectContent>
      </Select>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        onClick={() => onReverseChange(!isReversed)}
        title={isReversed ? "Sort ascending" : "Sort descending"}
      >
        {isReversed ? (
          <ArrowUpNarrowWide className="h-4 w-4" />
        ) : (
          <ArrowDownNarrowWide className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
