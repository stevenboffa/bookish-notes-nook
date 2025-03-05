import React from 'react';
import { BookCover } from "./BookCover";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  dateRead: string;
  rating: number;
  status: string;
  isFavorite: boolean;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  format: string;
  description: string;
  collections?: string[];
  notes?: Array<{
    id: string;
    content: string;
    createdAt: string;
    pageNumber?: number;
    timestampSeconds?: number;
    chapter?: string;
    category?: string;
    isPinned?: boolean;
    images?: string[];
    noteType?: string;
  }>;
  quotes?: Array<{
    id: string;
    content: string;
    createdAt: string;
  }>;
};

interface BookListProps {
  books: Book[];
  selectedBook: Book | null;
  onSelectBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  activeFilter: string;
  activeCollection?: string;
}

export function BookList({
  books,
  selectedBook,
  onSelectBook,
  onDeleteBook,
  activeFilter,
  activeCollection,
}: BookListProps) {
  // Filter books based on the active filter
  const filteredBooks = books.filter((book) => {
    // First filter by status
    const statusMatch = 
      activeFilter === "all" ||
      (activeFilter === "reading" && book.status === "In progress") ||
      (activeFilter === "completed" && book.status === "Finished") ||
      (activeFilter === "not-started" && book.status === "Not started");
    
    // Then filter by collection if one is selected
    const collectionMatch = !activeCollection || 
      (book.collections && book.collections.includes(activeCollection));
    
    return statusMatch && collectionMatch;
  });

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredBooks.map((book) => (
        <Card 
          key={book.id}
          className={`group relative transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer ${selectedBook?.id === book.id ? 'ring-2 ring-primary/50' : 'ring-0'}`}
          onClick={() => onSelectBook(book)}
        >
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteBook(book.id);
              }}
              className="hover:bg-red-500 hover:text-red-50 transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-medium truncate">{book.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground truncate italic">{book.author}</CardDescription>
          </CardHeader>
          <CardContent className="aspect-square relative overflow-hidden">
            <BookCover
              imageUrl={book.imageUrl}
              thumbnailUrl={book.thumbnailUrl}
              genre={book.genre}
              title={book.title}
              size="sm"
              className="rounded-md"
            />
          </CardContent>
          <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="truncate">{book.genre}</span>
            <span>{book.status}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
