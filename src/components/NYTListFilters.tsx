import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NYTListFiltersProps {
  selectedList: string;
  onListChange: (list: string) => void;
}

export function NYTListFilters({ selectedList, onListChange }: NYTListFiltersProps) {
  const currentLists = [
    { id: "hardcover-fiction", name: "Hardcover Fiction" },
    { id: "hardcover-nonfiction", name: "Hardcover Nonfiction" },
    { id: "trade-fiction-paperback", name: "Paperback Trade Fiction" },
    { id: "paperback-nonfiction", name: "Paperback Nonfiction" },
    { id: "young-adult-hardcover", name: "Young Adult" },
    { id: "childrens-middle-grade-hardcover", name: "Children's Middle Grade" },
  ];

  const historicalLists = [
    { id: "hardcover-fiction/2023-01-01", name: "Historical Fiction (2023)" },
    { id: "hardcover-nonfiction/2023-01-01", name: "Historical Nonfiction (2023)" },
  ];

  const bestOfYearLists = [
    { id: "notable-books/2023", name: "Notable Books of 2023" },
    { id: "best-sellers/2023", name: "Bestsellers of 2023" },
  ];

  const getListType = (listId: string) => {
    if (listId.includes('/')) {
      return listId.includes('2023-01-01') ? 'historical' : 'best-of-year';
    }
    return 'current';
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="flex-1">
        <h3 className="text-sm font-medium mb-2">Current Lists</h3>
        <Select 
          value={getListType(selectedList) === 'current' ? selectedList : ''} 
          onValueChange={onListChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select current list" />
          </SelectTrigger>
          <SelectContent>
            {currentLists.map((list) => (
              <SelectItem key={list.id} value={list.id}>
                {list.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-medium mb-2">Historical Lists</h3>
        <Select 
          value={getListType(selectedList) === 'historical' ? selectedList : ''} 
          onValueChange={onListChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select historical list" />
          </SelectTrigger>
          <SelectContent>
            {historicalLists.map((list) => (
              <SelectItem key={list.id} value={list.id}>
                {list.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-medium mb-2">Best of Year</h3>
        <Select 
          value={getListType(selectedList) === 'best-of-year' ? selectedList : ''} 
          onValueChange={onListChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select best of year list" />
          </SelectTrigger>
          <SelectContent>
            {bestOfYearLists.map((list) => (
              <SelectItem key={list.id} value={list.id}>
                {list.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}