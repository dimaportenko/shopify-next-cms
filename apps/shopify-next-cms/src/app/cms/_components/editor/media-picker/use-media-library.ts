"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export interface MediaImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export function useMediaLibrary(search?: string) {
  const trpc = useTRPC();

  return useInfiniteQuery(
    trpc.media.list.infiniteQueryOptions(
      { search },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    ),
  );
}
