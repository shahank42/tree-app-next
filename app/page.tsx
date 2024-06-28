import FeedCard from "@/components/FeedCard";


const FEED_ITEMS = [
  {
    id: 0,
    username: "shahank",
    descripton: "i planted a tree and i feel like i saved the world",
    picUrl: "/tree.jpg",
    avatarUrl: "/avatar.jpg",
  },
  {
    id: 1,
    username: "shahank2",
    descripton: "i planted a tree and i feel like i saved the world",
    picUrl: "/tree.jpg",
    avatarUrl: "/avatar.jpg",
  },
  {
    id: 2,
    username: "shahank2",
    descripton: "i planted a tree and i feel like i saved the world",
    picUrl: "/tree.jpg",
    avatarUrl: "/avatar.jpg",
  },
  {
    id: 3,
    username: "shahank2",
    descripton: "i planted a tree and i feel like i saved the world",
    picUrl: "/tree.jpg",
    avatarUrl: "/avatar.jpg",
  },
];

export default function Home() {
  return (
    <div className="px-2">
      <div className="flex flex-col gap-3 justify-around py-3">
        {FEED_ITEMS.map((item) => (
          <FeedCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}
