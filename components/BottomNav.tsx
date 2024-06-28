"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import Link from "next/link";
import {
  CircleUserIcon,
  Home,
  HomeIcon,
  Upload,
  UploadIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";

const NAV_ITEMS = [
  {
    name: "Home",
    Icon: <HomeIcon />,
    link: "#",
  },
  {
    name: "Upload",
    Icon: <Upload />,
    link: "#",
  },
  {
    name: "My Account",
    Icon: <CircleUserIcon />,
    link: "#",
  },
];

function BottomNav() {
  return (
    <div className="sticky bottom-0 w-full">
      <nav className=" w-full bg-card border border-input py-3">
        <div className="flex w-full justify-around">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              className={cn(
                buttonVariants({
                  variant: item.name === "Upload" ? "default" : "outline",
                }),
                "flex gap-2 size-[3.2rem] rounded-full"
              )}
            >
              {item.Icon}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default BottomNav;
