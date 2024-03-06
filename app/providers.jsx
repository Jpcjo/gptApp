"use client";

// In Next.js, this file would be called: app/providers.jsx
// We can not useState or useRef in a server component, which is why we are
// extracting this part out into it's own file with 'use client' on top

import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// for each page that want to use react query, will have to set up the code

const Providers = ({ children }) => {
  const [queryClient] = useState(
    // don't need the second argument as we don't want queryClient to be updated
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      })
  ); // this set-up is from the docs

  // In summary, the useState approach ensures that the queryClient is created
  //only once and persists across re-renders, while direct initialization
  //outside of the component may result in the creation of multiple QueryClient
  //instances and potential performance issues.
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
};

export default Providers;
