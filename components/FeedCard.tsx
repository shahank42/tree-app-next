"use client"

import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { FeedItem } from "@/lib/types";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { Info } from 'lucide-react';
import { ChevronUp } from 'lucide-react';



function FeedCard({ data }: { data: FeedItem }) {

  const[showTreeInfo, setShowTreeInfo] = useState(false);
  const handleClick = () => {
    setShowTreeInfo(!showTreeInfo);
  }
  return (
     <div>  
    <Card onClick={handleClick}>
      <CardHeader className="flex flex-col gap-5">
        <div className="relative w-full h-32">
          <Image
            src={data.picUrl}
            alt={data.description}
            fill
            objectFit="cover"
            className="rounded-lg"
            />
          <Dialog>
            <DialogTrigger  asChild className="relative">
              <Button className="absolute top-0 right-0 rounded-full opacity-50 h-[24px] p-0"><Info /></Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                
                <DialogTitle className="pt-2">
                <div className="relative w-full h-54">
                  <Image
                    src={data.picUrl}
                    alt={data.description}
                    fill
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                  @{data.username} planted a tree at {data.location} on{" "}
                  {data.date}
                  <div className="flex justify-between">
                    <Avatar>
                      <AvatarImage
                        src={data.avatarUrl}
                        className="rounded-full h-10 w-10"
                      />
                      <AvatarFallback>{data.username}</AvatarFallback>
                    </Avatar>
                    <DialogDescription className="pt-2.5 pl-10">
                      {new Date(data.date).toDateString()}
                      {data.description}
                    </DialogDescription>
                  </div>
                </DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <div className="flex">
              <Avatar>
                <AvatarImage
                  src={data.avatarUrl}
                  className="rounded-full h-10 w-10"
                  />
                <AvatarFallback>{data.username}</AvatarFallback>
              </Avatar>
              <CardTitle className="pt-2">{data.username}</CardTitle>
            </div>
            <CardDescription className="pt-2.5 pl-10">
              {(new Date(data.date)).toDateString()}
            </CardDescription>
          </div>
          <CardDescription>{data.description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
    {/* {showTreeInfo && <TreeInfo data={data} />} */}
    </div>   
    
  );
}

export default FeedCard;
