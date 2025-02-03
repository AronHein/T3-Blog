import React from "react";
import { trpc } from "../../utils/trpc";
import dayjs from "dayjs";
import Link from "next/link";
import Avatar from "../Avatar";
import Image from "next/image";

function SideSection() {
  const getReadingList = trpc.post.getReadingList.useQuery();

  const getUsers = trpc.userRouter.getUserSuggestions.useQuery();

  return (
    <aside className="sticky top-20 col-span-4 flex h-full w-full flex-col space-y-4 p-6">
      <div>
        <h3 className="my-6 text-lg font-semibold">
          People you might be interested in
        </h3>
        <div className="flex flex-col space-y-4">
          {getUsers.isSuccess &&
            getUsers.data.map((user) => (
              <div
                key={user.id}
                className="flex flex-row items-center space-x-5"
              >
                <div className="relative h-10 w-10 flex-none rounded-full bg-gray-400">
                  {user.image && <Avatar img={user.image} />}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-xs">Some bio text about user</div>
                </div>
                <div>
                  <button className="flex  items-center space-x-3 rounded border border-gray-400 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900">
                    Follow
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="sticky top-20">
        <h3 className="my-6 text-lg font-semibold">Your reading list</h3>
        <div className="flex flex-col space-y-8">
          {getReadingList.data &&
            getReadingList.data.map((bookmark) => (
              <Link
                href={`/${bookmark.post.slug}`}
                key={bookmark.id}
                className="group flex items-center space-x-6"
              >
                <div className="relative aspect-square h-full w-2/5 rounded-xl bg-gray-300">
                  {bookmark.post.featuredImage && (
                    <Image
                      src={bookmark.post.featuredImage}
                      alt={""}
                      fill
                      className="rounded-xl"
                    />
                  )}
                </div>
                <div className="flex w-full flex-col space-y-2">
                  <div className="text-lg font-semibold decoration-indigo-600 group-hover:underline">
                    {bookmark.post.title}
                  </div>
                  <div className="">{bookmark.post.description}</div>
                  <div className="flex w-full items-center space-x-4">
                    <div className="relative h-8 w-8 rounded-full bg-gray-300">
                      {bookmark.post.author.image && (
                        <Avatar img={bookmark.post.author.image} />
                      )}
                    </div>
                    <div>{bookmark.post.author.name} &#x2022;</div>
                    <div>
                      {dayjs(bookmark.post.createdAt).format("DD/MM/YYYY")}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </aside>
  );
}

export default SideSection;
