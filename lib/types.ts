export interface FeedItem {
  id: string;
  user_id: string;
  username: string;
  description: string;
  upvotes: number;
  picUrl: string;
  avatarUrl: string;
  uuid: string;
  date: string;
  location: string;
  created: string;
}

export interface UserType {
  id: string;
  name: string;
  bio: string;
  walletAddress: string;
}

export interface UserTreeItem {
  id: string;
  tree_uuid: string;
  name: string;
  type: string;
  user_id: string;
  created: string;
}