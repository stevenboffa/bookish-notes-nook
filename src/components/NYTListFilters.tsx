import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NYTListFiltersProps {
  selectedList: string;
  onListChange: (list: string) => void;
}

export function NYTListFilters({ selectedList, onListChange }: NYTListFiltersProps) {
  const lists = [
    { id: "hardcover-fiction", name: "Hardcover Fiction" },
    { id: "hardcover-nonfiction", name: "Hardcover Nonfiction" },
    { id: "trade-fiction-paperback", name: "Paperback Trade Fiction" },
    { id: "paperback-nonfiction", name: "Paperback Nonfiction" },
    { id: "young-adult-hardcover", name: "Young Adult" },
    { id: "childrens-middle-grade-hardcover", name: "Children's Middle Grade" },
  ];

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm font-medium">Bestseller List:</span>
      <Select value={selectedList} onValueChange={onListChange}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Select a list" />
        </SelectTrigger>
        <SelectContent>
          {lists.map((list) => (
            <SelectItem key={list.id} value={list.id}>
              {list.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}