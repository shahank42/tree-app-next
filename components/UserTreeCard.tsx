import React from "react";
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
import { cache } from "react";

const userTreeImagesCache = cache(
  async (userId: string) =>
    await pb.collection("tree_images").getFullList({
      filter: `user_id="${userId}"`,
    })
);

function formatDate(dateString: string) {
  // Parse the input date string to a Date object
  const date = new Date(dateString);


  // Define month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];

  // Get day, month, and year
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Format the date
  const formattedDate = `${day} ${month}, ${year}`;
  return formattedDate;
}

// Example usage



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

  const formattedDate = formatDate(data.created);

  return (
    <div className="p-2.5">
    <Card>
      <CardHeader>
          <CardTitle className="text-md p-3">
            <h2 className="text-lg">Tree name: <span className="font-bold">{data.name}</span></h2>
            <h2>Tree type: <span className="font-bold">{data.type}</span></h2>
            <h2>Tree planted on: <span className="font-bold">{formattedDate}</span></h2>
            <h2>No. of photos: <span className="font-bold">{userTreeImages.length}</span></h2>
          </CardTitle>
        <Carousel>
          {userTreeImages.length != 1 && <CarouselPrevious />}
          <CarouselContent className="relative pb-6">
            {userTreeImages.map((tree,index) => (
              <CarouselItem key={tree.id}>
                <Card>
                  <CardContent className="p-6 flex items-center justify-center">
                    <div className="relative w-full h-[128px]">
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
                <div className="absolute flex justify-center w-full">{index+1}/{userTreeImages.length}</div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {userTreeImages.length != 1 && <CarouselNext />}
          
        </Carousel>
      </CardHeader>
    </Card>
    </div>
  );
}
