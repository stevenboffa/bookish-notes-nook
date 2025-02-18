
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
