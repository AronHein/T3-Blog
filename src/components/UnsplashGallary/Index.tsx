import React, { useState } from "react";
import Image from "next/image";
import toast, { LoaderIcon } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useDebounce from "../../hooks/useDebounce";
import { trpc } from "../../utils/trpc";
import Modal from "../Modal";

type UnsplashGallaryProps = {
  isUnsplashModelOpen: boolean;
  setIsUnsplashModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
  slug: string;
};

const UnsplashGallary = ({
  isUnsplashModelOpen,
  setIsUnsplashModelOpen,
  postId,
  slug,
}: UnsplashGallaryProps) => {
  const { register, watch, reset } = useForm<{ searchQuery: string }>({
    resolver: zodResolver(
      z.object({
        searchQuery: z.string().min(2),
      })
    ),
  });

  const watchSearchQuery = watch("searchQuery");
  const debouncedSearchQuery = useDebounce(watchSearchQuery, 3000);

  const fetchUnsplashImages = trpc.unsplash.getImages.useQuery(
    {
      searchQuery: debouncedSearchQuery,
    },
    {
      enabled: Boolean(debouncedSearchQuery),
    }
  );

  const [selectedImage, setSelectedImage] = useState("");

  const utils = trpc.useUtils();

  const updateFeaturedImage = trpc.post.updatePostFeaturedImage.useMutation({
    onSuccess: () => {
      utils.post.getPost.invalidate({ slug });
      setIsUnsplashModelOpen(false);
      reset();
      toast.success("featured image updated succesfully!");
    },
  });

  return (
    <Modal
      isOpen={isUnsplashModelOpen}
      onClose={() => setIsUnsplashModelOpen(false)}
    >
      <div className="flex max-w-xl flex-col space-y-4">
        <input
          type="text"
          id="search"
          {...register("searchQuery")}
          className="h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-600"
        />
        <div className="relative grid h-96  w-full grid-cols-3 place-items-center gap-4 overflow-y-scroll">
          {debouncedSearchQuery && fetchUnsplashImages.isLoading && (
            <div className="flex h-56 w-full items-center justify-center">
              <LoaderIcon />
            </div>
          )}
          {fetchUnsplashImages.isSuccess &&
            fetchUnsplashImages.data?.results.map((imageData) => (
              <div
                key={imageData.id}
                className="group relative aspect-video h-full w-full cursor-pointer "
                onClick={() => setSelectedImage(imageData.urls.full)}
              >
                <div
                  className={`absolute group-hover:bg-black/40 ${
                    selectedImage === imageData.urls.full && "bg-black/40"
                  } inset-0 z-10 h-full w-full`}
                ></div>
                <Image
                  src={imageData.urls.regular}
                  alt={imageData.alt_description ?? ""}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
        </div>

        {selectedImage && (
          <button
            type="submit"
            onClick={() => {
              updateFeaturedImage.mutate({
                imageUrl: selectedImage,
                postId,
              });
            }}
            disabled={updateFeaturedImage.isLoading}
            className="flex  items-center space-x-3 rounded border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:text-gray-900"
          >
            {updateFeaturedImage.isLoading ? "Loading..." : "Select Image"}
          </button>
        )}
      </div>
    </Modal>
  );
};

export default UnsplashGallary;
