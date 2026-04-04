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

export type StagedUploadsCreateMutationVariables = AdminTypes.Exact<{
  input: Array<AdminTypes.StagedUploadInput> | AdminTypes.StagedUploadInput;
}>;


export type StagedUploadsCreateMutation = { stagedUploadsCreate?: AdminTypes.Maybe<{ stagedTargets?: AdminTypes.Maybe<Array<(
      Pick<AdminTypes.StagedMediaUploadTarget, 'url' | 'resourceUrl'>
      & { parameters: Array<Pick<AdminTypes.StagedUploadParameter, 'name' | 'value'>> }
    )>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type FileCreateMutationVariables = AdminTypes.Exact<{
  files: Array<AdminTypes.FileCreateInput> | AdminTypes.FileCreateInput;
}>;


export type FileCreateMutation = { fileCreate?: AdminTypes.Maybe<{ files?: AdminTypes.Maybe<Array<Pick<AdminTypes.ExternalVideo, 'id' | 'alt' | 'createdAt'> | Pick<AdminTypes.GenericFile, 'id' | 'alt' | 'createdAt'> | (
      Pick<AdminTypes.MediaImage, 'id' | 'alt' | 'createdAt'>
      & { image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url' | 'width' | 'height'>> }
    ) | Pick<AdminTypes.Model3d, 'id' | 'alt' | 'createdAt'> | Pick<AdminTypes.Video, 'id' | 'alt' | 'createdAt'>>>, userErrors: Array<Pick<AdminTypes.FilesUserError, 'field' | 'message'>> }> };

export type FileByIdQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type FileByIdQuery = { node?: AdminTypes.Maybe<(
    Pick<AdminTypes.MediaImage, 'id'>
    & { image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }
  )> };

export type FilesQueryVariables = AdminTypes.Exact<{
  first: AdminTypes.Scalars['Int']['input'];
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  query?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type FilesQuery = { files: { edges: Array<{ node: Pick<AdminTypes.ExternalVideo, 'id' | 'alt' | 'createdAt'> | Pick<AdminTypes.GenericFile, 'id' | 'alt' | 'createdAt'> | (
        Pick<AdminTypes.MediaImage, 'id' | 'alt' | 'createdAt'>
        & { image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url' | 'width' | 'height'>> }
      ) | Pick<AdminTypes.Model3d, 'id' | 'alt' | 'createdAt'> | Pick<AdminTypes.Video, 'id' | 'alt' | 'createdAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } };

interface GeneratedQueryTypes {
  "#graphql\n  query ListCmsPages {\n    metaobjects(type: \"cms_page\", first: 100, sortKey: \"updated_at\", reverse: true) {\n      nodes {\n        id\n        handle\n        fields {\n          key\n          value\n        }\n      }\n    }\n  }\n": {return: ListCmsPagesQuery, variables: ListCmsPagesQueryVariables},
  "#graphql\n  query GetCmsPage($handle: MetaobjectHandleInput!) {\n    metaobjectByHandle(handle: $handle) {\n      id\n      handle\n      fields {\n        key\n        value\n      }\n    }\n  }\n": {return: GetCmsPageQuery, variables: GetCmsPageQueryVariables},
  "#graphql\n  query FileById($id: ID!) {\n    node(id: $id) {\n      ... on MediaImage {\n        id\n        image {\n          url\n        }\n      }\n    }\n  }\n": {return: FileByIdQuery, variables: FileByIdQueryVariables},
  "#graphql\n  query Files($first: Int!, $after: String, $query: String) {\n    files(first: $first, after: $after, query: $query, sortKey: CREATED_AT, reverse: true) {\n      edges {\n        node {\n          id\n          alt\n          createdAt\n          ... on MediaImage {\n            image {\n              url\n              width\n              height\n            }\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n": {return: FilesQuery, variables: FilesQueryVariables},
}

interface GeneratedMutationTypes {
  "#graphql\n  mutation CreateCmsPage($metaobject: MetaobjectCreateInput!) {\n    metaobjectCreate(metaobject: $metaobject) {\n      metaobject {\n        id\n        handle\n        fields {\n          key\n          value\n        }\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: CreateCmsPageMutation, variables: CreateCmsPageMutationVariables},
  "#graphql\n  mutation UpdateCmsPage($id: ID!, $metaobject: MetaobjectUpdateInput!) {\n    metaobjectUpdate(id: $id, metaobject: $metaobject) {\n      metaobject {\n        id\n        handle\n        fields {\n          key\n          value\n        }\n      }\n      userErrors {\n        field\n          message\n      }\n    }\n  }\n": {return: UpdateCmsPageMutation, variables: UpdateCmsPageMutationVariables},
  "#graphql\n  mutation DeleteCmsPage($id: ID!) {\n    metaobjectDelete(id: $id) {\n      deletedId\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: DeleteCmsPageMutation, variables: DeleteCmsPageMutationVariables},
  "#graphql\n  mutation StagedUploadsCreate($input: [StagedUploadInput!]!) {\n    stagedUploadsCreate(input: $input) {\n      stagedTargets {\n        url\n        resourceUrl\n        parameters {\n          name\n          value\n        }\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: StagedUploadsCreateMutation, variables: StagedUploadsCreateMutationVariables},
  "#graphql\n  mutation FileCreate($files: [FileCreateInput!]!) {\n    fileCreate(files: $files) {\n      files {\n        id\n        alt\n        createdAt\n        ... on MediaImage {\n          image {\n            url\n            width\n            height\n          }\n        }\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: FileCreateMutation, variables: FileCreateMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
