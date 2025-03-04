
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
    <div className="flex items-center gap-2">
      <Select value={currentSort} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger className="h-9 text-xs md:text-sm bg-white border-gray-200 rounded-md shadow-sm min-w-[130px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recently_added" className="text-sm">Recently added</SelectItem>
          <SelectItem value="title" className="text-sm">Title</SelectItem>
          <SelectItem value="author" className="text-sm">Author</SelectItem>
          <SelectItem value="rating" className="text-sm">Rating</SelectItem>
        </SelectContent>
      </Select>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="h-9 bg-white shadow-sm border-gray-200 hover:bg-gray-50 transition-all"
        onClick={() => onReverseChange(!isReversed)}
        title={isReversed ? "Sort ascending" : "Sort descending"}
      >
        {isReversed ? (
          <ArrowUpNarrowWide className="h-4 w-4 text-primary" />
        ) : (
          <ArrowDownNarrowWide className="h-4 w-4 text-primary" />
        )}
      </Button>
    </div>
  );
}
