/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontTypes from './storefront.types.js';

export type GetCollectionByHandleQueryVariables = StorefrontTypes.Exact<{
  handle: StorefrontTypes.Scalars['String']['input'];
}>;


export type GetCollectionByHandleQuery = { collection?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Collection, 'id' | 'handle' | 'title' | 'description'>> };

interface GeneratedQueryTypes {
  "#graphql\n  query GetCollectionByHandle($handle: String!) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n    }\n  }\n": {return: GetCollectionByHandleQuery, variables: GetCollectionByHandleQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/storefront-api-client' {
  type InputMaybe<T> = StorefrontTypes.InputMaybe<T>;
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
