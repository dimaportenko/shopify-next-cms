"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

export interface MediaImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface MediaPage {
  images: MediaImage[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

export function useMediaLibrary(search?: string) {
  return useInfiniteQuery({
    queryKey: ["cms", "media", search],
    queryFn: async ({ pageParam }): Promise<MediaPage> => {
      const params = new URLSearchParams();
      if (pageParam) params.set("after", pageParam);
      if (search) params.set("search", search);
      const res = await fetch(`/api/cms/media?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load media");
      return res.json();
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNextPage
        ? (lastPage.pageInfo.endCursor ?? undefined)
        : undefined,
  });
}
