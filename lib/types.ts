export interface FeedItem {
  id: number;
  username: string;
  descripton: string;
  picUrl: string;
  avatarUrl: string;
  date: string;
}

export interface UserType {
  id: string;
  name: string;
  bio: string;
  walletAddress: string;
}