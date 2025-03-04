
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BookFiltersProps {
  activeFilter: string;
  onFilterChange: (value: string) => void;
}

export function BookFilters({ activeFilter, onFilterChange }: BookFiltersProps) {
  return (
    <div className="px-2">
      <Tabs value={activeFilter} onValueChange={onFilterChange} className="w-full">
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
    </div>
  );
}
