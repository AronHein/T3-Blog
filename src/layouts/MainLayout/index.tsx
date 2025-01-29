import React from "react";

import { VscThreeBars } from "react-icons/vsc";
import { GoBell } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";
import { signIn, useSession, signOut } from "next-auth/react";
import { IoMdLogOut } from "react-icons/io";

const MainLayout = ({ children }: React.PropsWithChildren) => {
  const { data: sessionData, status } = useSession();

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex h-20 w-full flex-row items-center justify-around border-b border-gray-200 bg-white">
        <div className="text-2xl text-gray-600">
          <VscThreeBars />
        </div>
        <div className="text-xl font-thin">Blog</div>
        {status === "authenticated" ? (
          <div className="flex items-center space-x-4">
            <div>
              <GoBell className="text-2xl text-gray-600" />
            </div>
            <div className="h-5 w-5 rounded-full bg-gray-600"></div>
            <div>
              <button className="flex  items-center space-x-3 rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900">
                <div>Write</div>
                <div>
                  <FaRegEdit />
                </div>
              </button>
            </div>
            <div>
              <button
                onClick={() => signOut()}
                className="flex  items-center space-x-3 rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
              >
                <div>Logout</div>
                <div>
                  <IoMdLogOut />
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => signIn()}
              className="flex  items-center space-x-3 rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
            >
              SignIn
            </button>
          </div>
        )}
      </header>

      <div>{children}</div>
    </div>
  );
};

export default MainLayout;
