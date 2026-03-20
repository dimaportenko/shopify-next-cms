/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types.js';

export type GetMetaobjectDefinitionQueryVariables = AdminTypes.Exact<{
  type: AdminTypes.Scalars['String']['input'];
}>;


export type GetMetaobjectDefinitionQuery = { metaobjectDefinitionByType?: AdminTypes.Maybe<(
    Pick<AdminTypes.MetaobjectDefinition, 'id' | 'type' | 'name'>
    & { fieldDefinitions: Array<(
      Pick<AdminTypes.MetaobjectFieldDefinition, 'key' | 'name'>
      & { type: Pick<AdminTypes.MetafieldDefinitionType, 'name'> }
    )> }
  )> };

export type CreateMetaobjectDefinitionMutationVariables = AdminTypes.Exact<{
  definition: AdminTypes.MetaobjectDefinitionCreateInput;
}>;


export type CreateMetaobjectDefinitionMutation = { metaobjectDefinitionCreate?: AdminTypes.Maybe<{ metaobjectDefinition?: AdminTypes.Maybe<Pick<AdminTypes.MetaobjectDefinition, 'id' | 'type' | 'name'>>, userErrors: Array<Pick<AdminTypes.MetaobjectUserError, 'field' | 'message'>> }> };

export type UpdateMetaobjectDefinitionMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
  definition: AdminTypes.MetaobjectDefinitionUpdateInput;
}>;


export type UpdateMetaobjectDefinitionMutation = { metaobjectDefinitionUpdate?: AdminTypes.Maybe<{ metaobjectDefinition?: AdminTypes.Maybe<Pick<AdminTypes.MetaobjectDefinition, 'id' | 'type' | 'name'>>, userErrors: Array<Pick<AdminTypes.MetaobjectUserError, 'field' | 'message'>> }> };

export type DeleteMetaobjectDefinitionMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type DeleteMetaobjectDefinitionMutation = { metaobjectDefinitionDelete?: AdminTypes.Maybe<(
    Pick<AdminTypes.MetaobjectDefinitionDeletePayload, 'deletedId'>
    & { userErrors: Array<Pick<AdminTypes.MetaobjectUserError, 'field' | 'message'>> }
  )> };

export type ListMetaobjectsQueryVariables = AdminTypes.Exact<{
  type: AdminTypes.Scalars['String']['input'];
  first: AdminTypes.Scalars['Int']['input'];
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type ListMetaobjectsQuery = { metaobjects: { nodes: Array<(
      Pick<AdminTypes.Metaobject, 'id' | 'handle'>
      & { fields: Array<Pick<AdminTypes.MetaobjectField, 'key' | 'value'>> }
    )>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } };

export type GetMetaobjectByHandleQueryVariables = AdminTypes.Exact<{
  handle: AdminTypes.MetaobjectHandleInput;
}>;


export type GetMetaobjectByHandleQuery = { metaobjectByHandle?: AdminTypes.Maybe<(
    Pick<AdminTypes.Metaobject, 'id' | 'handle'>
    & { fields: Array<Pick<AdminTypes.MetaobjectField, 'key' | 'value'>> }
  )> };

export type CreateMetaobjectMutationVariables = AdminTypes.Exact<{
  metaobject: AdminTypes.MetaobjectCreateInput;
}>;


export type CreateMetaobjectMutation = { metaobjectCreate?: AdminTypes.Maybe<{ metaobject?: AdminTypes.Maybe<(
      Pick<AdminTypes.Metaobject, 'id' | 'handle'>
      & { fields: Array<Pick<AdminTypes.MetaobjectField, 'key' | 'value'>> }
    )>, userErrors: Array<Pick<AdminTypes.MetaobjectUserError, 'field' | 'message'>> }> };

export type UpdateMetaobjectMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
  metaobject: AdminTypes.MetaobjectUpdateInput;
}>;


export type UpdateMetaobjectMutation = { metaobjectUpdate?: AdminTypes.Maybe<{ metaobject?: AdminTypes.Maybe<(
      Pick<AdminTypes.Metaobject, 'id' | 'handle'>
      & { fields: Array<Pick<AdminTypes.MetaobjectField, 'key' | 'value'>> }
    )>, userErrors: Array<Pick<AdminTypes.MetaobjectUserError, 'field' | 'message'>> }> };

interface GeneratedQueryTypes {
  "#graphql\n  query GetMetaobjectDefinition($type: String!) {\n    metaobjectDefinitionByType(type: $type) {\n      id\n      type\n      name\n      fieldDefinitions {\n        key\n        name\n        type {\n          name\n        }\n      }\n    }\n  }\n": {return: GetMetaobjectDefinitionQuery, variables: GetMetaobjectDefinitionQueryVariables},
  "#graphql\n  query ListMetaobjects($type: String!, $first: Int!, $after: String) {\n    metaobjects(type: $type, first: $first, after: $after) {\n      nodes {\n        id\n        handle\n        fields {\n          key\n          value\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n": {return: ListMetaobjectsQuery, variables: ListMetaobjectsQueryVariables},
  "#graphql\n  query GetMetaobjectByHandle($handle: MetaobjectHandleInput!) {\n    metaobjectByHandle(handle: $handle) {\n      id\n      handle\n      fields {\n        key\n        value\n      }\n    }\n  }\n": {return: GetMetaobjectByHandleQuery, variables: GetMetaobjectByHandleQueryVariables},
}

interface GeneratedMutationTypes {
  "#graphql\n  mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {\n    metaobjectDefinitionCreate(definition: $definition) {\n      metaobjectDefinition {\n        id\n        type\n        name\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: CreateMetaobjectDefinitionMutation, variables: CreateMetaobjectDefinitionMutationVariables},
  "#graphql\n  mutation UpdateMetaobjectDefinition($id: ID!, $definition: MetaobjectDefinitionUpdateInput!) {\n    metaobjectDefinitionUpdate(id: $id, definition: $definition) {\n      metaobjectDefinition {\n        id\n        type\n        name\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: UpdateMetaobjectDefinitionMutation, variables: UpdateMetaobjectDefinitionMutationVariables},
  "#graphql\n  mutation DeleteMetaobjectDefinition($id: ID!) {\n    metaobjectDefinitionDelete(id: $id) {\n      deletedId\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: DeleteMetaobjectDefinitionMutation, variables: DeleteMetaobjectDefinitionMutationVariables},
  "#graphql\n  mutation CreateMetaobject($metaobject: MetaobjectCreateInput!) {\n    metaobjectCreate(metaobject: $metaobject) {\n      metaobject {\n        id\n        handle\n        fields {\n          key\n          value\n        }\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: CreateMetaobjectMutation, variables: CreateMetaobjectMutationVariables},
  "#graphql\n  mutation UpdateMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {\n    metaobjectUpdate(id: $id, metaobject: $metaobject) {\n      metaobject {\n        id\n        handle\n        fields {\n          key\n          value\n        }\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: UpdateMetaobjectMutation, variables: UpdateMetaobjectMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
