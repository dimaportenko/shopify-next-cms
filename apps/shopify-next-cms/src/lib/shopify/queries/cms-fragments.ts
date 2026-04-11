import { cache } from "react";
import type { FragmentSlug } from "@cms/_lib/fragments";
import type { CmsPage } from "../types";
import { getCmsPageBySlug } from "./cms-pages";

export const getCmsFragment = cache(
  async (slug: FragmentSlug): Promise<CmsPage | null> => {
    try {
      return await getCmsPageBySlug({ slug, pageType: "fragment" });
    } catch (error) {
      // getCmsPageBySlug already returns null for "not found" — a thrown
      // error here is a real failure (auth, network, GraphQL). Log it so
      // the silent null fallback doesn't mask production regressions.
      console.error(`[cms] failed to fetch fragment "${slug}":`, error);
      return null;
    }
  },
);
