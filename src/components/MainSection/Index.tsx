import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import dayjs from "dayjs";
import Image from "next/image";
import { postcss } from "tailwindcss";
import { IoIosSearch } from "react-icons/io";
import { GoChevronDown } from "react-icons/go";
import { trpc } from "../../utils/trpc";
import Link from "next/link";

function MainSection() {
  const getPosts = trpc.post.getPosts.useQuery();

  return (
    <main className="col-span-8 h-full w-full border-r border-gray-300 px-24">
      <div className="flex w-full flex-col space-y-4 py-10">
        <div className="flex w-full items-center space-x-4">
          <label
            htmlFor="search"
            className="relative w-full rounded-3xl border border-gray-900"
          >
            <div className="absolute left-2 flex h-full items-center">
              <IoIosSearch />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className=" w-full rounded-3xl px-4 py-1 pl-7 text-sm outline-none placeholder:text-sm placeholder:text-gray-300"
              placeholder="Search..."
            />
          </label>
          <div className="flex w-full items-center justify-end space-x-4">
            <div>Topics</div>
            <div className="flex items-center space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-3xl bg-gray-200/50 px-4 py-3">
                  tag {i}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between border-b border-gray-300 pb-8">
          <div>Articles</div>
          <div>
            <button className="flex items-center space-x-2 rounded-3xl border border-gray-900 px-4 py-1.5 font-semibold">
              <div>Following</div>
              <div>
                <GoChevronDown className="text-xl" />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col justify-center space-y-8">
        {getPosts.isLoading && (
          <div className="flex h-full w-full items-center justify-center">
            <div>Loading...</div>
            <div>
              <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
          </div>
        )}
        {getPosts.isSuccess &&
          getPosts.data.map((post) => (
            <Link
              href={`/${post.slug}`}
              key={post.id}
              className="group flex flex-col space-y-4 border-b border-gray-300 pb-8 last:border-none"
            >
              <div className="flex w-full items-center space-x-2">
                <div className="relative h-10 w-10 rounded-full bg-gray-300">
                  {post.author.image && (
                    <Image
                      src={post.author.image}
                      fill
                      className="rounded-full"
                      alt={""}
                    />
                  )}
                </div>
                <div>
                  <p className="font-semibold">
                    {post.author.name} &#x2022;{" "}
                    {dayjs(post.createdAt).format("DD/MM/YYYY")}
                  </p>
                  <p className="text-sm">Some bio text</p>
                </div>
              </div>
              <div className="grid w-full grid-cols-12 gap-4">
                <div className="col-span-8 flex flex-col space-y-4">
                  <p className="text-2xl font-bold text-gray-800 decoration-indigo-600 group-hover:underline">
                    {post.title}
                  </p>
                  <p className="break-words text-sm text-gray-500">
                    {post.description}
                  </p>
                </div>
                <div className="col-span-4">
                  <div className="h-full w-full transform rounded-xl bg-gray-200 transition duration-300 hover:scale-105 hover:shadow-xl"></div>
                </div>
              </div>
              <div>
                <div className="flex w-full items-center justify-start space-x-4">
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-2xl bg-gray-200/50 px-5 py-3"
                      >
                        tag {i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </main>
  );
}

export default MainSection;
