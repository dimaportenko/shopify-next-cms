import type { ShopifyConfig } from "./shopify-client.js";
import { graphql } from "./shopify-client.js";
import { getCollectionIdMap } from "./collections.js";
import { getProductIdMap } from "./products.js";
import { debug, error, info, progress, success } from "../utils/logger.js";

const COLLECTION_ADD_PRODUCTS_MUTATION = `
  mutation collectionAddProducts($id: ID!, $productIds: [ID!]!) {
    collectionAddProducts(id: $id, productIds: $productIds) {
      collection {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function assignProductsToCollections(
  config: ShopifyConfig,
  collectionMembership: Map<string, string[]>,
): Promise<number> {
  const collectionIds = getCollectionIdMap();
  const productIds = getProductIdMap();
  let totalAssigned = 0;

  const entries = [...collectionMembership.entries()];

  for (let i = 0; i < entries.length; i++) {
    const [handle, skus] = entries[i];
    progress(
      i + 1,
      entries.length,
      `Assigning products to collection: ${handle}`,
    );

    const collectionId = collectionIds.get(handle);
    if (!collectionId) {
      debug(`No collection ID found for handle: ${handle}`);
      continue;
    }

    // Resolve SKUs to product GIDs
    const resolvedProductIds = skus
      .map((sku) => productIds.get(sku))
      .filter((id): id is string => !!id);

    if (resolvedProductIds.length === 0) {
      debug(`No products found for collection: ${handle}`);
      continue;
    }

    // Deduplicate product IDs
    const uniqueProductIds = [...new Set(resolvedProductIds)];

    // Shopify allows max 250 products per mutation
    const batchSize = 250;
    for (let j = 0; j < uniqueProductIds.length; j += batchSize) {
      const batch = uniqueProductIds.slice(j, j + batchSize);

      try {
        const result = await graphql<{
          collectionAddProducts: {
            userErrors: Array<{ field: string[]; message: string }>;
          };
        }>(config, COLLECTION_ADD_PRODUCTS_MUTATION, {
          id: collectionId,
          productIds: batch,
        });

        if (result.collectionAddProducts.userErrors.length > 0) {
          const errs = result.collectionAddProducts.userErrors
            .map((e) => e.message)
            .join("; ");
          error(`Failed to assign products to ${handle}: ${errs}`);
        } else {
          totalAssigned += batch.length;
        }
      } catch (err) {
        error(
          `Error assigning products to ${handle}: ${err instanceof Error ? err.message : err}`,
        );
      }
    }
  }

  success(`Assigned ${totalAssigned} product-collection relationships`);
  return totalAssigned;
}
