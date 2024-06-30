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
import { RecordModel } from "pocketbase"
import { Button } from "@/components/ui/button";
import { ChevronUp } from 'lucide-react';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";


export default async function page({ params }: { params: { id: string } }) {
    try {
        const result = await pb
          .collection("trees")
          .getFirstListItem(`tree_uuid="${params.id}"`);
    
        const tree: UserTreeItem = {
            id: result.id,
            name: result.name,
            tree_uuid: result.tree_uuid,
            type: result.type,
            user_id: result.user_id,
            created: result.created,
        };

        const createdDate: Date = new Date(tree.created);
        const currentDate: Date  = new Date();
        const timeDifference: number = currentDate.getTime() - createdDate.getTime();
        const total_credit = Math.floor(timeDifference  / (1000 * 60 * 60 * 24));
    
        const retrievedData = await pb.collection("tree_images").getFullList({
          filter: `tree_id="${tree?.id}"`,
        });
        const retrievedUserData = await pb.collection("users_table").getFirstListItem(
            `id="${tree?.user_id}"`,
          );
        // const retrievedData = await pb.collection("posts").getFullList();
    
        const tree_images: FeedItem[] = [];
        for (const data of retrievedData) {
          const item: FeedItem = {} as FeedItem;
          item.id = data.id;
          item.picUrl =  `${process.env.NEXT_PUBLIC_PB_URL}/api/files/tree_images/${data.id}/${data.picUrl}`;
          item.upvotes = data.upvotes;
          item.created = data.created;
          tree_images.push(item);
        }
    
        const userTreeImages = await pb.collection("tree_images").getFullList();
    
        return (
          <>
            <div className="flex justify-center items-center m-2 sm:m-8">
              <Card className="w-full">
                <CardHeader className="bg-muted/20 p-6">
                  <div className="flex items-center gap-4">
                    <div className="grid gap-1">
                      <h2 className="text-2xl font-bold">{tree?.name}</h2>
                    </div>
                  </div>      
                </CardHeader>
                <CardContent className="p-6 pt-0 grid gap-4">
                  <div className="grid gap-2">
                    <h3 className="text-lg font-semibold">About</h3>
                    <p className="text-muted-foreground">Type: <span className="font-bold">{tree.type}</span></p>
                    <p className="text-muted-foreground">Created By: <span className="font-bold">{tree.user_id}</span></p>
                    <p className="text-muted-foreground">Carbon Credit Genarated: <span className="font-bold">{total_credit}</span></p>
                    <p className="text-muted-foreground">Created On: <span className="font-bold">{(new Date(tree.created)).toDateString()}</span></p>

                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="px-2">
              <div className="flex flex-col gap-3 justify-around py-3">
                {tree_images.map((item) => (
                   <Card>
                   <CardHeader className="flex flex-col gap-5 pb-2">
                     <div className="relative w-full h-32">
                       <Image
                         src={item.picUrl}
                         alt="tree image"
                         fill
                         objectFit="cover"
                         className="rounded-lg"
                         />
                       
                     </div>
                     <div className="flex flex-col gap-1">
                       <div className="flex justify-between">
                         <div className="flex">
                           <CardTitle className="pt-2">{item.username}</CardTitle>
                         </div>
                        <CardDescription className="pt-2.5 pl-10">
                           {(new Date(item.created)).toDateString()}
                        </CardDescription>
                       </div>
                     </div>
                   </CardHeader>
                   <Button
                             // onClick={() => upvote(data.id, data.upvotes)}
                             className={cn(
                               buttonVariants({
                                 variant: "outline",
                               }),
                               "flex gap-2 rounded-md text-gray-800"
                             )}
                           ><ChevronUp/>Upvote({item.upvotes})</Button>
                 </Card>
                ))}
              </div>
            </div>
          </>
        );
      } catch (e) {
        // setUserPresent(false);
        console.error(e);
        return <div className="flex justify-center items-center">Loading...</div>;
      }
}