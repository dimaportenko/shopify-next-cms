import type { ShopifyProductInput } from "../types.js";
import type { ShopifyConfig } from "./shopify-client.js";
import { graphql } from "./shopify-client.js";
import { debug, error, info, progress, success } from "../utils/logger.js";
import type {
  ProductSetMutation,
  ProductSetMutationVariables,
  ProductBySkuQuery,
  ProductBySkuQueryVariables,
  ProductsListQuery,
  ProductDeleteMutation,
  ProductDeleteMutationVariables,
  PublicationsQuery,
  PublishablePublishMutation,
  PublishablePublishMutationVariables,
} from "../types/admin.generated.js";
import type {
  ProductSetInput,
  ProductVariantSetInput,
  FileContentType,
} from "../types/admin.types.js";

const PRODUCT_SET_MUTATION = `#graphql
  mutation ProductSet($input: ProductSetInput!, $synchronous: Boolean!) {
    productSet(input: $input, synchronous: $synchronous) {
      product {
        id
        title
        handle
        variants(first: 100) {
          edges {
            node {
              id
              sku
            }
          }
        }
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const PRODUCT_BY_SKU_QUERY = `#graphql
  query ProductBySku($query: String!) {
    products(first: 1, query: $query) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

const PRODUCTS_LIST_QUERY = `#graphql
  query ProductsList {
    products(first: 50) {
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

const PRODUCT_DELETE_MUTATION = `#graphql
  mutation ProductDelete($input: ProductDeleteInput!) {
    productDelete(input: $input) {
      deletedProductId
    }
  }
`;

const PUBLICATIONS_QUERY = `#graphql
  query Publications {
    publications(first: 20) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

const PUBLISHABLE_PUBLISH_MUTATION = `#graphql
  mutation PublishablePublish($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      userErrors {
        field
        message
      }
    }
  }
`;

// Cache publication IDs for the session
let cachedPublicationIds: string[] | null = null;

async function getPublicationIds(config: ShopifyConfig): Promise<string[]> {
  if (cachedPublicationIds) return cachedPublicationIds;
  const result = await graphql<PublicationsQuery>(config, PUBLICATIONS_QUERY);
  cachedPublicationIds = result.publications.edges.map((e) => e.node.id);
  info(`Found ${cachedPublicationIds.length} sales channels`);
  return cachedPublicationIds;
}

async function publishToAllChannels(config: ShopifyConfig, productId: string): Promise<void> {
  const publicationIds = await getPublicationIds(config);
  if (publicationIds.length === 0) return;

  await graphql<PublishablePublishMutation, PublishablePublishMutationVariables>(
    config,
    PUBLISHABLE_PUBLISH_MUTATION,
    {
      id: productId,
      input: publicationIds.map((publicationId) => ({ publicationId })),
    },
  );
}

// SKU → Shopify product GID
const productIdMap = new Map<string, string>();

export function getProductIdMap(): Map<string, string> {
  return productIdMap;
}

export async function importProducts(
  config: ShopifyConfig,
  products: ShopifyProductInput[],
): Promise<{ created: number; skipped: number; failed: number }> {
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const primarySku = product.variants[0]?.sku ?? "";
    progress(i + 1, products.length, `Product: ${product.title}`);

    try {
      // Check if product already exists by SKU
      if (primarySku) {
        const existing = await graphql<ProductBySkuQuery, ProductBySkuQueryVariables>(
          config,
          PRODUCT_BY_SKU_QUERY,
          { query: `sku:${primarySku}` },
        );

        if (existing.products.edges.length > 0) {
          debug(`Product already exists: ${primarySku}`);
          productIdMap.set(primarySku, existing.products.edges[0].node.id);
          skipped++;
          continue;
        }
      }

      // Build productSet input (supports variants inline)
      const productSetInput: ProductSetInput = {
        title: product.title,
        descriptionHtml: product.descriptionHtml,
        vendor: product.vendor,
        productType: product.productType,
        tags: product.tags,
        status: product.status,
      };

      // Add options if present
      if (product.options.length > 0) {
        productSetInput.productOptions = product.options.map((name) => ({
          name,
          values: [
            ...new Set(
              product.variants
                .map(
                  (v) =>
                    v.options[product.options.indexOf(name)] ?? "",
                )
                .filter(Boolean),
            ),
          ].map((v) => ({ name: v })),
        }));
      }

      // Collect all files (product images + variant images)
      const filesSeen = new Set<string>();
      const files: Array<{ originalSource: string; alt: string; contentType: FileContentType }> = [];
      for (const img of product.images) {
        if (!filesSeen.has(img.src)) {
          filesSeen.add(img.src);
          files.push({
            originalSource: img.src,
            alt: img.altText ?? product.title,
            contentType: "IMAGE" as FileContentType,
          });
        }
      }
      // Also add variant-specific images to the files list
      for (const v of product.variants) {
        if (v.imageSrc && !filesSeen.has(v.imageSrc)) {
          filesSeen.add(v.imageSrc);
          files.push({
            originalSource: v.imageSrc,
            alt: product.title,
            contentType: "IMAGE" as FileContentType,
          });
        }
      }
      if (files.length > 0) {
        productSetInput.files = files;
      }

      // Add variants (only when product has options — productSet requires
      // productOptions whenever variants are present)
      if (product.variants.length > 0 && product.options.length > 0) {
        const variants: ProductVariantSetInput[] = product.variants.map((v) => {
          const variant: ProductVariantSetInput = {
            sku: v.sku,
            price: parseFloat(v.price),
            optionValues: v.options
              .map((opt, idx) => ({
                optionName: product.options[idx],
                name: opt,
              }))
              .filter((ov) => ov.optionName && ov.name),
          };
          if (v.imageSrc) {
            variant.file = {
              originalSource: v.imageSrc,
              contentType: "IMAGE" as FileContentType,
            };
          }
          return variant;
        });
        productSetInput.variants = variants;
      } else if (product.variants.length === 1) {
        // Simple product: set price/sku on the default variant
        const v = product.variants[0];
        productSetInput.variants = [{
          sku: v.sku,
          price: parseFloat(v.price),
          optionValues: [{ optionName: "Title", name: "Default Title" }],
        }];
        productSetInput.productOptions = [{ name: "Title", values: [{ name: "Default Title" }] }];
      }

      const result = await graphql<ProductSetMutation, ProductSetMutationVariables>(
        config,
        PRODUCT_SET_MUTATION,
        {
          input: productSetInput,
          synchronous: true,
        },
      );

      const productSet = result.productSet;
      if (!productSet) {
        error(`No response for product ${product.title}`);
        failed++;
        continue;
      }

      if (productSet.userErrors.length > 0) {
        const errs = productSet.userErrors
          .map((e) => `${e.field?.join(".")}: ${e.message}`)
          .join("; ");
        error(`Failed to create product ${product.title}: ${errs}`);
        failed++;
        continue;
      }

      if (productSet.product) {
        const createdProduct = productSet.product;
        if (primarySku) {
          productIdMap.set(primarySku, createdProduct.id);
        }
        // Map all variant SKUs
        for (const edge of createdProduct.variants.edges) {
          if (edge.node.sku) {
            productIdMap.set(edge.node.sku, createdProduct.id);
          }
        }
        // Publish to all sales channels
        try {
          await publishToAllChannels(config, createdProduct.id);
        } catch (err) {
          debug(`Failed to publish ${product.title}: ${err instanceof Error ? err.message : err}`);
        }
        created++;
      }
    } catch (err) {
      error(
        `Error creating product ${product.title}: ${err instanceof Error ? err.message : err}`,
      );
      failed++;
    }
  }

  success(
    `Products: ${created} created, ${skipped} skipped, ${failed} failed`,
  );
  return { created, skipped, failed };
}

export async function deleteAllProducts(
  config: ShopifyConfig,
): Promise<number> {
  let deleted = 0;
  let hasMore = true;

  while (hasMore) {
    const result = await graphql<ProductsListQuery>(
      config,
      PRODUCTS_LIST_QUERY,
    );

    const edges = result.products.edges;
    if (edges.length === 0) break;
    hasMore = result.products.pageInfo.hasNextPage;

    for (const edge of edges) {
      try {
        await graphql<ProductDeleteMutation, ProductDeleteMutationVariables>(config, PRODUCT_DELETE_MUTATION, {
          input: { id: edge.node.id },
        });
        deleted++;
        debug(`Deleted product: ${edge.node.title}`);
      } catch (err) {
        error(
          `Failed to delete product ${edge.node.title}: ${err instanceof Error ? err.message : err}`,
        );
      }
    }
  }

  success(`Deleted ${deleted} products`);
  return deleted;
}
