"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Data } from "@puckeditor/core";
import type { PageType } from "@/lib/shopify/types";
import {
  createCmsPage,
  updateCmsPage,
  deleteCmsPage,
  getCmsPageBySlug,
} from "@/lib/shopify/queries/cms-pages";
import { isValidPageType } from "./page-types";
import {
  FRAGMENT_DEFINITIONS,
  isFragmentSlug,
  type FragmentSlug,
} from "./fragments";

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

  if (pageType === "fragment") {
    revalidatePath("/", "layout");
  } else {
    revalidatePath(`/${slug}`);
  }
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

export async function editFragmentAction(formData: FormData) {
  const rawSlug = formData.get("slug");
  if (typeof rawSlug !== "string" || !isFragmentSlug(rawSlug)) {
    throw new Error(`Invalid fragment slug: ${String(rawSlug)}`);
  }
  const slug: FragmentSlug = rawSlug;

  const existing = await getCmsPageBySlug({ slug, pageType: "fragment" });
  if (!existing) {
    const definition = FRAGMENT_DEFINITIONS.find((f) => f.slug === slug);
    const label = definition?.label ?? slug;
    await createCmsPage(label, slug, "fragment");
    revalidatePath("/cms");
  }

  redirect(`/cms/fragment/${slug}/edit`);
}
