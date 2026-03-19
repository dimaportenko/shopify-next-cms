"use server";

import { revalidatePath } from "next/cache";
import type { Data } from "@puckeditor/core";
import {
  createCmsPage,
  updateCmsPage,
  deleteCmsPage,
  getCmsPageBySlug,
} from "@/lib/shopify/queries/cms-pages";

export async function createPageAction(title: string, slug: string) {
  const page = await createCmsPage(title, slug);
  revalidatePath("/cms");
  return page;
}

export async function publishPageAction(slug: string, data: Data) {
  const page = await getCmsPageBySlug(slug);
  if (!page) throw new Error(`Page not found: ${slug}`);

  const updated = await updateCmsPage(page.id, {
    puckData: data,
    status: "published",
  });

  revalidatePath(`/${slug}`);
  revalidatePath("/cms");
  return updated;
}

export async function savePageDraftAction(slug: string, data: Data) {
  const page = await getCmsPageBySlug(slug);
  if (!page) throw new Error(`Page not found: ${slug}`);

  const updated = await updateCmsPage(page.id, {
    puckData: data,
  });

  revalidatePath("/cms");
  return updated;
}

export async function deletePageAction(id: string) {
  await deleteCmsPage(id);
  revalidatePath("/cms");
}
