/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontTypes from './storefront.types.js';

export type GetCollectionByHandleQueryVariables = StorefrontTypes.Exact<{
  handle: StorefrontTypes.Scalars['String']['input'];
}>;


export type GetCollectionByHandleQuery = { collection?: StorefrontTypes.Maybe<(
    Pick<StorefrontTypes.Collection, 'id' | 'handle' | 'title' | 'description'>
    & { image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, products: { nodes: Array<(
        Pick<StorefrontTypes.Product, 'id' | 'handle' | 'title' | 'description' | 'vendor' | 'availableForSale' | 'onlineStoreUrl' | 'tags'>
        & { featuredImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, images: { nodes: Array<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>> }, priceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, maxVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> }, compareAtPriceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, maxVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
      )> } }
  )> };

export type SearchCollectionsQueryVariables = StorefrontTypes.Exact<{
  query?: StorefrontTypes.InputMaybe<StorefrontTypes.Scalars['String']['input']>;
  first: StorefrontTypes.Scalars['Int']['input'];
}>;


export type SearchCollectionsQuery = { collections: { nodes: Array<(
      Pick<StorefrontTypes.Collection, 'id' | 'handle' | 'title'>
      & { image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText'>> }
    )> } };

export type ProductFragmentFragment = (
  Pick<StorefrontTypes.Product, 'id' | 'handle' | 'title' | 'description' | 'vendor' | 'availableForSale' | 'onlineStoreUrl' | 'tags'>
  & { featuredImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, images: { nodes: Array<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>> }, priceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, maxVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> }, compareAtPriceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, maxVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> } }
);

interface GeneratedQueryTypes {
  "#graphql\n  #graphql\n  fragment ProductFragment on Product {\n    id\n    handle\n    title\n    description\n    vendor\n    availableForSale\n    onlineStoreUrl\n    tags\n    featuredImage {\n      url\n      altText\n      width\n      height\n    }\n    images(first: 10) {\n      nodes {\n        url\n        altText\n        width\n        height\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    compareAtPriceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n\n  query GetCollectionByHandle($handle: String!) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      image {\n        url\n        altText\n        width\n        height\n      }\n      products(first: 12) {\n        nodes {\n          ...ProductFragment\n        }\n      }\n    }\n  }\n": {return: GetCollectionByHandleQuery, variables: GetCollectionByHandleQueryVariables},
  "#graphql\n  query SearchCollections($query: String, $first: Int!) {\n    collections(first: $first, query: $query) {\n      nodes {\n        id\n        handle\n        title\n        image {\n          url\n          altText\n        }\n      }\n    }\n  }\n": {return: SearchCollectionsQuery, variables: SearchCollectionsQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/storefront-api-client' {
  type InputMaybe<T> = StorefrontTypes.InputMaybe<T>;
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
