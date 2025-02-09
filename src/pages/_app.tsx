import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { GlobalContextProvider } from "../contexts/GlobalContexProvider/Index";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <GlobalContextProvider>
      <Toaster />
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </GlobalContextProvider>
  );
};

export default trpc.withTRPC(MyApp);
