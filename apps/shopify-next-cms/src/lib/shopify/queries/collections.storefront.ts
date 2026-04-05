export const GET_COLLECTION_BY_HANDLE = `#graphql
  query GetCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
    }
  }
`;
