
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface BookFiltersProps {
  activeFilter: string;
  onFilterChange: (value: string) => void;
}

export function BookFilters({ activeFilter, onFilterChange }: BookFiltersProps) {
  const isMobile = useIsMobile();

  return (
    <div className="px-4 pb-2">
      <ScrollArea className="w-full">
        <Tabs value={activeFilter} onValueChange={onFilterChange}>
          <TabsList className="w-full h-auto p-1 flex-nowrap">
            <TabsTrigger value="all" className="flex-1 whitespace-nowrap py-1.5 text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="flex-1 whitespace-nowrap py-1.5 text-sm">
              In Progress
            </TabsTrigger>
            <TabsTrigger value="finished" className="flex-1 whitespace-nowrap py-1.5 text-sm">
              Finished
            </TabsTrigger>
            <TabsTrigger value="not-started" className="flex-1 whitespace-nowrap py-1.5 text-sm">
              Not Started
            </TabsTrigger>
            <TabsTrigger value="future-reads" className="flex-1 whitespace-nowrap py-1.5 text-sm">
              Future Reads
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
