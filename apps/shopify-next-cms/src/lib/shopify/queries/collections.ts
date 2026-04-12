import type {
  GetCollectionByHandleQuery,
  GetCollectionByHandleQueryVariables,
  SearchCollectionsQuery,
  SearchCollectionsQueryVariables,
} from "@generated-types/storefront.generated";
import { storefrontQuery } from "../storefront-client";
import type { CollectionDto } from "../types";
import {
  GET_COLLECTION_BY_HANDLE,
  SEARCH_COLLECTIONS,
} from "./collections.storefront";
import { toImageDto, toProductDto } from "./products";

type CollectionNode = NonNullable<GetCollectionByHandleQuery["collection"]>;

function toCollectionDto(collection: CollectionNode): CollectionDto {
  return {
    id: collection.id,
    handle: collection.handle,
    title: collection.title,
    description: collection.description,
    image: toImageDto(collection.image),
    products: collection.products.nodes.map(toProductDto),
  };
}

export async function getCollectionByHandle({
  handle,
}: {
  handle: string;
}): Promise<CollectionDto | null> {
  const data = await storefrontQuery<
    GetCollectionByHandleQuery,
    GetCollectionByHandleQueryVariables
  >(GET_COLLECTION_BY_HANDLE, { handle });

  if (!data.collection) {
    return null;
  }

  return toCollectionDto(data.collection);
}

export interface CollectionSummaryDto {
  id: string;
  handle: string;
  title: string;
  imageUrl: string | null;
}

export async function searchCollections({
  query,
  first = 10,
}: {
  query?: string;
  first?: number;
}): Promise<CollectionSummaryDto[]> {
  const data = await storefrontQuery<
    SearchCollectionsQuery,
    SearchCollectionsQueryVariables
  >(SEARCH_COLLECTIONS, { query: query ?? null, first });

  return data.collections.nodes.map(
    (node) =>
      ({
        id: node.id,
        handle: node.handle,
        title: node.title,
        imageUrl: node.image?.url ?? null,
      }) satisfies CollectionSummaryDto,
  );
}
