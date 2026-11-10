import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/hooks/useTours";

/**
 * One cache for the whole app. Every component asking for the same data
 * shares a single in-flight request, results are reused for 10 minutes, and
 * requests are aborted when the component that needed them unmounts — so a
 * visitor browsing the site sends the home server a handful of requests
 * instead of one per component per page view.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        // Retry only genuine network failures, once, instead of hammering a struggling server.
        retry: (failureCount, error) =>
          error instanceof ApiError && error.kind === "network" && failureCount < 1,
        retryDelay: 1500,
      },
    },
  });
}
