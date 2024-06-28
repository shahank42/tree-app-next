"use client";

import React, { useEffect, useState } from "react";
import OnboardingForm from "./OnboardingForm";
import { pb } from "@/lib/pbClient";
import { useRouter } from "next/navigation";
import { RecordModel } from "pocketbase";
import { convertToUser } from "@/lib/utils";

function Onboarding({ walletAddress }: { walletAddress: string }) {
  const router = useRouter();
  const [userPresent, setUserPresent] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await pb
          .collection("users_table")
          .getFirstListItem(`wallet_address="${walletAddress}"`);

        console.log(result);

        setUserPresent(true);
        router.push(`/user/${result.name}`);
      } catch (e) {
        setUserPresent(false);

        // const { items } = await pb.collection("users_table").getList(1, 20, {
        //   filter: `wallet_address = ${walletAddress}`,
        // });

        // const users = convertToUser(items);

        setUserPresent(false);
      }
    })();
  });

  return !userPresent && <OnboardingForm walletAddress={walletAddress} />;
}

export default Onboarding;
