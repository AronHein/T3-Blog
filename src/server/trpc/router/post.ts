import slugify from "slugify";
import { WriteFormSchema } from "../../../components/WriteFormModal/Index";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const postRouter = router({
    createPost: protectedProcedure
        .input(WriteFormSchema)
        .mutation(async ({ctx:{prisma, session}, input:{title, description, text}}) => {
            
            const existingPost = await prisma.post.findUnique({
                where: {
                    title: title
                }
            })

            if (existingPost) {
                throw new TRPCError({
                  code: "CONFLICT",
                  message: "post with this title already exists!",
                });
              }
            
            await prisma.post.create({
                data: {
                    title,
                    description,
                    text,
                    slug: slugify(title),
                    authorId: session.user.id
                }
            })
        })
})