import React from "react";

function SideSection() {
  return (
    <aside className="sticky top-20 col-span-4 flex h-full w-full flex-col space-y-4 p-6">
      <div>
        <h3 className="my-6 text-lg font-semibold">
          People you might be interested in
        </h3>
        <div className="flex flex-col space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-row items-center space-x-5">
              <div className="h-10 w-10 flex-none rounded-full bg-gray-400"></div>
              <div>
                <div className="text-sm font-bold text-gray-900">
                  Firstname Lastname
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
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="group flex items-center space-x-6">
              <div className="aspect-square h-full w-2/5 rounded-xl bg-gray-300"></div>
              <div className="flex w-full flex-col space-y-2">
                <div className="text-lg font-semibold decoration-indigo-600 group-hover:underline">
                  Lorem ipsum dolor sit amet consectetur.
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Asperiores voluptates incidunt laborum quis odit.
                </div>
                <div className="flex w-full items-center space-x-4">
                  <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                  <div>Firstname Lastname &#x2022;</div>
                  <div>29 Jan. 2025</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default SideSection;
