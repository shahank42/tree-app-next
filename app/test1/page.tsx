"use client";

import React from "react";
import type { FeedItem } from "@/lib/types";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FeedCard from "@/components/FeedCard";
import { useState } from "react";
import { useEffect } from "react";
import { pb } from "@/lib/pbClient";
import { Button } from "@/components/ui/button"

// function FeedItem({ data }: { data: FeedItem }) {

// const [posts, setPosts] = useState<FeedItem[]>([]);
//   // const posts = await pb.collection("posts").getFullList();
//       setPosts(posts);

//   return (
//     <div className="px-2">
//       <div className="flex flex-col gap-3 justify-around py-3">
//         {posts.map((item) => (
//           <FeedCard key={item.id} data={item} />
//         ))}
//       </div>
//     </div>
//   );
// }

export default function TreeInfo({ data }: { data: FeedItem }) {
  const [posts, setPosts] = useState<FeedItem[]>([]);
  // const posts = await pb.collection("posts").getFullList();
  //   setPosts(posts);
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
          <Dialog key={item.id}>
            <DialogTrigger  asChild>
              <Button>Edit Profile</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <div className="relative w-full h-54">
                  <Image
                    src={item.picUrl}
                    alt={item.description}
                    fill
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <DialogTitle className="pt-2">
                  @{item.username} planted a tree at {item.location} on{" "}
                  {item.date}
                  <div className="flex justify-between">
                    <Avatar>
                      <AvatarImage
                        src={item.avatarUrl}
                        className="rounded-full h-10 w-10"
                      />
                      <AvatarFallback>{item.username}</AvatarFallback>
                    </Avatar>
                    <DialogDescription className="pt-2.5 pl-10">
                      {new Date(item.date).toDateString()}
                      {item.description}
                    </DialogDescription>
                  </div>
                </DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        ))}
        
      </div>
    </div>
  );
}
