import type { ComponentConfig } from "@puckeditor/core";
import { CollectionProductsSection } from "@/components/collection-products-section";
import type { CollectionDto } from "@/lib/shopify/types";

export type CollectionProductsBlockProps = Record<string, never>;

interface CollectionBlockMetadata {
  collection?: CollectionDto | null;
}

function CollectionProductsBlockRender({
  puck,
}: CollectionProductsBlockProps & {
  puck?: { metadata?: CollectionBlockMetadata };
}) {
  const collection = puck?.metadata?.collection ?? null;

  return <CollectionProductsSection collection={collection} />;
}

export const collectionProductsBlockConfig: ComponentConfig<CollectionProductsBlockProps> =
  {
    fields: {},
    defaultProps: {},
    render: CollectionProductsBlockRender,
  };
