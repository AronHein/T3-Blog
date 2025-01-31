import React, { Fragment } from "react";
import { FaTimes } from "react-icons/fa";

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import Image from "next/image";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type CommentSidebarProps = {
  showCommentSidebar: boolean;
  setShowCommentSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
};

export const commentFormSchema = z.object({
  text: z.string().min(1),
});

function CommentSidebar({
  showCommentSidebar,
  setShowCommentSidebar,
  postId,
}: CommentSidebarProps) {
  const { register, handleSubmit, reset } = useForm<{ text: string }>({
    resolver: zodResolver(commentFormSchema),
  });

  const postComment = trpc.post.postComment.useMutation({
    onSuccess: () => {
      toast.success("Comment posted!");
      postRoute.invalidate();
      reset();
    },
  });

  const comments = trpc.post.getComments.useQuery({
    postId,
  });

  const postRoute = trpc.useUtils().post;

  return (
    <Transition show={showCommentSidebar} as={Fragment}>
      <Dialog as="div" onClose={() => setShowCommentSidebar(false)}>
        <div className="fixed right-0 top-0">
          <TransitionChild
            enter="transition duration-1000"
            leave="transition duration-1000"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="relative h-screen w-[200px] bg-white shadow-lg sm:w-[400px]">
              <div className="flex h-full w-full flex-col overflow-y-scroll">
                <div className="my-10 flex items-center justify-between px-3">
                  <h2 className="text-xl font-medium">
                    Comments ({comments.data?.length})
                  </h2>
                  <div className="text-xl">
                    <FaTimes
                      className="cursor-pointer"
                      onClick={() => {
                        setShowCommentSidebar(false);
                      }}
                    />
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit((data) => {
                    postComment.mutate({
                      text: data.text,
                      postId: postId,
                    });
                  })}
                  className=" flex h-full w-full flex-col items-end space-y-5 p-5"
                >
                  <textarea
                    id="comment"
                    rows={4}
                    className=" w-full rounded-xl border border-gray-300 p-4 shadow-lg outline-none focus:border-gray-600"
                    placeholder="What are your thoughts?"
                    {...register("text")}
                  />
                  <button
                    type="submit"
                    className="flex  items-center space-x-3 rounded border border-gray-300 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
                  >
                    Comment
                  </button>
                </form>
                <div className="h-full w-full">
                  {comments.isSuccess &&
                    comments.data.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex w-full flex-col space-y-2 border-b p-4 last:border-none"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="relative h-10 w-10 rounded-full bg-gray-300">
                            {comment.user.image && (
                              <Image
                                src={comment.user.image}
                                fill
                                className="rounded-full"
                                alt={""}
                              />
                            )}
                          </div>
                          <p className="font-semibold">
                            {comment.user.name} &#x2022;{" "}
                            {dayjs(comment.createdAt).fromNow()}
                          </p>
                        </div>
                        <div className="text-sm text-gray-600">
                          {comment.text}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}

export default CommentSidebar;
