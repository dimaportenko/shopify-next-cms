/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types.js';

export type CollectionCreateMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.CollectionInput;
}>;


export type CollectionCreateMutation = { collectionCreate?: AdminTypes.Maybe<{ collection?: AdminTypes.Maybe<Pick<AdminTypes.Collection, 'id' | 'handle' | 'title'>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type CollectionByHandleQueryVariables = AdminTypes.Exact<{
  handle: AdminTypes.Scalars['String']['input'];
}>;


export type CollectionByHandleQuery = { collectionByHandle?: AdminTypes.Maybe<Pick<AdminTypes.Collection, 'id' | 'handle' | 'title'>> };

export type CollectionsListQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type CollectionsListQuery = { collections: { edges: Array<{ node: Pick<AdminTypes.Collection, 'id' | 'title'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage'> } };

export type CollectionDeleteMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.CollectionDeleteInput;
}>;


export type CollectionDeleteMutation = { collectionDelete?: AdminTypes.Maybe<Pick<AdminTypes.CollectionDeletePayload, 'deletedCollectionId'>> };

export type CollectionAddProductsMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
  productIds: Array<AdminTypes.Scalars['ID']['input']> | AdminTypes.Scalars['ID']['input'];
}>;


export type CollectionAddProductsMutation = { collectionAddProducts?: AdminTypes.Maybe<{ collection?: AdminTypes.Maybe<Pick<AdminTypes.Collection, 'id'>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type ProductSetMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.ProductSetInput;
  synchronous: AdminTypes.Scalars['Boolean']['input'];
}>;


export type ProductSetMutation = { productSet?: AdminTypes.Maybe<{ product?: AdminTypes.Maybe<(
      Pick<AdminTypes.Product, 'id' | 'title' | 'handle'>
      & { variants: { edges: Array<{ node: Pick<AdminTypes.ProductVariant, 'id' | 'sku'> }> } }
    )>, userErrors: Array<Pick<AdminTypes.ProductSetUserError, 'field' | 'message' | 'code'>> }> };

export type ProductBySkuQueryVariables = AdminTypes.Exact<{
  query: AdminTypes.Scalars['String']['input'];
}>;


export type ProductBySkuQuery = { products: { edges: Array<{ node: Pick<AdminTypes.Product, 'id' | 'title' | 'handle'> }> } };

export type ProductsListQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type ProductsListQuery = { products: { edges: Array<{ node: Pick<AdminTypes.Product, 'id' | 'title'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage'> } };

export type ProductDeleteMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.ProductDeleteInput;
}>;


export type ProductDeleteMutation = { productDelete?: AdminTypes.Maybe<Pick<AdminTypes.ProductDeletePayload, 'deletedProductId'>> };

export type StoreCountsQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type StoreCountsQuery = { productsCount?: AdminTypes.Maybe<Pick<AdminTypes.Count, 'count'>>, collectionsCount?: AdminTypes.Maybe<Pick<AdminTypes.Count, 'count'>> };

interface GeneratedQueryTypes {
  "#graphql\n  query CollectionByHandle($handle: String!) {\n    collectionByHandle(handle: $handle) {\n      id\n      handle\n      title\n    }\n  }\n": {return: CollectionByHandleQuery, variables: CollectionByHandleQueryVariables},
  "#graphql\n  query CollectionsList {\n    collections(first: 50) {\n      edges {\n        node {\n          id\n          title\n        }\n      }\n      pageInfo {\n        hasNextPage\n      }\n    }\n  }\n": {return: CollectionsListQuery, variables: CollectionsListQueryVariables},
  "#graphql\n  query ProductBySku($query: String!) {\n    products(first: 1, query: $query) {\n      edges {\n        node {\n          id\n          title\n          handle\n        }\n      }\n    }\n  }\n": {return: ProductBySkuQuery, variables: ProductBySkuQueryVariables},
  "#graphql\n  query ProductsList {\n    products(first: 50) {\n      edges {\n        node {\n          id\n          title\n        }\n      }\n      pageInfo {\n        hasNextPage\n      }\n    }\n  }\n": {return: ProductsListQuery, variables: ProductsListQueryVariables},
  "#graphql\n  query StoreCounts {\n    productsCount {\n      count\n    }\n    collectionsCount {\n      count\n    }\n  }\n": {return: StoreCountsQuery, variables: StoreCountsQueryVariables},
}

interface GeneratedMutationTypes {
  "#graphql\n  mutation CollectionCreate($input: CollectionInput!) {\n    collectionCreate(input: $input) {\n      collection {\n        id\n        handle\n        title\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: CollectionCreateMutation, variables: CollectionCreateMutationVariables},
  "#graphql\n  mutation CollectionDelete($input: CollectionDeleteInput!) {\n    collectionDelete(input: $input) {\n      deletedCollectionId\n    }\n  }\n": {return: CollectionDeleteMutation, variables: CollectionDeleteMutationVariables},
  "#graphql\n  mutation CollectionAddProducts($id: ID!, $productIds: [ID!]!) {\n    collectionAddProducts(id: $id, productIds: $productIds) {\n      collection {\n        id\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: CollectionAddProductsMutation, variables: CollectionAddProductsMutationVariables},
  "#graphql\n  mutation ProductSet($input: ProductSetInput!, $synchronous: Boolean!) {\n    productSet(input: $input, synchronous: $synchronous) {\n      product {\n        id\n        title\n        handle\n        variants(first: 100) {\n          edges {\n            node {\n              id\n              sku\n            }\n          }\n        }\n      }\n      userErrors {\n        field\n        message\n        code\n      }\n    }\n  }\n": {return: ProductSetMutation, variables: ProductSetMutationVariables},
  "#graphql\n  mutation ProductDelete($input: ProductDeleteInput!) {\n    productDelete(input: $input) {\n      deletedProductId\n    }\n  }\n": {return: ProductDeleteMutation, variables: ProductDeleteMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
