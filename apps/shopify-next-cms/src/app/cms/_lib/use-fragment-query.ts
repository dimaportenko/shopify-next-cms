import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import type { FragmentSlug } from "@cms/_lib/fragments";
import type { CmsPage } from "@/lib/shopify/types";

export function useFragmentQuery(slug: FragmentSlug, enabled: boolean) {
  const trpc = useTRPC();

  return useQuery({
    ...trpc.cms.getPageBySlug.queryOptions({
      slug,
      pageType: "fragment",
    }),
    enabled,
    retry: false,
    // Narrow tRPC's serialized type back to CmsPage for downstream consumers
    select: (data) => data as CmsPage,
  });
}
