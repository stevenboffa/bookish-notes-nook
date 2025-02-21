
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BookFiltersProps {
  activeFilter: string;
  onFilterChange: (value: string) => void;
}

export function BookFilters({ activeFilter, onFilterChange }: BookFiltersProps) {
  return (
    <div className="px-4 pb-2">
      <Tabs value={activeFilter} onValueChange={onFilterChange}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="all" className="flex-1 sm:flex-none">
            All
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="flex-1 sm:flex-none">
            In Progress
          </TabsTrigger>
          <TabsTrigger value="finished" className="flex-1 sm:flex-none">
            Finished
          </TabsTrigger>
          <TabsTrigger value="not-started" className="flex-1 sm:flex-none">
            Not Started
          </TabsTrigger>
          <TabsTrigger value="future-reads" className="flex-1 sm:flex-none">
            Future Reads
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
