"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Trees } from "lucide-react";
import { Award } from "lucide-react";
import Image from "next/image";
import FeedCard from "@/components/FeedCard";
import { pb } from "@/lib/pbClient";
import { FeedItem } from "@/lib/types";
import { useUserStore } from "@/lib/stores/user";

export default function page({ params }: { params: { user: string } }) {
  const [posts, setPosts] = useState<FeedItem[]>([]);

  const [loggedIn, setLoggedIn] = useState(false);
  const user = useUserStore((state) => state.user);
  // const posts = await pb.collection("posts").getFullList();

  useEffect(() => {
    (async () => {
      const retrievedData = await pb.collection("posts").getFullList({
        filter: `username="${params.user}"`
      });
      // const retrievedData = await pb.collection("posts").getFullList();
      console.log(retrievedData);

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
    <>
      {/* <div>User is: {params.user}</div> */}
      <div className="flex justify-center items-center m-2 sm:m-8">
        <Card className="w-full">
          <CardHeader className="bg-muted/20 p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>AF</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <h2 className="text-2xl font-bold">{user.name}</h2>
              </div>
            </div>
            <div className="flex justify-evenly items-center text-muted-foreground w-100">
              <div className="flex flex-col justify-center items-center">
                <div className="flex">
                  <Trees className="h-5 w-5" />
                  250
                </div>
                <span className="text-sm">trees planted</span>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="flex flex-col justify-center items-center">
                <div className="flex">
                  <Trees className="h-5 w-5" />
                  1000
                </div>
                <span className="text-sm">carbon credit</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0 grid gap-4">
            <div className="grid gap-2">
              <h3 className="text-lg font-semibold">About</h3>
              <p className="text-muted-foreground">
                {user.bio}
              </p>
            </div>
            {/* <Separator />
            <div className="grid gap-2">
              <h3 className="text-lg font-semibold">Achievements</h3>
              <div className="grid gap-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Trees className="h-5 w-5" />
                  <span>250 trees planted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span>Eco-Warrior of the Year Award</span>
                </div>
              </div>
            </div> */}
          </CardContent>
          {/* <hr /> */}
          {/* <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
        </Card>
      </div>
      <div className="px-2">
        <div className="flex flex-col gap-3 justify-around py-3">
          {posts.map((item) => (
            <FeedCard key={item.id} data={item} />
          ))}
        </div>
      </div>
    </>
  );
}
