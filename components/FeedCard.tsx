import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { FeedItem } from "@/lib/types";
import Image from "next/image";

function FeedCard({ data }: { data: FeedItem }) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-5">
        <div className="relative w-full h-32">
          <Image
            src={data.picUrl}
            alt={data.descripton}
            fill
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-1">
          <CardTitle>{data.username}</CardTitle>
          <CardDescription>{data.descripton}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}

export default FeedCard;
