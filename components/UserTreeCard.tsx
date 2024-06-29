import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { UserTreeItem } from "@/lib/types";
import { pb } from "@/lib/pbClient";
import { RecordModel } from "pocketbase";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cache } from "react";

const userTreeImagesCache = cache(
  async (userId: string) =>
    await pb.collection("tree_images").getFullList({
      filter: `user_id="${userId}"`,
    })
);

export default async function UserTreeCard({
  data,
  treeImageData,
}: {
  data: UserTreeItem;
  treeImageData: RecordModel[];
}) {
  const userTreeImages = treeImageData.filter(
    (treeImage) => treeImage.tree_id === data.id
  );

  return (
    <Card>
      <CardHeader>
        <Carousel>
          <CarouselContent>
            {userTreeImages.map((tree) => (
              <CarouselItem key={tree.id}>
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <div className="relative w-full h-32">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_PB_URL}/api/files/tree_images/${tree.id}/${tree.picUrl}`}
                        alt={"no"}
                        fill
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <CardTitle>
          {data.name}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
