import React from "react";
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

export default function page({ params }: { params: { user: string } }) {
  return (
    <>
      <div>User is: {params.user}</div>
      <div className="flex justify-center items-center m-2 sm:m-8">
        <Card className="w-100">
          <CardHeader className="bg-muted/20 p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <h2 className="text-2xl font-bold">Jared Palmer</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>@jaredpalmer</span>
                  <Separator orientation="vertical" className="h-4" />
                  <Trees className="h-4 w-4" />
                  <span>250 trees planted</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 grid gap-4">
            <div className="grid gap-2">
              <h3 className="text-lg font-semibold">About</h3>
              <p className="text-muted-foreground">
                Jared is a passionate environmentalist who has dedicated his
                time to planting trees and raising awareness about
                sustainability. He believes that small actions can make a big
                difference in protecting our planet.
              </p>
            </div>
            <Separator />
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
            </div>
          </CardContent>
          <hr />
          {/* <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
        </Card>
      </div>
    </>
  );
}
