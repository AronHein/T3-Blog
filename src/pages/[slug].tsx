import { useRouter } from "next/router";
import React from "react";
import MainLayout from "../layouts/MainLayout";
import { trpc } from "../utils/trpc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const PostPage = () => {
  const router = useRouter();

  const post = trpc.post.getPost.useQuery(
    {
      slug: router.query.slug as string,
    },
    {
      enabled: !!router.query.slug,
    }
  );

  return (
    <MainLayout>
      {post.isLoading && (
        <div className="flex h-full w-full items-center justify-center">
          <div>Loading...</div>
          <div>
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
        </div>
      )}
      <div className="flex h-full w-full  flex-col items-center justify-center p-10">
        <div className="flex w-full max-w-screen-lg flex-col space-y-6">
          <div className="relative h-[60vh] rounded-xl bg-gray-300 shadow-lg">
            <div className="absolute flex h-full w-full items-center justify-center">
              <div className="rounded-xl bg-black p-4 text-3xl text-white opacity-50">
                {post.data?.title}
              </div>
            </div>
          </div>
          <div className="border-l-4 border-gray-800 pl-6">
            {post.data?.description}
          </div>
          <div>{post.data?.text}</div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PostPage;
