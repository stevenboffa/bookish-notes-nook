
import { BookCover } from "@/components/BookCover";

// Sample popular books data - in a real implementation, this would come from the database
const POPULAR_BOOKS = [
  { id: "1", title: "Atomic Habits", author: "James Clear", genre: "Self-Help", imageUrl: "https://covers.openlibrary.org/b/id/10777176-L.jpg" },
  { id: "2", title: "Project Hail Mary", author: "Andy Weir", genre: "Science Fiction", imageUrl: "https://covers.openlibrary.org/b/id/12767724-L.jpg" },
  { id: "3", title: "The Psychology of Money", author: "Morgan Housel", genre: "Finance", imageUrl: "https://covers.openlibrary.org/b/id/12940932-L.jpg" },
  { id: "4", title: "Dune", author: "Frank Herbert", genre: "Science Fiction", imageUrl: "https://covers.openlibrary.org/b/id/12008442-L.jpg" },
  { id: "5", title: "The Midnight Library", author: "Matt Haig", genre: "Fiction", imageUrl: "https://covers.openlibrary.org/b/id/10388263-L.jpg" },
  { id: "6", title: "The Four Winds", author: "Kristin Hannah", genre: "Historical Fiction", imageUrl: "https://covers.openlibrary.org/b/id/12726511-L.jpg" }
];

export function BookPreviewGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
      {POPULAR_BOOKS.map((book) => (
        <div 
          key={book.id} 
          className="group relative hover:-translate-y-1 transition-transform duration-300"
        >
          <BookCover
            imageUrl={book.imageUrl}
            title={book.title}
            genre={book.genre}
            size="sm"
            className="mx-auto"
          />
          
          {/* Hover details overlay */}
          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex flex-col justify-end p-2">
            <p className="text-white text-xs font-semibold line-clamp-2">{book.title}</p>
            <p className="text-white/80 text-xs line-clamp-1">{book.author}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
