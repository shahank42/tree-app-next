import FeedCard from "@/components/FeedCard";
import { pb } from "@/lib/pbClient";
import { FeedItem } from "@/lib/types";

export default async function Home() {
  const retrievedTreeImageData = await pb
    .collection("tree_images")
    .getFullList();
  const retrievedUserData = await pb.collection("users_table").getFullList();
  const posts: FeedItem[] = [];
  for (const data of retrievedTreeImageData) {
    const feedItem: FeedItem = {} as FeedItem;
    feedItem.id = data.id;
    feedItem.username = retrievedUserData.filter(
      (user) => user.id === data.user_id
    )[0].name as string;
    // feedItem.description = data.description;
    feedItem.user_id = data.user_id;
    feedItem.picUrl = `${process.env.NEXT_PUBLIC_PB_URL}/api/files/tree_images/${data.id}/${data.picUrl}`;
    feedItem.upvotes = data.upvotes;
    feedItem.uuid = data.uuid;
    feedItem.avatarUrl = "/avatar.jpg";
    // feedItem.location = data.location;
    feedItem.date = data.created;
    posts.push(feedItem);
  }

  console.log(posts);

  return (
    <div className="px-2">
      <div className="flex flex-col gap-3 justify-around py-3">
        {posts.map((item) => (
          <FeedCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}
