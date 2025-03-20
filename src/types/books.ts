
export interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string;
  dateRead?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  isFavorite: boolean;
  rating: number;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  format?: string;
  notes?: Note[];
  quotes?: Quote[];
  description?: string;
  collections?: string[];
  readingProgress?: number;
}

export interface BookWithNotes extends Omit<Book, 'notes'> {
  notes: Note[];
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  pageNumber?: number;
  timestampSeconds?: number;
  chapter?: string;
  category?: string;
  isPinned: boolean;
  images?: string[];
  noteType?: string;
  book_id: string;
  readingProgress?: number;
}

export interface Quote {
  id: string;
  content: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  createdAt: string;
  position: number;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  avatarUrl?: string;
}

export interface FriendRequest {
  id: string;
  sender: User;
  receiver: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Friend {
  id: string;
  user: User;
  friendSince: string;
}

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    publishedDate?: string;
    publisher?: string;
    pageCount?: number;
    language?: string;
    maturityRating?: string;
  };
}

export interface AIBookRecommendation {
  title: string;
  author: string;
  description: string;
  publicationYear: string;
  imageUrl?: string;
  rating?: number;
  amazonUrl?: string;
  themes?: string[];
  genre?: string;
}

export interface ReadingActivity {
  id: string;
  user_id: string;
  activity_date: string;
  activity_type: string;
  created_at: string;
}
