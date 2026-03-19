/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types.js';

export type ListCmsPagesQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type ListCmsPagesQuery = { metaobjects: { nodes: Array<(
      Pick<AdminTypes.Metaobject, 'id' | 'handle'>
      & { fields: Array<Pick<AdminTypes.MetaobjectField, 'key' | 'value'>> }
    )> } };

export type GetCmsPageQueryVariables = AdminTypes.Exact<{
  handle: AdminTypes.MetaobjectHandleInput;
}>;


export type GetCmsPageQuery = { metaobjectByHandle?: AdminTypes.Maybe<(
    Pick<AdminTypes.Metaobject, 'id' | 'handle'>
    & { fields: Array<Pick<AdminTypes.MetaobjectField, 'key' | 'value'>> }
  )> };

export type CreateCmsPageMutationVariables = AdminTypes.Exact<{
  metaobject: AdminTypes.MetaobjectCreateInput;
}>;


export type CreateCmsPageMutation = { metaobjectCreate?: AdminTypes.Maybe<{ metaobject?: AdminTypes.Maybe<(
      Pick<AdminTypes.Metaobject, 'id' | 'handle'>
      & { fields: Array<Pick<AdminTypes.MetaobjectField, 'key' | 'value'>> }
    )>, userErrors: Array<Pick<AdminTypes.MetaobjectUserError, 'field' | 'message'>> }> };

export type UpdateCmsPageMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
  metaobject: AdminTypes.MetaobjectUpdateInput;
}>;


export type UpdateCmsPageMutation = { metaobjectUpdate?: AdminTypes.Maybe<{ metaobject?: AdminTypes.Maybe<(
      Pick<AdminTypes.Metaobject, 'id' | 'handle'>
      & { fields: Array<Pick<AdminTypes.MetaobjectField, 'key' | 'value'>> }
    )>, userErrors: Array<Pick<AdminTypes.MetaobjectUserError, 'field' | 'message'>> }> };

export type DeleteCmsPageMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type DeleteCmsPageMutation = { metaobjectDelete?: AdminTypes.Maybe<(
    Pick<AdminTypes.MetaobjectDeletePayload, 'deletedId'>
    & { userErrors: Array<Pick<AdminTypes.MetaobjectUserError, 'field' | 'message'>> }
  )> };

interface GeneratedQueryTypes {
  "#graphql\n  query ListCmsPages {\n    metaobjects(type: \"cms_page\", first: 100, sortKey: \"updated_at\", reverse: true) {\n      nodes {\n        id\n        handle\n        fields {\n          key\n          value\n        }\n      }\n    }\n  }\n": {return: ListCmsPagesQuery, variables: ListCmsPagesQueryVariables},
  "#graphql\n  query GetCmsPage($handle: MetaobjectHandleInput!) {\n    metaobjectByHandle(handle: $handle) {\n      id\n      handle\n      fields {\n        key\n        value\n      }\n    }\n  }\n": {return: GetCmsPageQuery, variables: GetCmsPageQueryVariables},
}

interface GeneratedMutationTypes {
  "#graphql\n  mutation CreateCmsPage($metaobject: MetaobjectCreateInput!) {\n    metaobjectCreate(metaobject: $metaobject) {\n      metaobject {\n        id\n        handle\n        fields {\n          key\n          value\n        }\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: CreateCmsPageMutation, variables: CreateCmsPageMutationVariables},
  "#graphql\n  mutation UpdateCmsPage($id: ID!, $metaobject: MetaobjectUpdateInput!) {\n    metaobjectUpdate(id: $id, metaobject: $metaobject) {\n      metaobject {\n        id\n        handle\n        fields {\n          key\n          value\n        }\n      }\n      userErrors {\n        field\n          message\n      }\n    }\n  }\n": {return: UpdateCmsPageMutation, variables: UpdateCmsPageMutationVariables},
  "#graphql\n  mutation DeleteCmsPage($id: ID!) {\n    metaobjectDelete(id: $id) {\n      deletedId\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: DeleteCmsPageMutation, variables: DeleteCmsPageMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
