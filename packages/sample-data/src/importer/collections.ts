import type { ShopifyCollectionInput } from "../types.js";
import type { ShopifyConfig } from "./shopify-client.js";
import { graphql } from "./shopify-client.js";
import { debug, error, progress, success } from "../utils/logger.js";

const COLLECTION_CREATE_MUTATION = `
  mutation collectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        id
        handle
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const COLLECTION_BY_HANDLE_QUERY = `
  query collectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      handle
      title
    }
  }
`;

interface CollectionCreateResult {
  collectionCreate: {
    collection: { id: string; handle: string; title: string } | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

interface CollectionByHandleResult {
  collectionByHandle: { id: string; handle: string; title: string } | null;
}

// handle → Shopify GID
const collectionIdMap = new Map<string, string>();

export function getCollectionIdMap(): Map<string, string> {
  return collectionIdMap;
}

export async function importCollections(
  config: ShopifyConfig,
  collections: ShopifyCollectionInput[],
): Promise<{ created: number; skipped: number; failed: number }> {
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < collections.length; i++) {
    const collection = collections[i];
    progress(i + 1, collections.length, `Collection: ${collection.title}`);

    try {
      // Check if collection already exists
      const existing = await graphql<CollectionByHandleResult>(
        config,
        COLLECTION_BY_HANDLE_QUERY,
        { handle: collection.handle },
      );

      if (existing.collectionByHandle) {
        debug(`Collection already exists: ${collection.handle}`);
        collectionIdMap.set(
          collection.handle,
          existing.collectionByHandle.id,
        );
        skipped++;
        continue;
      }

      // Create collection
      const result = await graphql<CollectionCreateResult>(
        config,
        COLLECTION_CREATE_MUTATION,
        {
          input: {
            title: collection.title,
            handle: collection.handle,
            descriptionHtml: collection.descriptionHtml,
            published: collection.published,
          },
        },
      );

      if (result.collectionCreate.userErrors.length > 0) {
        const errs = result.collectionCreate.userErrors
          .map((e) => e.message)
          .join("; ");
        error(`Failed to create collection ${collection.handle}: ${errs}`);
        failed++;
        continue;
      }

      if (result.collectionCreate.collection) {
        collectionIdMap.set(
          collection.handle,
          result.collectionCreate.collection.id,
        );
        created++;
      }
    } catch (err) {
      error(
        `Error creating collection ${collection.handle}: ${err instanceof Error ? err.message : err}`,
      );
      failed++;
    }
  }

  success(
    `Collections: ${created} created, ${skipped} skipped, ${failed} failed`,
  );
  return { created, skipped, failed };
}

export async function deleteAllCollections(
  config: ShopifyConfig,
): Promise<number> {
  let deleted = 0;
  let hasMore = true;

  while (hasMore) {
    const result = await graphql<{
      collections: {
        edges: Array<{ node: { id: string; title: string } }>;
        pageInfo: { hasNextPage: boolean };
      };
    }>(config, `{
      collections(first: 50) {
        edges { node { id title } }
        pageInfo { hasNextPage }
      }
    }`);

    const edges = result.collections.edges;
    if (edges.length === 0) break;
    hasMore = result.collections.pageInfo.hasNextPage;

    for (const edge of edges) {
      try {
        await graphql(config, `
          mutation { collectionDelete(input: { id: "${edge.node.id}" }) { deletedCollectionId } }
        `);
        deleted++;
        debug(`Deleted collection: ${edge.node.title}`);
      } catch (err) {
        error(
          `Failed to delete collection ${edge.node.title}: ${err instanceof Error ? err.message : err}`,
        );
      }
    }
  }

  success(`Deleted ${deleted} collections`);
  return deleted;
}
