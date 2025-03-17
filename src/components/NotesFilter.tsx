
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Filter } from "lucide-react";

export type NotesFilterOption = "all" | "overview" | "quotes" | "insights" | "questions" | "character-profiles" | "images";

interface NotesFilterProps {
  currentFilter: NotesFilterOption;
  onFilterChange: (value: NotesFilterOption) => void;
  currentSort: "newest" | "oldest";
  onSortChange: (value: "newest" | "oldest") => void;
}

export function NotesFilter({ 
  currentFilter, 
  onFilterChange,
  currentSort,
  onSortChange
}: NotesFilterProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex-1 flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={currentFilter} onValueChange={(value) => onFilterChange(value as NotesFilterOption)}>
          <SelectTrigger className="h-9 text-xs md:text-sm bg-white border-gray-100 rounded-lg shadow-sm">
            <SelectValue placeholder="Filter notes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-sm">All notes</SelectItem>
            <SelectItem value="overview" className="text-sm">Overview</SelectItem>
            <SelectItem value="quotes" className="text-sm">Quotes</SelectItem>
            <SelectItem value="insights" className="text-sm">Insights</SelectItem>
            <SelectItem value="questions" className="text-sm">Questions</SelectItem>
            <SelectItem value="character-profiles" className="text-sm">Character Profiles</SelectItem>
            <SelectItem value="images" className="text-sm">With images</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="h-9 bg-white shadow-sm border-gray-100 hover:bg-gray-50 transition-all rounded-lg"
        onClick={() => onSortChange(currentSort === "newest" ? "oldest" : "newest")}
        title={currentSort === "newest" ? "Show oldest first" : "Show newest first"}
      >
        {currentSort === "newest" ? (
          <ArrowDownNarrowWide className="h-4 w-4 text-primary" />
        ) : (
          <ArrowUpNarrowWide className="h-4 w-4 text-primary" />
        )}
      </Button>
    </div>
  );
}
