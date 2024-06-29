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
import { getWalletAddressCookie, isLoggedIn } from "@/lib/actions/auth";
import { useUserStore } from "@/lib/stores/user";
import { pb } from "@/lib/pbClient";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  useEffect(() => {
    (async () => {
      const walletAddress = await getWalletAddressCookie();

      try {
        const result = await pb
          .collection("users_table")
          .getFirstListItem(`wallet_address="${walletAddress?.value}"`);

        console.log("nav fetched", result);

        const user = {
          name: result.name,
          bio: result.bio,
          id: result.id,
          walletAddress: result.wallet_address,
        };

        updateUser(user);

        router.push(`/user/${result.name}`);
      } catch (e) {}
    })();
  }, []);

  console.log("useris", user);

  useEffect(() => {
    (async () => {
      setLoggedIn(await isLoggedIn());
    })();
  });

  return (
    <div className="fixed sm:sticky  bottom-0 w-full">
      <nav className=" w-full bg-card border border-input py-3 sm:rounded-md">
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
              href={`/user/${user.name}`}
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
