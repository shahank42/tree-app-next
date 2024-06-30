import UpdateForm from "@/components/UpdateForm";
import { getWalletAddressCookie } from "@/lib/actions/auth";
import { pb } from "@/lib/pbClient";
import { useUserStore } from "@/lib/stores/user";
import React from "react";

export default async function Page() {
  // const user = useUserStore((state) => state.user);

  const cookie = await getWalletAddressCookie();
  const cookieWalletAddress = cookie?.value;

  const user = await pb
    .collection("users_table")
    .getFirstListItem(`wallet_address="${cookieWalletAddress}"`);

  const userTrees = await pb.collection("trees").getFullList({
    filter: `user_id="${user.id}"`,
  });

  console.log(await getWalletAddressCookie())


  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col items-center w-full gap-2 px-4 pt-10">
        <UpdateForm userTrees={userTrees} />
      </div>
    </div>
  );
}
