"use client";

import React, { useEffect, useState } from "react";
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
  LogInIcon,
  Upload,
  UploadIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/thirdWebClient";
import { isLoggedIn } from "@/lib/actions/auth";

const NAV_ITEMS = [
  {
    name: "Home",
    Icon: <HomeIcon />,
    link: "/",
  },
  {
    name: "Upload",
    Icon: <Upload />,
    link: "#",
  },
  {
    name: "My Account",
    Icon: <LogInIcon />,
    link: "/login",
  },
];

function BottomNav() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      setLoggedIn(await isLoggedIn());
    })();
  });

  return (
    <div className="sticky bottom-0 w-full">
      <nav className=" w-full py-3 bg-transparent shadow-lg">
        <div className="flex w-full justify-around">
          <Link
            href="/"
            className={cn(
              buttonVariants({
                variant: "outline",
              }),
              "flex gap-2 size-[3.2rem] rounded-full"
            )}
          >
            <HomeIcon />
          </Link>

          <Link
            href="/upload"
            className={cn(
              buttonVariants({
                variant: "default",
              }),
              "flex gap-2 size-[3.2rem] rounded-full"
            )}
          >
            <UploadIcon />
          </Link>

          {loggedIn ? (
            <Link
              href="/account"
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "flex gap-2 size-[3.2rem] rounded-full"
              )}
            >
              <CircleUserIcon />
            </Link>
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "flex gap-2 size-[3.2rem] rounded-full"
              )}
            >
              <LogInIcon />
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

export default BottomNav;
