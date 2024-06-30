import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FeedCard from "@/components/FeedCard";
import { pb } from "@/lib/pbClient";
import { FeedItem, UserTreeItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { TransactionButton } from "thirdweb/react";
import { claimCredit } from "@/thirdweb/43113/0xdcee2dd10dd46086cc1d2b0825a11ffc990e6eff";
import { useUserStore } from "@/lib/stores/user";
import { carbonCreditContract, nftreeContract } from "@/lib/web3";
import { getWalletAddressCookie } from "@/lib/actions/auth";

export default async function page({ params }: { params: { id: string } }) {
  try {
    const result = await pb
      .collection("trees")
      .getFirstListItem(`tree_uuid="${params.id}"`);

    const tree: UserTreeItem = {
      id: result.id,
      name: result.name,
      tree_uuid: result.tree_uuid,
      type: result.type,
      user_id: result.user_id,
      created: result.created,
    };

    console.log(await getWalletAddressCookie());

    const createdDate: Date = new Date(tree.created);
    const currentDate: Date = new Date();
    const timeDifference: number =
      currentDate.getTime() - createdDate.getTime();
    const total_credit = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    const retrievedData = await pb.collection("tree_images").getFullList({
      filter: `tree_id="${tree?.id}"`,
    });
    const retrievedUserData = await pb
      .collection("users_table")
      .getFirstListItem(`id="${tree?.user_id}"`);
    // const retrievedData = await pb.collection("posts").getFullList();

    const tree_images: FeedItem[] = [];
    for (const data of retrievedData) {
      const item: FeedItem = {} as FeedItem;
      item.id = data.id;
      item.picUrl = `${process.env.NEXT_PUBLIC_PB_URL}/api/files/tree_images/${data.id}/${data.picUrl}`;
      item.upvotes = data.upvotes;
      item.created = data.created;
      tree_images.push(item);
    }

    const userTreeImages = await pb.collection("tree_images").getFullList();
    const upvotes = await pb.collection("upvotes").getFullList();
    const walletAddress = await getWalletAddressCookie();

    return (
      <>
        <div className="flex justify-center items-center m-2 sm:m-8">
          <Card className="w-full">
            <CardHeader className="bg-muted/20 p-6">
              <div className="flex items-center gap-4">
                <div className="flex w-full justify-between">
                  <h2 className="text-2xl font-bold">{tree?.name}</h2>
                  {/* <Button onClick={}>Claim CC!</Button> */}
                  <TransactionButton
                    transaction={() => {
                      return claimCredit({
                        to: walletAddress?.value || "",
                        tokenId: result.tokenId,
                        contract: nftreeContract,
                      });
                    }}
                  >
                    Claim CC!
                  </TransactionButton>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-0 grid gap-4">
              <div className="grid gap-2">
                <h3 className="text-lg font-semibold">About</h3>
                <p className="text-muted-foreground">
                  Type: <span className="font-bold">{tree.type}</span>
                </p>
                <p className="text-muted-foreground">
                  Created By: <span className="font-bold">{tree.user_id}</span>
                </p>
                <p className="text-muted-foreground">
                  Carbon Credit Genarated:{" "}
                  <span className="font-bold">{total_credit}</span>
                </p>
                <p className="text-muted-foreground">
                  Created On:{" "}
                  <span className="font-bold">
                    {new Date(tree.created).toDateString()}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="px-2">
          <div className="flex flex-col gap-3 justify-around py-3">
            {tree_images.map(async (item) => (
              <FeedCard key={item.id} data={item} upvotes={upvotes} />
            ))}
          </div>
        </div>
      </>
    );
  } catch (e) {
    // setUserPresent(false);
    console.error(e);
    return <div className="flex justify-center items-center">Loading...</div>;
  }
}
