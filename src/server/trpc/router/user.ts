import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const userRouter = router({
    getUserSuggestions: protectedProcedure
        .query(async ({ctx:{prisma}}) => {
            const users = await prisma.user.findMany({
                take: 4,
                select: {
                    name: true,
                    image: true,
                    id: true,
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
            
            return users
        }),

    getUserProfile: publicProcedure
        .input(z.object({
            username: z.string()
        }))
        .query(async ({ctx, input}) => {
        return await prisma?.user.findUnique({
            where: {
                username: input.username
            },
            select: {
                id:true,
                name:true,
                image: true,
                username: true,
                _count: {
                    select: {
                        posts: true
                    }
                }
            }
        })
    }),

    getUserPosts: publicProcedure
        .input(z.object({
            username: z.string()
        }))
        .query(async ({ctx, input}) => {
            return await ctx.prisma.post.findMany({
                where: {
                    author: {
                        username: input.username
                    }
                },
                select: {
                    id:true,
                    description:true,
                    title: true,
                    slug: true,
                    createdAt: true,
                    featuredImage: true,
                    author: {
                        select: {
                            name: true,
                            image: true,
                            username: true
                        }
                    }
                }
            })
        })
})