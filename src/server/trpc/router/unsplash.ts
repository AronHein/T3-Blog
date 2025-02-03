import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { createApi } from 'unsplash-js';
import { env } from "../../../env/server.mjs";
import { TRPCError } from "@trpc/server";

const unsplash = createApi({
  accessKey: env.UNSPLASH_API_ACCESS_KEY,
});

export const unsplashRouter = router({
    getImages: protectedProcedure
        .input(z.object({
            searchQuery: z.string().min(2)
        }))
        .query(async ({input}) => {
            try {
                const images = await unsplash.search.getPhotos({
                    query: input.searchQuery,
                    orientation: "landscape"
                })
                return images.response
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "error while fetching images from unsplash api"
                })
            }

        })
})