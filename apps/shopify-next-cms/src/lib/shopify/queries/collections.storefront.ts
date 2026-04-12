import { PRODUCT_FRAGMENT } from "./products.storefront";

export const GET_COLLECTION_BY_HANDLE = `#graphql
  ${PRODUCT_FRAGMENT}

  query GetCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        url
        altText
        width
        height
      }
      products(first: 12) {
        nodes {
          ...ProductFragment
        }
      }
    }
  }
`;

export const SEARCH_COLLECTIONS = `#graphql
  query SearchCollections($query: String, $first: Int!) {
    collections(first: $first, query: $query) {
      nodes {
        id
        handle
        title
        image {
          url
          altText
        }
      }
    }
  }
`;
