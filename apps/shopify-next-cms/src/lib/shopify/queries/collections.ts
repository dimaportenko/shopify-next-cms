import type {
  GetCollectionByHandleQuery,
  GetCollectionByHandleQueryVariables,
} from "@generated-types/storefront.generated";
import { storefrontQuery } from "../storefront-client";
import type { StorefrontCollectionDto } from "../types";
import { GET_COLLECTION_BY_HANDLE } from "./collections.storefront";

type StorefrontCollectionNode = NonNullable<
  GetCollectionByHandleQuery["collection"]
>;

function toStorefrontCollectionDto(
  collection: StorefrontCollectionNode,
): StorefrontCollectionDto {
  return {
    id: collection.id,
    handle: collection.handle,
    title: collection.title,
    description: collection.description,
  };
}

export async function getCollectionByHandle({
  handle,
}: {
  handle: string;
}): Promise<StorefrontCollectionDto | null> {
  const data = await storefrontQuery<
    GetCollectionByHandleQuery,
    GetCollectionByHandleQueryVariables
  >(GET_COLLECTION_BY_HANDLE, { handle });

  if (!data.collection) {
    return null;
  }

  return toStorefrontCollectionDto(data.collection);
}
