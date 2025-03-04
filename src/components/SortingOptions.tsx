
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type SortOption = "recently_added" | "title" | "author" | "rating";

interface SortingOptionsProps {
  currentSort: SortOption;
  onSortChange: (value: SortOption) => void;
}

export function SortingOptions({ currentSort, onSortChange }: SortingOptionsProps) {
  return (
    <div className="w-48">
      <Select value={currentSort} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recently_added">Recently added</SelectItem>
          <SelectItem value="title">Title (A-Z)</SelectItem>
          <SelectItem value="author">Author (A-Z)</SelectItem>
          <SelectItem value="rating">Rating (high to low)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
