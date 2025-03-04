
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
    <div className="px-4 py-3 bg-gray-50 border-b">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <Tabs value={activeFilter} onValueChange={onFilterChange} className="w-full sm:w-auto">
          <TabsList className="w-full grid grid-cols-4 h-11 bg-white/80 backdrop-blur-sm rounded-xl shadow-[0_2px_10px] shadow-black/5 border border-gray-100/50">
            <TabsTrigger 
              value="all" 
              className="text-sm data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none font-medium rounded-lg transition-all duration-200 hover:bg-gray-50/50"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="in-progress" 
              className="text-sm data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none font-medium rounded-lg transition-all duration-200 hover:bg-gray-50/50"
            >
              In progress
            </TabsTrigger>
            <TabsTrigger 
              value="finished" 
              className="text-sm data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none font-medium rounded-lg transition-all duration-200 hover:bg-gray-50/50"
            >
              Finished
            </TabsTrigger>
            <TabsTrigger 
              value="not-started" 
              className="text-sm data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none font-medium rounded-lg transition-all duration-200 hover:bg-gray-50/50"
            >
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
