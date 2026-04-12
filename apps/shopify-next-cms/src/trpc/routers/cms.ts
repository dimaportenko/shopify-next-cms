import { z } from "zod";
import { publicProcedure, router } from "../init";
import { getCmsPageBySlug } from "@/lib/shopify/queries/cms-pages";
import { getCollectionByHandle } from "@/lib/shopify/queries/collections";
import { PAGE_TYPE_VALUES } from "@/app/cms/_lib/page-types";
import type { PageType } from "@/lib/shopify/types";
import { TRPCError } from "@trpc/server";

const pageTypeSchema = z
  .enum(PAGE_TYPE_VALUES as [PageType, ...PageType[]])
  .default("general");

export const cmsRouter = router({
  getPageBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        pageType: pageTypeSchema,
      }),
    )
    .query(async ({ input }) => {
      const page = await getCmsPageBySlug({
        slug: input.slug,
        pageType: input.pageType,
      });

      if (!page) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Page not found" });
      }

      return page;
    }),

  getCollectionByHandle: publicProcedure
    .input(z.object({ handle: z.string().min(1) }))
    .query(async ({ input }) => {
      const collection = await getCollectionByHandle({
        handle: input.handle,
      });

      if (!collection) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Collection not found",
        });
      }

      return collection;
    }),
});
