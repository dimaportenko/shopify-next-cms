import type {
  GetProductByHandleQuery,
  GetProductByHandleQueryVariables,
  ProductFragmentFragment,
} from "@generated-types/storefront.generated";
import type { ImageDto, MoneyDto, ProductDto } from "../types";
import { storefrontQuery } from "../storefront-client";
import { GET_PRODUCT_BY_HANDLE } from "./products.storefront";

type ShopifyImageLike = {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type ShopifyMoneyLike = {
  amount: string;
  currencyCode: string;
};

export function toImageDto(
  image: ShopifyImageLike | null | undefined,
): ImageDto | null {
  if (!image) {
    return null;
  }

  return {
    url: image.url,
    altText: image.altText ?? null,
    width: image.width ?? null,
    height: image.height ?? null,
  };
}

export function toMoneyDto(money: ShopifyMoneyLike): MoneyDto {
  return {
    amount: money.amount,
    currencyCode: money.currencyCode,
  };
}

export function toProductDto(product: ProductFragmentFragment): ProductDto {
  const featuredImage = toImageDto(product.featuredImage);
  const images = product.images.nodes
    .map(toImageDto)
    .filter((image): image is ImageDto => image !== null);

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    vendor: product.vendor,
    availableForSale: product.availableForSale,
    onlineStoreUrl: product.onlineStoreUrl ?? null,
    tags: product.tags,
    featuredImage,
    images,
    priceRange: {
      minVariantPrice: toMoneyDto(product.priceRange.minVariantPrice),
      maxVariantPrice: toMoneyDto(product.priceRange.maxVariantPrice),
    },
    compareAtPriceRange: {
      minVariantPrice: product.compareAtPriceRange.minVariantPrice
        ? toMoneyDto(product.compareAtPriceRange.minVariantPrice)
        : null,
      maxVariantPrice: product.compareAtPriceRange.maxVariantPrice
        ? toMoneyDto(product.compareAtPriceRange.maxVariantPrice)
        : null,
    },
  };
}

export async function getProductByHandle({
  handle,
}: {
  handle: string;
}): Promise<ProductDto | null> {
  const data = await storefrontQuery<
    GetProductByHandleQuery,
    GetProductByHandleQueryVariables
  >(GET_PRODUCT_BY_HANDLE, { handle });

  if (!data.product) {
    return null;
  }

  return toProductDto(data.product);
}
