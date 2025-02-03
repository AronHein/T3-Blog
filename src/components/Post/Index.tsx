import React, { useState } from "react";
import Link from "next/link";
import { CiBookmarkPlus } from "react-icons/ci";
import { CiBookmarkCheck } from "react-icons/ci";
import dayjs from "dayjs";
import Image from "next/image";
import type { RouterOutputs } from "../../utils/trpc";
import { trpc } from "../../utils/trpc";
import Avatar from "../Avatar";

type PostProps = RouterOutputs["post"]["getPosts"][number];

const Post = ({ ...post }: PostProps) => {
  const [isBookMarked, setIsBookMarked] = useState(
    Boolean(post.bookmarks?.length)
  );

  const bookmarkPost = trpc.post.bookmarkPost.useMutation({
    onSuccess: () => {
      setIsBookMarked((prev) => !prev);
    },
  });

  const removeBookmark = trpc.post.removeBookmark.useMutation({
    onSuccess: () => {
      setIsBookMarked((prev) => !prev);
    },
  });

  return (
    <div
      key={post.id}
      className="mt-6 flex flex-col space-y-4 border-b border-gray-300 pb-8 first:mt-0 last:border-none"
    >
      <Link
        href={`/user/${post.author.username}`}
        className="group flex w-full cursor-pointer items-center space-x-2 "
      >
        <div className="relative h-10 w-10 rounded-full bg-gray-300">
          {post.author.image && <Avatar img={post.author.image} />}
        </div>
        <div>
          <p className="font-semibold">
            <span className="decoration-indigo-600 group-hover:underline">
              {post.author.name}
            </span>{" "}
            &#x2022; {dayjs(post.createdAt).format("DD/MM/YYYY")}
          </p>
          <p className="text-sm">Some bio text</p>
        </div>
      </Link>
      <Link
        href={`/${post.slug}`}
        className="group grid w-full grid-cols-12 gap-4"
      >
        <div className="col-span-8 flex flex-col space-y-4">
          <p className="text-2xl font-bold text-gray-800 decoration-indigo-600 group-hover:underline">
            {post.title}
          </p>
          <p className="break-words text-sm text-gray-500">
            {post.description}
          </p>
        </div>
        <div className="col-span-4">
          <div className="relative aspect-[16/9] h-full w-full  transform rounded-xl bg-gray-200 transition duration-300 hover:scale-105 hover:shadow-xl">
            {post.featuredImage && (
              <Image
                src={post.featuredImage}
                alt={""}
                fill
                className="rounded-xl"
              />
            )}
          </div>
        </div>
      </Link>
      <div>
        <div className="flex w-full items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-200/50 px-5 py-3">
                tag {i}
              </div>
            ))}
          </div>
          <div>
            {isBookMarked ? (
              <CiBookmarkCheck
                className="cursor-pointer text-3xl"
                onClick={() => {
                  removeBookmark.mutate({
                    postId: post.id,
                  });
                }}
              />
            ) : (
              <CiBookmarkPlus
                className="cursor-pointer text-3xl text-indigo-600"
                onClick={() => {
                  bookmarkPost.mutate({
                    postId: post.id,
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
