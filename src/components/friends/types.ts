
export interface Friend {
  id: string;
  email: string;
  username?: string | null;
  avatar_url?: string | null;
  status: string;
  type: 'sent' | 'received';
  books: any[]; // Books belonging to this friend
}

export interface FriendRequest {
  id: string;
  sender: {
    id: string;
    email: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  receiver: {
    id: string;
    email: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  status: string;
}

export interface BookReaction {
  id: string;
  user_id: string;
  book_id: string;
  reaction_type: string;
  created_at: string;
}

export interface ReadingProgress {
  id: string;
  user_id: string;
  book_id: string;
  progress: number;
  created_at: string;
}

export interface Recommendation {
  id: string;
  book: any;
  from_user: {
    id: string;
    username: string;
    email: string;
    avatar_url: string;
  };
  message: string;
  status: string;
  created_at: string;
}
