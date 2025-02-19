
import { Book } from "@/components/BookList";

export interface Friend {
  id: string;
  email: string;
  books: Book[];
  status: 'pending' | 'accepted';
  type: 'sent' | 'received';
}

export interface FriendRequest {
  id: string;
  sender: {
    id: string;
    email: string;
  };
  receiver: {
    id: string;
    email: string;
  };
  status: 'pending' | 'accepted';
  created_at: string;
}

export interface BookReaction {
  id: string;
  book_id: string;
  user_id: string;
  reaction_type: 'like' | 'dislike';
  created_at: string;
}

export interface ReadingProgress {
  id: string;
  book_id: string;
  user_id: string;
  progress: number;
  created_at: string;
}
