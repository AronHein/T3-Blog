import slugify from "slugify";
import { WriteFormSchema } from "../../../components/WriteFormModal/Index";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
        }),

    getPosts: publicProcedure.query(async ({ctx:{prisma}}) => {
        const posts = prisma.post.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include:{
                author:{
                    select:{
                        name:true,
                        image:true
                    }
                }
            }
        })

        return posts
    }),

    getPost: publicProcedure.input(z.object({
        slug:z.string()
        }))
        .query(async ({ctx:{prisma, session}, input:{slug}}) => {
        const post = prisma.post.findUnique({
            where: {
                slug
            },
            select: {
                description: true,
                id:true,
                text: true,
                title: true,
                likes:session?.user?.id ?{
                    where: {
                        userId: session?.user?.id
                    }
                } : false
            }
        })
        return post
        }),


    likePost: protectedProcedure.input(z.object({
        postId: z.string()
        }))
        .mutation(async ({ctx:{prisma, session}, input:{postId}}) => {

            await prisma.like.create({
                data:{
                    userId: session.user.id,
                    postId
                }
            })

        }),

    dislikePost: protectedProcedure.input(z.object({
        postId: z.string()
        }))
        .mutation(async ({ctx:{prisma, session}, input:{postId}}) => {

            await prisma.like.delete({
                where:{
                    userId_postId: {
                        postId: postId,
                        userId: session.user.id
                    }
                }
            })

        }),

})