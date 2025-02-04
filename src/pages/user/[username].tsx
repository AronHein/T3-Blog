import React from "react";
import MainLayout from "../../layouts/MainLayout";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Post from "../../components/Post/Index";
import { postcss } from "tailwindcss";
import Avatar from "../../components/Avatar";

const UserProfilePage = () => {
  const router = useRouter();
  const { username } = router.query;

  const userProfile = trpc.userRouter.getUserProfile.useQuery(
    { username: username as string },
    {
      enabled: !!username, // Only run the query if `username` is available
    }
  );

  const userPosts = trpc.userRouter.getUserPosts.useQuery(
    { username: username as string },
    {
      enabled: !!username,
    }
  );

  return (
    <MainLayout>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="my-10 flex h-full w-full max-w-screen-lg flex-col items-center justify-center rounded-b-3xl shadow-lg">
          <div className="flex w-full flex-col rounded-3xl bg-white">
            <div className="flex h-full w-full flex-col">
              <div className="relative h-44 w-full rounded-t-3xl bg-gradient-to-b from-red-200  to-yellow-100">
                <div className="absolute -bottom-10 left-12">
                  <div className="relative h-24 w-24 rounded-full border-2 border-white bg-white">
                    {userProfile.data?.image && (
                      <Avatar img={userProfile.data.image} />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-12 mt-10 flex flex-col space-y-1 rounded-b-3xl py-5">
              <div className="text-2xl font-semibold text-gray-800">
                {userProfile.data?.name}
              </div>
              <div className="text-gray-600">@{userProfile.data?.username}</div>
              <div className="text-gray-600">
                {userProfile.data?._count.posts ?? 0} Posts
              </div>
              <div className="flex">
                <div className="pr-6 text-gray-600">
                  {userProfile.data?._count.followedBy ?? 0} Followers
                </div>
                <div className="text-gray-600">
                  {userProfile.data?._count.following ?? 0} Users Following
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 max-w-screen-lg">
          {userPosts.isSuccess &&
            userPosts.data.map((post, i) => <Post {...post} key={i} />)}
        </div>
      </div>
    </MainLayout>
  );
};

export default UserProfilePage;
