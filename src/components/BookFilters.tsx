
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortingOptions, type SortOption } from "./SortingOptions";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <div className={`px-4 py-2 bg-gray-50 border-b ${isMobile ? 'py-2' : 'py-3'}`}>
      <div className="flex flex-wrap justify-between items-center gap-2">
        <Tabs value={activeFilter} onValueChange={onFilterChange} className="w-full sm:w-auto">
          <TabsList className="w-full grid grid-cols-4 h-9 bg-white/80 backdrop-blur-sm rounded-xl shadow-[0_2px_10px] shadow-black/5 border border-gray-100/50">
            <TabsTrigger 
              value="all" 
              className="text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-none font-medium rounded-lg transition-all duration-200 hover:bg-gray-50/70"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="in-progress" 
              className="text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-none font-medium rounded-lg transition-all duration-200 hover:bg-gray-50/70"
            >
              {isMobile ? "Reading" : "In progress"}
            </TabsTrigger>
            <TabsTrigger 
              value="finished" 
              className="text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-none font-medium rounded-lg transition-all duration-200 hover:bg-gray-50/70"
            >
              {isMobile ? "Done" : "Finished"}
            </TabsTrigger>
            <TabsTrigger 
              value="not-started" 
              className="text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-none font-medium rounded-lg transition-all duration-200 hover:bg-gray-50/70"
            >
              {isMobile ? "New" : "Not started"}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {activeFilter === "all" && onSortChange && onReverseChange && (
          <div className="w-full sm:w-auto mt-1 sm:mt-0">
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
