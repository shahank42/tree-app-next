"use client";

import { showBalance } from "@/lib/web3";
import React, { useState } from "react";

function DisplayCarbonBalance({ walletAddress }: { walletAddress: string }) {
  const [balance, setBalance] = useState<bigint>();

  showBalance("nftree", walletAddress).then((b) => setBalance(b));

  return <div>{balance}</div>;
}

export default DisplayCarbonBalance;
