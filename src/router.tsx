import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function isAbortError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error ?? "");
  return /aborted|network_io_suspended|network error|Failed to fetch|The user aborted/i.test(msg);
}

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error: unknown) => {
          if (isAbortError(error)) return false;
          return failureCount < 2;
        },
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
      },
      mutations: {
        retry: (failureCount, error) => {
          if (isAbortError(error)) return false;
          return failureCount < 1;
        },
        onError: (error) => {
          if (isAbortError(error)) return;
        },
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
