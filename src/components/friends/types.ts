
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
