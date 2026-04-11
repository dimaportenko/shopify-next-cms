import type { CollectionDto } from "@/lib/shopify/types";

export async function fetchCollectionByHandle(
  handle: string,
): Promise<CollectionDto | null> {
  const response = await fetch(
    `/api/cms/collections/${encodeURIComponent(handle)}`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(error?.error ?? "Failed to load collection preview");
  }

  return (await response.json()) as CollectionDto;
}
