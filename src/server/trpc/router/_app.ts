import { router } from "../trpc";
import { authRouter } from "./auth";
import { postRouter } from "./post";
import { unsplashRouter } from "./unsplash";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  post: postRouter,
  unsplash: unsplashRouter,
  userRouter: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
