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
import { FeedItem, UserTreeItem, UserType } from "@/lib/types";
import { useUserStore } from "@/lib/stores/user";
import UserTreeCard from "@/components/UserTreeCard";
import { RecordModel } from "pocketbase";
import { showBalance } from "@/lib/web3";
import DisplayCarbonBalance from "@/components/DisplayBalance";

export default async function page({ params }: { params: { user: string } }) {
  try {
    const result = await pb
      .collection("users_table")
      .getFirstListItem(`name="${params.user}"`);

    const user: UserType = {
      name: result.name,
      bio: result.bio,
      id: result.id,
      walletAddress: result.wallet_address,
    };

    const numTrees = await showBalance("nftree", user.walletAddress);
    const carbonCredits = await showBalance("nftree", user.walletAddress);

    const retrievedData = await pb.collection("trees").getFullList({
      filter: `user_id="${user?.id}"`,
    });
    // const retrievedData = await pb.collection("posts").getFullList();

    const posts: UserTreeItem[] = [];
    for (const data of retrievedData) {
      const item: UserTreeItem = {} as UserTreeItem;
      item.id = data.id;
      item.name = data.name;
      item.user_id = data.user_id;
      item.type = data.type;
      item.created = data.created;
      posts.push(item);
    }

    const userTreeImages = await pb.collection("tree_images").getFullList();

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
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                </div>
              </div>
              <div className="flex justify-evenly items-center text-muted-foreground w-100">
                <div className="flex flex-col justify-center items-center">
                  <div className="flex gap-2">
                    {`${numTrees}`}
                    <Trees className="h-5 w-5" />
                  </div>
                  <span className="text-sm">trees planted</span>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="flex flex-col justify-center items-center">
                  <div className="flex gap-2">
                    {`${carbonCredits}`}
                    <Trees className="h-5 w-5" />
                  </div>
                  <span className="text-sm">carbon credit</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 grid gap-4">
              <div className="grid gap-2">
                <h3 className="text-lg font-semibold">About</h3>
                <p className="text-muted-foreground">{user?.bio}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="px-2">
          <div className="flex flex-col gap-3 justify-around py-3">
            {posts.map((item) => (
              <UserTreeCard
                key={item.id}
                data={item}
                treeImageData={userTreeImages}
              />
            ))}
          </div>
        </div>
      </>
    );
  } catch (e) {
    // setUserPresent(false);
    return <>lmao</>;
  }
}
