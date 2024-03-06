import React from "react";
import Chat from "@/components/Chat";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

//React Query supports prefetching multiple queries on the server in Next.js
//and then dehydrating those queries to the queryClient. This means the server
//can prerender markup that is immediately available on page load and
//as soon as JS is available, React Query can upgrade or hydrate those
//queries with the full functionality of the library. This includes refetching
//those queries on the client if they have become stale since the time they
//were rendered on the server.

//In summary, these components and functions work together to ensure that
//server-rendered data is properly hydrated on the client side, allowing
//for seamless integration of server-rendered and client-rendered content
//in a Next.js application.

const ChatPage = async () => {
  const queryClient = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* Hydration refers to the process of restoring the client-side state of 
      a React application to match the state that was rendered on the server. */}
      <Chat />
    </HydrationBoundary>
  );
};

export default ChatPage;
