export interface FeedItem {
  id: string;
  user_id: string;
  username: string;
  description: string;
  picUrl: string;
  avatarUrl: string;
  date: string;
  location: string;
}

export interface UserType {
  id: string;
  name: string;
  bio: string;
  walletAddress: string;
}