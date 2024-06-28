"use client";

import { generatePayload, isLoggedIn, login, logout } from "@/lib/actions/auth";
import { client } from "@/lib/thirdWebClient";
import React from "react";
import { ConnectButton } from "thirdweb/react";

function Login() {
  return (
    <div className="w-full flex justify-center items-center h-[calc(100dvh-77.19px)]">
      <div className="flex flex-col items-center w-full gap-2">
        <span className="">Log In to NFTree</span>
        <ConnectButton
          client={client}
          auth={{
            isLoggedIn: async (address) => {
              console.log("checking if logged in!", { address });
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
      </div>
    </div>
  );
}

export default Login;
