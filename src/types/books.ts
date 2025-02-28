
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
  createdAt: string;
  pageNumber?: number;
  timestampSeconds?: number;
  chapter?: string;
  category?: string;
  isPinned?: boolean;
  readingProgress?: number;
  images?: string[];
  noteType?: string;
  book_id: string;
}

export type BookFormat = 'physical_book' | 'ebook' | 'audiobook';

export interface BookWithNotes {
  id: string;
  notes: Array<{
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
  format?: BookFormat;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string;
  dateRead?: string;
  rating?: number;
  status?: string;
  isFavorite?: boolean;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  format?: BookFormat;
  description?: string;
  notes?: Note[];
  quotes?: {
    id: string;
    content: string;
    createdAt: string;
  }[];
}
