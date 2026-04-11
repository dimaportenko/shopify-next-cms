import type { ComponentConfig } from "@puckeditor/core";
import { CollectionProductsSection } from "@/components/collection-products-section";
import { getCollectionPreview } from "@cms/_lib/collection-preview";
import type { CmsPagePreviewMetadata } from "@cms/_lib/page-preview/shared";

export type CollectionProductsBlockProps = Record<string, never>;

function CollectionProductsBlockRender({
  puck,
}: CollectionProductsBlockProps & {
  puck?: { metadata?: CmsPagePreviewMetadata };
}) {
  const preview = getCollectionPreview(puck?.metadata);

  return (
    <CollectionProductsSection collection={preview.data} preview={preview} />
  );
}

export const collectionProductsBlockConfig: ComponentConfig<CollectionProductsBlockProps> =
  {
    fields: {},
    defaultProps: {},
    render: CollectionProductsBlockRender,
  };
