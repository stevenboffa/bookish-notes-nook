import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  onChange: (value: number) => void;
}

export function Rating({ value, onChange }: RatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className="focus:outline-none"
        >
          <Star
            className={`h-5 w-5 ${
              rating <= value
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}