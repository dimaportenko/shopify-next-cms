import { fetchCollectionByHandle } from "@/lib/api/collections";
import type { CollectionDto } from "@/lib/shopify/types";
import {
  getPagePreviewEntity,
  type CmsPagePreviewMetadata,
  type PagePreviewDefinition,
  type PagePreviewEntity,
} from "@cms/_lib/page-preview/shared";

export const collectionPagePreview = {
  pageType: "collection",
  queryKey: "cms-preview-collection",
  rootField: "previewCollectionHandle",
  field: {
    type: "text",
    label: "Preview Collection Handle",
    placeholder: "summer-sale",
    visible: false,
  },
  fetchByHandle: fetchCollectionByHandle,
  buildMetadata: (preview) => ({
    preview: {
      collection: preview,
    },
  }),
} satisfies PagePreviewDefinition<CollectionDto, "previewCollectionHandle">;

export function getCollectionPreview(
  metadata: CmsPagePreviewMetadata | undefined,
): PagePreviewEntity<CollectionDto> {
  return getPagePreviewEntity({
    preview: metadata?.preview?.collection,
    fallbackData: metadata?.collection ?? null,
  });
}
