
import { Filter, Clock, FileText, Tag } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

type NoteFilter = {
  type?: string;
  chapter?: string;
  timestampStart?: number;
  timestampEnd?: number;
};

interface FilterNotesProps {
  filter: NoteFilter;
  onFilterChange: (filter: NoteFilter) => void;
  noteTypes: string[];
  chapters: string[];
  bookFormat: string | undefined;
  hasFiltersApplied: boolean;
  onClearFilters: () => void;
}

export function FilterNotes({
  filter,
  onFilterChange,
  noteTypes,
  chapters,
  bookFormat,
  hasFiltersApplied,
  onClearFilters,
}: FilterNotesProps) {
  const handleTypeChange = (value: string) => {
    onFilterChange({ ...filter, type: value || undefined });
  };

  const handleChapterChange = (value: string) => {
    onFilterChange({ ...filter, chapter: value || undefined });
  };

  const handleTimestampStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onFilterChange({ ...filter, timestampStart: value });
  };

  const handleTimestampEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onFilterChange({ ...filter, timestampEnd: value });
  };

  // Format seconds to MM:SS
  const formatSeconds = (seconds?: number) => {
    if (seconds === undefined) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center gap-2 h-8 px-3 ${hasFiltersApplied ? 'bg-primary/10 text-primary border-primary/20' : ''}`}
          >
            <Filter className="h-4 w-4" />
            <span>Filter Notes</span>
            {hasFiltersApplied && (
              <Badge variant="secondary" className="ml-1 bg-primary/20 text-primary h-5 px-1">
                {Object.values(filter).filter(Boolean).length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4 p-1">
            <h3 className="font-medium">Filter Notes</h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="note-type">Note Type</Label>
              </div>
              <Select value={filter.type || ""} onValueChange={handleTypeChange}>
                <SelectTrigger id="note-type">
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any type</SelectItem>
                  {noteTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {chapters.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="chapter">Chapter</Label>
                </div>
                <Select value={filter.chapter || ""} onValueChange={handleChapterChange}>
                  <SelectTrigger id="chapter">
                    <SelectValue placeholder="Any chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any chapter</SelectItem>
                    {chapters.map((chapter) => (
                      <SelectItem key={chapter} value={chapter}>
                        {chapter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {bookFormat === "audiobook" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Label>Timestamp Range (minutes)</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="From"
                    value={filter.timestampStart !== undefined ? Math.floor(filter.timestampStart / 60) : ""}
                    onChange={handleTimestampStartChange}
                    className="w-full"
                    min="0"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    placeholder="To"
                    value={filter.timestampEnd !== undefined ? Math.floor(filter.timestampEnd / 60) : ""}
                    onChange={handleTimestampEndChange}
                    className="w-full"
                    min="0"
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {filter.timestampStart !== undefined && (
                    <span>From {formatSeconds(filter.timestampStart)}</span>
                  )}
                  {filter.timestampStart !== undefined && filter.timestampEnd !== undefined && (
                    <span> to </span>
                  )}
                  {filter.timestampEnd !== undefined && (
                    <span>{formatSeconds(filter.timestampEnd)}</span>
                  )}
                </div>
              </div>
            )}

            {hasFiltersApplied && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2 text-sm h-8"
                onClick={onClearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Clear all filters
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
