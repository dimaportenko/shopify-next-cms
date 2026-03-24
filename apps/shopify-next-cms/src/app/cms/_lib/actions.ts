"use server";

import { revalidatePath } from "next/cache";
import type { Data } from "@puckeditor/core";
import type { PageType } from "@/lib/shopify/types";
import {
  createCmsPage,
  updateCmsPage,
  deleteCmsPage,
  getCmsPageBySlug,
} from "@/lib/shopify/queries/cms-pages";
import { isValidPageType } from "./page-types";

export async function createPageAction(
  title: string,
  slug: string,
  pageType: PageType = "general",
) {
  const page = await createCmsPage(title, slug, pageType);
  revalidatePath("/cms");
  return page;
}

export async function publishPageAction(
  slug: string,
  pageType: PageType,
  data: Data,
) {
  const page = await getCmsPageBySlug({ slug, pageType });
  if (!page) throw new Error(`Page not found: ${slug}`);

  const rootProps = data.root?.props as Record<string, string> | undefined;
  const updatedPageType =
    rootProps?.type && isValidPageType(rootProps.type)
      ? rootProps.type
      : undefined;
  const updatedTitle = rootProps?.title?.trim() || undefined;

  const updated = await updateCmsPage(page.id, {
    puckData: data,
    title: updatedTitle,
    pageType: updatedPageType,
    status: "published",
  });

  revalidatePath(`/${slug}`);
  revalidatePath("/cms");
  return updated;
}

export async function savePageDraftAction(
  slug: string,
  pageType: PageType,
  data: Data,
) {
  const page = await getCmsPageBySlug({ slug, pageType });
  if (!page) throw new Error(`Page not found: ${slug}`);

  const draftRootProps = data.root?.props as Record<string, string> | undefined;
  const draftTitle = draftRootProps?.title?.trim() || undefined;

  const updated = await updateCmsPage(page.id, {
    puckData: data,
    title: draftTitle,
  });

  revalidatePath("/cms");
  return updated;
}

export async function deletePageAction(id: string) {
  await deleteCmsPage(id);
  revalidatePath("/cms");
}
