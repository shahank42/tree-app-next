import { getWalletAddressCookie } from "@/lib/actions/auth";
import { carbonCreditContract, nftreeContract } from "@/lib/web3";
import { balanceOf as nftreeBalance } from "@/thirdweb/43113/0xc4c88000b368332e1977e5d7a20a1f234f0a0ab6";
import { balanceOf as carbonCreditBalance } from "@/thirdweb/43113/0xcd109d51c3afd7ed5abc9b8d4254624b82798337";
import React from "react";
import { useReadContract } from "thirdweb/react";

async function ShowBalance({
  contractName,
}: {
  contractName: "carbonCredit" | "nftree";
}) {
  const walletAddress = await getWalletAddressCookie();

  if (!walletAddress) return <>X</>;
  else {
    if (contractName === "nftree") {

      const result = await nftreeBalance({
        owner: walletAddress.value,
        contract: nftreeContract,
      });

      return 
    }
    else {

      carbonCreditBalance({
        account: walletAddress.value,
        contract: carbonCreditContract,
      });
    }
  }
}

export default ShowBalance;
