"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useCollectionSearch(query: string, enabled: boolean) {
  const trpc = useTRPC();

  return useQuery({
    ...trpc.cms.searchCollections.queryOptions({
      query: query || undefined,
      first: 10,
    }),
    enabled,
  });
}
