import { type ClassValue, clsx } from "clsx";
import { RecordModel } from "pocketbase";
import { twMerge } from "tailwind-merge";
import { User } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToUser(items: RecordModel[]) {
  const users: User[] = [];
  items.forEach((item) => {
    const user = {
      id: item.id as string,
      name: item.name as string,
      bio: item.bio as string,
      walletAddress: item.wallet_address as string,
    };
    users.push(user);
  });

  return users;
}
