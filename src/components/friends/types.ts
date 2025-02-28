
import { Book } from "@/types/books";

export interface Friend {
  id: string;
  email: string;
  username?: string | null;
  avatar_url?: string | null;
  books: Book[];
  status: 'pending' | 'accepted';
  type: 'sent' | 'received';
}

export interface FriendRequest {
  id: string;
  sender: {
    id: string;
    email: string;
    username?: string | null;
    avatar_url?: string | null;
  };
  receiver: {
    id: string;
    email: string;
    username?: string | null;
    avatar_url?: string | null;
  };
  status: 'pending' | 'accepted';
  created_at: string;
}

export interface BookReaction {
  id: string;
  book_id: string;
  user_id: string;
  reaction_type: 'like' | 'love' | 'thinking' | 'celebrate';
  created_at: string;
}

export interface ReadingProgress {
  id: string;
  book_id: string;
  user_id: string;
  progress: number;
  created_at: string;
}

export interface Recommendation {
  id: string;
  book_id: string;
  from_user_id: string;
  to_user_id: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  from_user: {
    id: string;
    username: string;
    email: string;
    avatar_url: string;
  };
  book: Book;
}
