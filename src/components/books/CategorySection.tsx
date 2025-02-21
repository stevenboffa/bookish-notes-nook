
import { BookCategoryCard } from "@/components/BookCategoryCard";

interface Category {
  title: string;
  description: string;
  imageUrl: string;
  subcategories: {
    id: string;
    title: string;
    description: string;
    query: string;
    imageUrl: string;
  }[];
}

interface CategorySectionProps {
  mainCategory: "fiction" | "nonfiction" | null;
  categories: Record<string, Category>;
  onSelectMainCategory: (category: "fiction" | "nonfiction") => void;
  onSelectSubcategory: (categoryId: string) => void;
  onBack: () => void;
}

export function CategorySection({
  mainCategory,
  categories,
  onSelectMainCategory,
  onSelectSubcategory,
  onBack,
}: CategorySectionProps) {
  if (!mainCategory) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Browse Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(categories).map(([key, category]) => (
            <BookCategoryCard
              key={key}
              title={category.title}
              description={category.description}
              imageUrl={category.imageUrl}
              onClick={() => onSelectMainCategory(key as "fiction" | "nonfiction")}
            />
          ))}
        </div>
      </div>
    );
  }

  const category = categories[mainCategory];
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{category.title} Categories</h2>
        <button
          className="inline-flex items-center text-sm font-medium transition-colors hover:text-primary"
          onClick={onBack}
        >
          ← Back to Main Categories
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.subcategories.map((subcategory) => (
          <BookCategoryCard
            key={subcategory.id}
            title={subcategory.title}
            description={subcategory.description}
            imageUrl={subcategory.imageUrl}
            onClick={() => onSelectSubcategory(subcategory.id)}
          />
        ))}
      </div>
    </div>
  );
}
