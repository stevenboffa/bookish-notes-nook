
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortingOptions, type SortOption } from "./SortingOptions";

interface BookFiltersProps {
  activeFilter: string;
  onFilterChange: (value: string) => void;
  currentSort?: SortOption;
  onSortChange?: (value: SortOption) => void;
  isReversed?: boolean;
  onReverseChange?: (reversed: boolean) => void;
}

export function BookFilters({ 
  activeFilter, 
  onFilterChange,
  currentSort = "recently_added",
  onSortChange,
  isReversed = false,
  onReverseChange
}: BookFiltersProps) {
  return (
    <div className="px-2">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <Tabs value={activeFilter} onValueChange={onFilterChange} className="w-full sm:w-auto">
          <TabsList className="w-full grid grid-cols-4 h-9">
            <TabsTrigger value="all" className="text-[13px] px-1">
              All
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="text-[13px] px-1">
              In progress
            </TabsTrigger>
            <TabsTrigger value="finished" className="text-[13px] px-1">
              Finished
            </TabsTrigger>
            <TabsTrigger value="not-started" className="text-[13px] px-1">
              Not started
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {activeFilter === "all" && onSortChange && onReverseChange && (
          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <SortingOptions 
              currentSort={currentSort} 
              onSortChange={onSortChange}
              isReversed={isReversed}
              onReverseChange={onReverseChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
