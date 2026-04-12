import { useQuery, skipToken } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useCollectionByHandle(handle: string | null) {
  const trpc = useTRPC();

  return useQuery(
    trpc.cms.getCollectionByHandle.queryOptions(
      handle ? { handle } : skipToken,
    ),
  );
}
