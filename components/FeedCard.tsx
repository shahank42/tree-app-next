import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { FeedItem } from "@/lib/types";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

function FeedCard({ data }: { data: FeedItem }) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-5">
        <div className="relative w-full h-32">
          <Image
            src={data.picUrl}
            alt={data.description}
            fill
            objectFit="cover"
            className="rounded-lg"
          />
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
  );
}

export default FeedCard;
