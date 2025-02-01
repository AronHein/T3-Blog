import slugify from "slugify";
import { WriteFormSchema } from "../../../components/WriteFormModal/Index";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {  z } from "zod";

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

    getPosts: publicProcedure.query(async ({ctx:{prisma, session}}) => {
        const posts = prisma.post.findMany({
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id:true,
                description:true,
                title: true,
                slug: true,
                createdAt: true,
                author: {
                    select: {
                        name: true,
                        image: true
                    }
                },
                bookmarks: session?.user?.id ?{
                    where: {
                        userId: session?.user?.id
                    }
                }: false
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
    
    postComment: protectedProcedure
        .input(z.object({
            text: z.string().min(1),
            postId: z.string(),
          }))
        .mutation(async ({ctx:{prisma, session}, input}) => {
            await prisma.comment.create({
                data: {
                    text: input.text,
                    postId: input.postId,
                    userId: session.user.id
                }
            })
        }),

        getComments: publicProcedure.input(z.object({
            postId: z.string()
        }))
            .query(async ({ctx:{prisma}, input}) => {
            const comments = await prisma.comment.findMany({
                where: {
                    postId: input.postId
                },
                orderBy: {
                    createdAt: "desc"
                },
                select:{
                    id:true,
                    text:true,
                    createdAt: true,
                    user: {
                        select: {
                            name:true,
                            image:true
                        }
                    }
                }
            })
    
            return comments
        }),

        bookmarkPost: protectedProcedure.input(z.object({
            postId: z.string()
            }))
            .mutation(async ({ctx:{prisma, session}, input:{postId}}) => {
    
                await prisma.bookmark.create({
                    data:{
                        userId: session.user.id,
                        postId
                    }
                })
    
            }),

        removeBookmark: protectedProcedure.input(z.object({
            postId: z.string()
            }))
            .mutation(async ({ctx:{prisma, session}, input:{postId}}) => {
    
                await prisma.bookmark.delete({
                    where:{
                        userId_postId: {
                            postId: postId,
                            userId: session.user.id
                        }
                    }
                })
    
            }),

        getReadingList: protectedProcedure
            .query(async ({ctx:{prisma, session}}) => {
                const readingList = await prisma.bookmark.findMany({
                    where: {
                        userId: session.user.id
                    },
                    take: 4,
                    orderBy: {
                        createdAt: "desc"
                    },
                    select: {
                        id: true,
                        post: {
                            select: {
                                title:true,
                                description: true,
                                createdAt: true,
                                slug: true,
                                author: {
                                    select: {
                                        name: true,
                                        image: true
                                    }
                                }
                            }
                        }
                    }
                })
                return readingList
            })

})