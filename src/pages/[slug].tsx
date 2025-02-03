import { useRouter } from "next/router";
import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { trpc } from "../utils/trpc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { FaRegComment } from "react-icons/fa";
import CommentSidebar from "../components/CommentSidebar";
import { RiImageAddFill } from "react-icons/ri";

import UnsplashGallary from "../components/UnsplashGallary/Index";
import { useSession } from "next-auth/react";
import Image from "next/image";

const PostPage = () => {
  const { data } = useSession();
  const [isUnsplashModelOpen, setIsUnsplashModelOpen] = useState(false);
  const router = useRouter();

  const post = trpc.post.getPost.useQuery(
    {
      slug: router.query.slug as string,
    },
    {
      enabled: !!router.query.slug,
    }
  );

  const likePost = trpc.post.likePost.useMutation({
    onSuccess: () => {
      postRoute.invalidate();
    },
  });
  const dislikePost = trpc.post.dislikePost.useMutation({
    onSuccess: () => {
      postRoute.invalidate();
    },
  });

  const postRoute = trpc.useUtils().post;

  const [showCommentSidebar, setShowCommentSidebar] = useState(false);

  return (
    <MainLayout>
      {post.isSuccess && post.data && (
        <UnsplashGallary
          isUnsplashModelOpen={isUnsplashModelOpen}
          setIsUnsplashModelOpen={setIsUnsplashModelOpen}
          postId={post.data?.id}
          slug={post.data.slug}
        />
      )}

      {post.data?.id && (
        <CommentSidebar
          showCommentSidebar={showCommentSidebar}
          setShowCommentSidebar={setShowCommentSidebar}
          postId={post.data?.id}
        />
      )}
      {post.isLoading && (
        <div className="flex h-full w-full items-center justify-center">
          <div>Loading...</div>
          <div>
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
        </div>
      )}
      {post.isSuccess && (
        <div className="fixed bottom-10 flex w-full items-center justify-center">
          <div className="group flex items-center justify-center space-x-4 rounded-full border border-gray-400 bg-white px-6 py-4 hover:border-gray-900">
            <div className="border-r border-gray-400 pr-4 group-hover:border-gray-900">
              {post.data?.likes && post.data.likes.length > 0 ? (
                <FcLike
                  onClick={() =>
                    post.data?.id &&
                    dislikePost.mutate({
                      postId: post.data.id,
                    })
                  }
                  className="cursor-pointer text-2xl"
                />
              ) : (
                <FcLikePlaceholder
                  onClick={() =>
                    post.data?.id &&
                    likePost.mutate({
                      postId: post.data.id,
                    })
                  }
                  className="cursor-pointer text-2xl"
                />
              )}
            </div>
            <div>
              <FaRegComment
                className="cursor-pointer text-xl"
                onClick={() => {
                  setShowCommentSidebar(true);
                }}
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex h-full w-full  flex-col items-center justify-center p-10">
        <div className="flex w-full max-w-screen-lg flex-col space-y-6">
          <div className="relative h-[60vh] rounded-xl bg-gray-300 shadow-lg">
            {post.isSuccess && post.data?.featuredImage && (
              <Image
                src={post.data.featuredImage}
                alt={""}
                fill
                className="rounded-xl"
              />
            )}
            {data?.user?.id === post.data?.authorId && (
              <div
                onClick={() => setIsUnsplashModelOpen(true)}
                className="absolute left-2 top-2 z-10 cursor-pointer rounded-lg bg-black/25 p-2 text-white hover:bg-black/80"
              >
                <RiImageAddFill className="text-3xl" />
              </div>
            )}
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
