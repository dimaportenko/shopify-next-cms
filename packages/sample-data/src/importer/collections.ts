import type { ShopifyCollectionInput } from "../types.js";
import type { ShopifyConfig } from "./shopify-client.js";
import { graphql } from "./shopify-client.js";
import { debug, error, progress, success } from "../utils/logger.js";
import type {
  CollectionCreateMutation,
  CollectionCreateMutationVariables,
  CollectionByHandleQuery,
  CollectionByHandleQueryVariables,
  CollectionsListQuery,
  CollectionDeleteMutation,
  CollectionDeleteMutationVariables,
} from "../types/admin.generated.js";

const COLLECTION_CREATE_MUTATION = `#graphql
  mutation CollectionCreate($input: CollectionInput!) {
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

const COLLECTION_BY_HANDLE_QUERY = `#graphql
  query CollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      handle
      title
    }
  }
`;

const COLLECTIONS_LIST_QUERY = `#graphql
  query CollectionsList {
    collections(first: 50) {
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

const COLLECTION_DELETE_MUTATION = `#graphql
  mutation CollectionDelete($input: CollectionDeleteInput!) {
    collectionDelete(input: $input) {
      deletedCollectionId
    }
  }
`;

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
      const existing = await graphql<CollectionByHandleQuery, CollectionByHandleQueryVariables>(
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
      const result = await graphql<CollectionCreateMutation, CollectionCreateMutationVariables>(
        config,
        COLLECTION_CREATE_MUTATION,
        {
          input: {
            title: collection.title,
            handle: collection.handle,
            descriptionHtml: collection.descriptionHtml,
          },
        },
      );

      const collectionCreate = result.collectionCreate;
      if (!collectionCreate) {
        error(`No response for collection ${collection.handle}`);
        failed++;
        continue;
      }

      if (collectionCreate.userErrors.length > 0) {
        const errs = collectionCreate.userErrors
          .map((e) => e.message)
          .join("; ");
        error(`Failed to create collection ${collection.handle}: ${errs}`);
        failed++;
        continue;
      }

      if (collectionCreate.collection) {
        collectionIdMap.set(
          collection.handle,
          collectionCreate.collection.id,
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
    const result = await graphql<CollectionsListQuery>(
      config,
      COLLECTIONS_LIST_QUERY,
    );

    const edges = result.collections.edges;
    if (edges.length === 0) break;
    hasMore = result.collections.pageInfo.hasNextPage;

    for (const edge of edges) {
      try {
        await graphql<CollectionDeleteMutation, CollectionDeleteMutationVariables>(
          config,
          COLLECTION_DELETE_MUTATION,
          { input: { id: edge.node.id } },
        );
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
