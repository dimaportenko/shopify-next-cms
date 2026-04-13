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
        & { featuredImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, images: { nodes: Array<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>> }, priceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, maxVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> }, compareAtPriceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, maxVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> }, options: Array<Pick<StorefrontTypes.ProductOption, 'name' | 'values'>> }
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
  & { featuredImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, images: { nodes: Array<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>> }, priceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, maxVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> }, compareAtPriceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, maxVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> }, options: Array<Pick<StorefrontTypes.ProductOption, 'name' | 'values'>> }
);

export type VariantFragmentFragment = (
  Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
  & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>, price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, compareAtPrice?: StorefrontTypes.Maybe<Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>>, image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>> }
);

export type GetProductByHandleQueryVariables = StorefrontTypes.Exact<{
  handle: StorefrontTypes.Scalars['String']['input'];
}>;


export type GetProductByHandleQuery = { product?: StorefrontTypes.Maybe<(
    Pick<StorefrontTypes.Product, 'id' | 'handle' | 'title' | 'description' | 'vendor' | 'availableForSale' | 'onlineStoreUrl' | 'tags'>
    & { variants: { nodes: Array<(
        Pick<StorefrontTypes.ProductVariant, 'id' | 'title' | 'availableForSale'>
        & { selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>, price: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, compareAtPrice?: StorefrontTypes.Maybe<Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>>, image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>> }
      )> }, featuredImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>>, images: { nodes: Array<Pick<StorefrontTypes.Image, 'url' | 'altText' | 'width' | 'height'>> }, priceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, maxVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> }, compareAtPriceRange: { minVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'>, maxVariantPrice: Pick<StorefrontTypes.MoneyV2, 'amount' | 'currencyCode'> }, options: Array<Pick<StorefrontTypes.ProductOption, 'name' | 'values'>> }
  )> };

interface GeneratedQueryTypes {
  "#graphql\n  #graphql\n  fragment ProductFragment on Product {\n    id\n    handle\n    title\n    description\n    vendor\n    availableForSale\n    onlineStoreUrl\n    tags\n    featuredImage {\n      url\n      altText\n      width\n      height\n    }\n    images(first: 10) {\n      nodes {\n        url\n        altText\n        width\n        height\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    compareAtPriceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    options {\n      name\n      values\n    }\n  }\n\n\n  query GetCollectionByHandle($handle: String!) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      image {\n        url\n        altText\n        width\n        height\n      }\n      products(first: 12) {\n        nodes {\n          ...ProductFragment\n        }\n      }\n    }\n  }\n": {return: GetCollectionByHandleQuery, variables: GetCollectionByHandleQueryVariables},
  "#graphql\n  query SearchCollections($query: String, $first: Int!) {\n    collections(first: $first, query: $query) {\n      nodes {\n        id\n        handle\n        title\n        image {\n          url\n          altText\n        }\n      }\n    }\n  }\n": {return: SearchCollectionsQuery, variables: SearchCollectionsQueryVariables},
  "#graphql\n  #graphql\n  fragment ProductFragment on Product {\n    id\n    handle\n    title\n    description\n    vendor\n    availableForSale\n    onlineStoreUrl\n    tags\n    featuredImage {\n      url\n      altText\n      width\n      height\n    }\n    images(first: 10) {\n      nodes {\n        url\n        altText\n        width\n        height\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    compareAtPriceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    options {\n      name\n      values\n    }\n  }\n\n  #graphql\n  fragment VariantFragment on ProductVariant {\n    id\n    title\n    availableForSale\n    selectedOptions {\n      name\n      value\n    }\n    price {\n      amount\n      currencyCode\n    }\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    image {\n      url\n      altText\n      width\n      height\n    }\n  }\n\n\n  query GetProductByHandle($handle: String!) {\n    product(handle: $handle) {\n      ...ProductFragment\n      variants(first: 100) {\n        nodes {\n          ...VariantFragment\n        }\n      }\n    }\n  }\n": {return: GetProductByHandleQuery, variables: GetProductByHandleQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/storefront-api-client' {
  type InputMaybe<T> = StorefrontTypes.InputMaybe<T>;
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
