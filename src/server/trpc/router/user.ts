import { protectedProcedure, router } from "../trpc";

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
                // orderBy: {
                //     createdAt: "desc"
                // }
            })
            
            return users
        })
})