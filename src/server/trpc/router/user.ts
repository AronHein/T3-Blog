import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
    getUserSuggestions: protectedProcedure
        .query(async ({ctx:{prisma, session}}) => {
            const users = await prisma.user.findMany({
                where: {
                  id: { not: session.user.id },
                },
                take: 4,
                select: {
                    name: true,
                    image: true,
                    id: true,
                    username:true,
                    followedBy: true,
                    following: true
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
                        posts: true,
                        followedBy: true,
                        following: true
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
        }),

        followUser: protectedProcedure
        .input(
          z.object({
            followingUserId: z.string(),
          })
        )
        .mutation(
          async ({ ctx: { prisma, session }, input: { followingUserId } }) => {
            if (followingUserId === session.user.id) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "you can't follow yourself",
              });
            }
    
            await prisma.user.update({
              where: {
                id: session.user.id,
              },
              data: {
                following: {
                  connect: {
                    id: followingUserId,
                  },
                },
              },
            });
          }
        ),

        unfollowUser: protectedProcedure
            .input(
              z.object({
                followingUserId: z.string(),
              })
            )
            .mutation(
              async ({ ctx: { prisma, session }, input: { followingUserId } }) => {
                await prisma.user.update({
                  where: {
                    id: session.user.id,
                  },
                  data: {
                    following: {
                      disconnect: {
                        id: followingUserId,
                      },
                    },
                  },
                });
              }
            ),

            getAllFollowers: protectedProcedure
            .input(
              z.object({
                userId: z.string(),
              })
            )
            .query(async ({ ctx: { prisma, session }, input: { userId } }) => {
              return await prisma.user.findUnique({
                where: {
                  id: userId,
                },
                select: {
                  followedBy: {
                    select: {
                      name: true,
                      username: true,
                      id: true,
                      image: true,
                      followedBy: {
                        where: {
                          id: session.user.id,
                        },
                      },
                    },
                  },
                },
              });
            }),
            
          getAllFollowing: protectedProcedure
            .input(
              z.object({
                userId: z.string(),
              })
            )
            .query(async ({ ctx: { prisma, session }, input: { userId } }) => {
              return await prisma.user.findUnique({
                where: {
                  id: userId,
                },
                select: {
                  following: {
                    select: {
                      name: true,
                      username: true,
                      id: true,
                      image: true,
                    },
                  },
                },
              });
            }),
})