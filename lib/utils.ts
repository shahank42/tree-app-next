import { type ClassValue, clsx } from "clsx";
import { RecordModel } from "pocketbase";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}