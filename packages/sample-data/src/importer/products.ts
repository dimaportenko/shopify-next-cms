import type { ShopifyProductInput } from "../types.js";
import type { ShopifyConfig } from "./shopify-client.js";
import { graphql } from "./shopify-client.js";
import { debug, error, progress, success } from "../utils/logger.js";
import type {
  ProductCreateMutation,
  ProductBySkuQuery,
  ProductsListQuery,
  ProductDeleteMutation,
} from "../types/admin.generated.js";

const PRODUCT_CREATE_MUTATION = `#graphql
  mutation ProductCreate($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
    productCreate(product: $product, media: $media) {
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
        const existing = await graphql<ProductBySkuQuery>(
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

      // Build product input
      const productInput: Record<string, unknown> = {
        title: product.title,
        descriptionHtml: product.descriptionHtml,
        vendor: product.vendor,
        productType: product.productType,
        tags: product.tags,
        status: product.status,
      };

      // Add options if present
      if (product.options.length > 0) {
        productInput.productOptions = product.options.map((name) => ({
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

      // Add variants
      if (product.variants.length > 0) {
        productInput.variants = product.variants.map((v) => {
          const variant: Record<string, unknown> = {
            sku: v.sku,
            price: parseFloat(v.price),
          };
          if (v.options.length > 0) {
            variant.optionValues = v.options
              .map((opt, idx) => ({
                optionName: product.options[idx],
                name: opt,
              }))
              .filter((ov) => ov.optionName && ov.name);
          }
          return variant;
        });
      }

      // Build media input for images
      const media = product.images.map((img) => ({
        mediaContentType: "IMAGE" as const,
        originalSource: img.src,
        alt: img.altText ?? product.title,
      }));

      const result = await graphql<ProductCreateMutation>(
        config,
        PRODUCT_CREATE_MUTATION,
        {
          product: productInput,
          media: media.length > 0 ? media : undefined,
        },
      );

      const productCreate = result.productCreate;
      if (!productCreate) {
        error(`No response for product ${product.title}`);
        failed++;
        continue;
      }

      if (productCreate.userErrors.length > 0) {
        const errs = productCreate.userErrors
          .map((e) => `${e.field?.join(".")}: ${e.message}`)
          .join("; ");
        error(`Failed to create product ${product.title}: ${errs}`);
        failed++;
        continue;
      }

      if (productCreate.product) {
        const createdProduct = productCreate.product;
        if (primarySku) {
          productIdMap.set(primarySku, createdProduct.id);
        }
        // Map all variant SKUs
        for (const edge of createdProduct.variants.edges) {
          if (edge.node.sku) {
            productIdMap.set(edge.node.sku, createdProduct.id);
          }
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
        await graphql<ProductDeleteMutation>(config, PRODUCT_DELETE_MUTATION, {
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
