
export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    description: string;
    imageLinks?: {
      thumbnail: string;
      smallThumbnail: string;
    };
    categories: string[];
  };
}

export interface AIBookRecommendation {
  title: string;
  author: string;
  publicationYear: string;
  description: string;
  themes: string[];
  rating: string;
  imageUrl?: string;
  amazonUrl?: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt?: string;
  created_at?: string;
  pageNumber?: number;
  page_number?: number;
  timestampSeconds?: number;
  timestamp_seconds?: number;
  chapter?: string;
  category?: string;
  isPinned?: boolean;
  is_pinned?: boolean;
  images?: string[];
  noteType?: string;
  note_type?: string;
  book_id: string;
  reading_progress?: number;
  tags?: string[];
}

export interface Quote {
  id: string;
  content: string;
  page?: number;
  chapter?: string;
  book_id: string;
}

export interface BookWithNotes {
  id: string;
  notes: Note[];
  format?: "physical_book" | "ebook" | "audiobook";
}

export type BookFormat = "physical_book" | "ebook" | "audiobook";
export type ReadingStatus = "to_read" | "reading" | "completed" | "dnf";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  dateRead?: string;
  rating?: number;
  status: ReadingStatus | string;
  isFavorite?: boolean;
  imageUrl?: string;
  thumbnailUrl?: string;
  format: BookFormat | string;
  notes?: Note[];
  quotes?: Quote[];
}
