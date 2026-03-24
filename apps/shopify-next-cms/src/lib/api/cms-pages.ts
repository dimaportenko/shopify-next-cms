import type { CmsPage, PageType } from "@/lib/shopify/types";

export async function fetchCmsPageBySlug({
  slug,
  pageType,
}: {
  slug: string;
  pageType: PageType;
}): Promise<CmsPage> {
  const response = await fetch(
    `/api/cms/pages/${encodeURIComponent(slug)}?pageType=${encodeURIComponent(pageType)}`,
  );

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(error?.error ?? "Failed to load page");
  }

  return (await response.json()) as CmsPage;
}
