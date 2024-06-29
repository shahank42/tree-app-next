import { avalancheFuji } from 'thirdweb/chains';
import { createThirdwebClient, getContract } from "thirdweb";
import { client } from "./thirdWebClient";
import { getWalletAddressCookie } from "./actions/auth";
import { balanceOf as nftreeBalance } from "@/thirdweb/43113/0xc4c88000b368332e1977e5d7a20a1f234f0a0ab6";
import { balanceOf as carbonCreditBalance } from "@/thirdweb/43113/0xcd109d51c3afd7ed5abc9b8d4254624b82798337";

export const carbonCreditContract = getContract({
  client: client,
  chain: avalancheFuji,
  address: "0xcD109d51C3AfD7Ed5aBC9b8d4254624b82798337",
});

export const nftreeContract = getContract({
  client: client,
  chain: avalancheFuji,
  address: "0xc4c88000b368332e1977e5d7a20A1f234f0A0AB6",
});

export async function showBalance(
  contractName: "carbonCredit" | "nftree",
  walletAddress: string
) {
  if (contractName === "nftree") {
    const result = await nftreeBalance({
      owner: walletAddress,
      contract: nftreeContract,
    });

    return result;
  } else {
    const result = await carbonCreditBalance({
      account: walletAddress,
      contract: carbonCreditContract,
    });
    return result;
  }
}
