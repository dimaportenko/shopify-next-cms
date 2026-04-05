import type {
  GetCollectionByHandleQuery,
  GetCollectionByHandleQueryVariables,
} from "@generated-types/storefront.generated";
import { storefrontQuery } from "../storefront-client";
import type { CollectionDto } from "../types";
import { GET_COLLECTION_BY_HANDLE } from "./collections.storefront";
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
