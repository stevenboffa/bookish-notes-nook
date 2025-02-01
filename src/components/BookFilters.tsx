import { Button } from "@/components/ui/button";
import { Book, BookOpen, CheckCircle } from "lucide-react";

interface BookFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function BookFilters({ activeFilter, onFilterChange }: BookFiltersProps) {
  const filters = [
    { id: "all", label: "All titles", icon: Book },
    { id: "in-progress", label: "In Progress", icon: BookOpen },
    { id: "not-started", label: "Not Started", icon: Book },
    { id: "finished", label: "Finished", icon: CheckCircle },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto p-4 border-b bg-white sticky top-0 z-10">
      {filters.map((filter) => {
        const Icon = filter.icon;
        return (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            className="whitespace-nowrap"
            onClick={() => onFilterChange(filter.id)}
          >
            <Icon className="w-4 h-4 mr-2" />
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}