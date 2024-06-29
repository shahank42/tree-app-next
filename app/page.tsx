"use client";

import FeedCard from "@/components/FeedCard";
import { pb } from "@/lib/pbClient";
import { FeedItem } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState<FeedItem[]>([]);
  // const posts = await pb.collection("posts").getFullList();

  useEffect(() => {
    (async () => {
      const retrievedData = await pb.collection("posts").getFullList();

      const posts: FeedItem[] = [];
      for (const data of retrievedData) {
        const feedItem: FeedItem = {} as FeedItem;
        feedItem.id = data.id;
        feedItem.username = data.username;
        feedItem.description = data.description;
        feedItem.user_id = data.user_id;
        feedItem.picUrl = `${process.env.NEXT_PUBLIC_PB_URL}/api/files/posts/${data.id}/${data.picUrl}`; 
        feedItem.avatarUrl = "/avatar.jpg";
        feedItem.location = data.location;
        feedItem.date = data.created;
        posts.push(feedItem);
      }

      setPosts(posts);
    })();
  }, []);

  return (
    <div className="px-2">
      <div className="flex flex-col gap-3 justify-around py-3">
        {posts.map((item) => (
          <FeedCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}
