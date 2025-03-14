
import { BookCover } from "@/components/BookCover";

// Sample popular books data - in a real implementation, this would come from the database
const POPULAR_BOOKS = [
  { id: "1", title: "Harry Potter and the Sorcerer's Stone", author: "J. K. Rowling", genre: "Fantasy", imageUrl: "https://covers.openlibrary.org/b/id/10521270-L.jpg", status: "Finished", rating: 9 },
  { id: "2", title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", genre: "Fiction", imageUrl: "https://covers.openlibrary.org/b/id/12047756-L.jpg", status: "Finished", rating: 7.5 },
  { id: "3", title: "The Power of Habit", author: "Charles Duhigg", genre: "Non-Fiction", imageUrl: "https://covers.openlibrary.org/b/id/13163389-L.jpg", status: "Finished", rating: 8 },
  { id: "4", title: "Ready Player One", author: "Ernest Cline", genre: "Fiction", imageUrl: "https://covers.openlibrary.org/b/id/12711118-L.jpg", status: "Finished", rating: 7 },
  { id: "5", title: "The Time Traveler's Wife", author: "Audrey Niffenegger", genre: "Fiction", imageUrl: "https://covers.openlibrary.org/b/id/10484595-L.jpg", status: "Finished", rating: 8.5 },
  { id: "6", title: "Freakonomics", author: "Steven D. Levitt", genre: "Business & Economics", imageUrl: "https://covers.openlibrary.org/b/id/12726464-L.jpg", status: "Finished", rating: 8.5 },
  { id: "7", title: "Slaughterhouse-Five", author: "Kurt Vonnegut", genre: "Fiction", imageUrl: "https://covers.openlibrary.org/b/id/589699-L.jpg", status: "Finished", rating: 8.5 },
  { id: "8", title: "The Alchemist", author: "Paulo Coelho", genre: "Alchemists", imageUrl: "https://covers.openlibrary.org/b/id/12700646-L.jpg", status: "Finished", rating: 8 },
  { id: "9", title: "The Girl on the Train", author: "Paula Hawkins", genre: "Fiction", imageUrl: "https://covers.openlibrary.org/b/id/8400363-L.jpg", status: "Finished", rating: 7 },
  { id: "10", title: "It", author: "Stephen King", genre: "Fiction", imageUrl: "https://covers.openlibrary.org/b/id/8048029-L.jpg", status: "Finished", rating: 8.5 },
  { id: "11", title: "Neuromancer", author: "William Gibson", genre: "Fiction", imageUrl: "https://covers.openlibrary.org/b/id/6999877-L.jpg", status: "Finished", rating: 9 },
  { id: "12", title: "Life of Pi (Movie Tie-In Edition)", author: "Yann Martel", genre: "East Indians", imageUrl: "https://covers.openlibrary.org/b/id/7081879-L.jpg", status: "Finished", rating: 8 }
];

const getRatingColor = (rating: number) => {
  if (rating >= 9) return "bg-emerald-500 text-white";
  if (rating >= 7) return "bg-green-500 text-white";
  if (rating >= 5) return "bg-yellow-500 text-white";
  if (rating >= 3) return "bg-orange-500 text-white";
  return "bg-red-500 text-white";
};

export function BookPreviewGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {POPULAR_BOOKS.map((book) => (
        <div 
          key={book.id} 
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="relative">
            <BookCover
              imageUrl={book.imageUrl}
              title={book.title}
              genre={book.genre}
              size="md"
              className="mx-auto"
            />
            
            <div className="p-3">
              <h3 className="font-medium text-sm line-clamp-1">{book.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-1">by {book.author}</p>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100">{book.genre}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">{book.status}</span>
              </div>
              
              {book.rating && (
                <div className="mt-2">
                  <span 
                    className={`text-xs px-2 py-0.5 rounded-full ${getRatingColor(book.rating)}`}
                  >
                    Rating: {book.rating}/10
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
