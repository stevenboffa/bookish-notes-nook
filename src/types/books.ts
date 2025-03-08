
export interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string;
  dateRead?: string;
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

export interface BookWithNotes extends Book {
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
  audioUrl?: string;
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
