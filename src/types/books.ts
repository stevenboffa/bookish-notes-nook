export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    categories?: string[];
    publishedDate?: string;
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
  images?: string[];
  noteType?: string;
  book_id: string;
}

export interface Collection {
  id: string;
  name: string;
  createdAt: string;
  position?: number;
  user_id?: string;
}

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
  format?: string;
  collections?: string[];
}
