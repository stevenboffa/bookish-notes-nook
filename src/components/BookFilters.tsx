import { Button } from "@/components/ui/button";

interface BookFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function BookFilters({ activeFilter, onFilterChange }: BookFiltersProps) {
  const filters = [
    { id: "all", label: "All titles" },
    { id: "in-progress", label: "In Progress" },
    { id: "not-started", label: "Not Started" },
    { id: "finished", label: "Finished" },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto p-2 pb-4 -mx-4 px-4">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "default" : "outline"}
          className="whitespace-nowrap"
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}