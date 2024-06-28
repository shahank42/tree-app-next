"use client";

import Onboarding from "@/components/Onboarding";
import OnboardingForm from "@/components/OnboardingForm";
import { generatePayload, isLoggedIn, login, logout } from "@/lib/actions/auth";
import { pb } from "@/lib/pbClient";
import { client } from "@/lib/thirdWebClient";
import React, { useEffect, useState } from "react";
import { ConnectButton } from "thirdweb/react";

function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    (async () => {
      setLoggedIn(await isLoggedIn());

      // if (loggedIn ) {
      //   console.log("You're address is", walletAddress);
      //   // const resultList = await pb.collection("users_table").getFirstListItem(`wallet_address=${walletAddress}`)

      //   // console.log(resultList);
      // }
    })();
  });

  return (
    <div className="w-full flex justify-center items-center h-[calc(100dvh-77.19px)]">
      <div className="flex flex-col items-center w-full gap-2">
        {loggedIn && walletAddress !== "" ? (
          <>
            <Onboarding walletAddress={walletAddress} />
          </>
        ) : (
          <>
            <span className="">Log In to NFTree</span>
            <ConnectButton
              client={client}
              auth={{
                isLoggedIn: async (address) => {
                  console.log("checking if logged in!", { address });
                  setWalletAddress(address);
                  return await isLoggedIn();
                },
                doLogin: async (params) => {
                  console.log("logging in!");
                  await login(params);
                },
                getLoginPayload: async ({ address }) =>
                  generatePayload({ address }),
                doLogout: async () => {
                  console.log("logging out!");
                  await logout();
                },
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
