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
    <nav className="sticky bottom-0 w-full bg-card border-t">
      <div className="flex w-full justify-around">
        {NAV_ITEMS.map((item) => (
          <Link
            href={item.link}
            className={
              (buttonVariants({ variant: "secondary" }),
              cn(navigationMenuTriggerStyle(), "flex gap-2 size-14"))
            }
          >
            {item.Icon}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
