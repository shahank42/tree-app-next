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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

  // State to control dialog visibility
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to handle button click and close the dialog
  const handleClose = () => {
    setIsDialogOpen(false);
  };

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

        // router.push(`/user/${result.name}`);
      } catch (e) {}
    })();
  }, []);

  // console.log("useris", user);

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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className={cn(
                  buttonVariants({
                    variant: "default",
                  }),
                  "flex gap-2 size-[3.2rem] rounded-full"
                )}
              >
                <UploadIcon />
              </Button>
            </DialogTrigger>
            <DialogContent className="flex justify-center items-center sm:max-w-[425px] w-[calc(80vw)] rounded-md">
              <Link
                href="/upload"
                className="rounded-full w-1/2"
                onClick={handleClose}
              >
                <Button>
                  Plant a new tree <br /> <UploadIcon className="ml-2" />
                </Button>
              </Link>
              <Link
                href="/update"
                className="rounded-full w-1/2"
                onClick={handleClose}
              >
                <Button>
                  Show us your Tree <br /> <UploadIcon className="ml-2" />
                </Button>
              </Link>{" "}
            </DialogContent>
          </Dialog>

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
