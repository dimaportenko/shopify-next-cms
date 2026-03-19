export const LIST_CMS_PAGES = `#graphql
  query ListCmsPages {
    metaobjects(type: "cms_page", first: 100, sortKey: "updated_at", reverse: true) {
      nodes {
        id
        handle
        fields {
          key
          value
        }
      }
    }
  }
`;

export const GET_CMS_PAGE_BY_SLUG = `#graphql
  query GetCmsPage($handle: MetaobjectHandleInput!) {
    metaobjectByHandle(handle: $handle) {
      id
      handle
      fields {
        key
        value
      }
    }
  }
`;

export const CREATE_CMS_PAGE = `#graphql
  mutation CreateCmsPage($metaobject: MetaobjectCreateInput!) {
    metaobjectCreate(metaobject: $metaobject) {
      metaobject {
        id
        handle
        fields {
          key
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const UPDATE_CMS_PAGE = `#graphql
  mutation UpdateCmsPage($id: ID!, $metaobject: MetaobjectUpdateInput!) {
    metaobjectUpdate(id: $id, metaobject: $metaobject) {
      metaobject {
        id
        handle
        fields {
          key
          value
        }
      }
      userErrors {
        field
          message
      }
    }
  }
`;

export const DELETE_CMS_PAGE = `#graphql
  mutation DeleteCmsPage($id: ID!) {
    metaobjectDelete(id: $id) {
      deletedId
      userErrors {
        field
        message
      }
    }
  }
`;
