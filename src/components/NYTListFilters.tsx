import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NYTListFiltersProps {
  selectedList: string;
  onListChange: (list: string) => void;
}

export function NYTListFilters({ selectedList, onListChange }: NYTListFiltersProps) {
  const lists = [
    { id: "hardcover-fiction", name: "Hardcover Fiction", category: "Current" },
    { id: "hardcover-nonfiction", name: "Hardcover Nonfiction", category: "Current" },
    { id: "trade-fiction-paperback", name: "Paperback Trade Fiction", category: "Current" },
    { id: "paperback-nonfiction", name: "Paperback Nonfiction", category: "Current" },
    { id: "young-adult-hardcover", name: "Young Adult", category: "Current" },
    { id: "childrens-middle-grade-hardcover", name: "Children's Middle Grade", category: "Current" },
    // Historical lists (these use the same endpoint but with a different date)
    { id: "hardcover-fiction/2023-01-01", name: "Historical Fiction (2023)", category: "Historical" },
    { id: "hardcover-nonfiction/2023-01-01", name: "Historical Nonfiction (2023)", category: "Historical" },
    // Best of the Year lists
    { id: "notable-books/2023", name: "Notable Books of 2023", category: "Best of Year" },
    { id: "best-sellers/2023", name: "Bestsellers of 2023", category: "Best of Year" }
  ];

  // Group lists by category
  const groupedLists = lists.reduce((acc, list) => {
    if (!acc[list.category]) {
      acc[list.category] = [];
    }
    acc[list.category].push(list);
    return acc;
  }, {} as Record<string, typeof lists>);

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm font-medium">Bestseller List:</span>
      <Select value={selectedList} onValueChange={onListChange}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select a list" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(groupedLists).map(([category, categoryLists]) => (
            <div key={category}>
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                {category}
              </div>
              {categoryLists.map((list) => (
                <SelectItem key={list.id} value={list.id}>
                  {list.name}
                </SelectItem>
              ))}
              {category !== Object.keys(groupedLists).pop() && (
                <div className="h-px my-1 bg-muted" />
              )}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}