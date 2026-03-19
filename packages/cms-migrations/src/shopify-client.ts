import { debug, error as logError } from "./utils/logger.js";
import {
  throttle,
  updateFromResponse,
  withRetry,
} from "./utils/rate-limiter.js";
import type { MetaobjectDefinition, MetaobjectNode } from "./types.js";
import {
  GET_METAOBJECT_DEFINITION,
  CREATE_METAOBJECT_DEFINITION,
  UPDATE_METAOBJECT_DEFINITION,
  DELETE_METAOBJECT_DEFINITION,
  LIST_METAOBJECTS,
  GET_METAOBJECT_BY_HANDLE,
  CREATE_METAOBJECT,
  UPDATE_METAOBJECT,
} from "./queries/migrations.admin.js";

interface GraphQLResponse<T = Record<string, unknown>> {
  data?: T;
  errors?: Array<{ message: string }>;
  extensions?: {
    cost?: {
      throttleStatus?: {
        currentlyAvailable: number;
        maximumAvailable: number;
      };
    };
  };
}

interface ShopifyConfig {
  storeUrl: string;
  accessToken: string;
}

export function getConfig(): ShopifyConfig {
  const storeUrl = process.env.SHOPIFY_STORE_URL;
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!storeUrl) {
    throw new Error("SHOPIFY_STORE_URL environment variable is required");
  }
  if (!accessToken) {
    throw new Error(
      "SHOPIFY_ADMIN_ACCESS_TOKEN environment variable is required",
    );
  }

  return {
    storeUrl: storeUrl.replace(/\/$/, ""),
    accessToken,
  };
}

async function graphql<T>(
  config: ShopifyConfig,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  await throttle();

  const url = `https://${config.storeUrl}/admin/api/2026-04/graphql.json`;

  const result = await withRetry(async () => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": config.accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Shopify API error (${response.status}): ${text}`);
    }

    return (await response.json()) as GraphQLResponse<T>;
  });

  const cost = result.extensions?.cost?.throttleStatus;
  if (cost) {
    updateFromResponse(cost.currentlyAvailable, cost.maximumAvailable);
  }

  if (result.errors?.length) {
    const messages = result.errors.map((e) => e.message).join("; ");
    logError(`GraphQL errors: ${messages}`);
    debug(`Query: ${query.slice(0, 200)}`);
    throw new Error(`GraphQL errors: ${messages}`);
  }

  return result.data as T;
}

// --- ShopifyClient class ---

export class ShopifyClient {
  private config: ShopifyConfig;

  constructor(config: ShopifyConfig) {
    this.config = config;
  }

  async getMetaobjectDefinition(
    type: string,
  ): Promise<MetaobjectDefinition | null> {
    const data = await graphql<{
      metaobjectDefinitionByType: {
        id: string;
        type: string;
        name: string;
        fieldDefinitions: Array<{
          key: string;
          name: string;
          type: { name: string };
        }>;
      } | null;
    }>(this.config, GET_METAOBJECT_DEFINITION, { type });

    const def = data.metaobjectDefinitionByType;
    if (!def) return null;

    return {
      id: def.id,
      type: def.type,
      name: def.name,
      fieldDefinitions: def.fieldDefinitions.map((f) => ({
        key: f.key,
        name: f.name,
        type: f.type.name,
      })),
    };
  }

  async createMetaobjectDefinition(input: {
    type: string;
    name: string;
    fieldDefinitions: Array<{
      key: string;
      name: string;
      type: string;
    }>;
    access?: { storefront: string };
  }): Promise<string> {
    const data = await graphql<{
      metaobjectDefinitionCreate: {
        metaobjectDefinition: { id: string } | null;
        userErrors: Array<{ field: string[]; message: string }>;
      };
    }>(this.config, CREATE_METAOBJECT_DEFINITION, { definition: input });

    const result = data.metaobjectDefinitionCreate;
    if (result.userErrors.length > 0) {
      throw new Error(
        `Failed to create definition: ${result.userErrors.map((e) => e.message).join(", ")}`,
      );
    }

    return result.metaobjectDefinition!.id;
  }

  async updateMetaobjectDefinition(
    id: string,
    input: Record<string, unknown>,
  ): Promise<void> {
    const data = await graphql<{
      metaobjectDefinitionUpdate: {
        userErrors: Array<{ field: string[]; message: string }>;
      };
    }>(this.config, UPDATE_METAOBJECT_DEFINITION, {
      id,
      definition: input,
    });

    const result = data.metaobjectDefinitionUpdate;
    if (result.userErrors.length > 0) {
      throw new Error(
        `Failed to update definition: ${result.userErrors.map((e) => e.message).join(", ")}`,
      );
    }
  }

  async deleteMetaobjectDefinition(type: string): Promise<void> {
    const def = await this.getMetaobjectDefinition(type);
    if (!def) return;

    const data = await graphql<{
      metaobjectDefinitionDelete: {
        userErrors: Array<{ field: string[]; message: string }>;
      };
    }>(this.config, DELETE_METAOBJECT_DEFINITION, { id: def.id });

    const result = data.metaobjectDefinitionDelete;
    if (result.userErrors.length > 0) {
      throw new Error(
        `Failed to delete definition: ${result.userErrors.map((e) => e.message).join(", ")}`,
      );
    }
  }

  async listAllMetaobjects(type: string): Promise<MetaobjectNode[]> {
    interface ListResult {
      metaobjects: {
        nodes: MetaobjectNode[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    }

    const all: MetaobjectNode[] = [];
    let after: string | null = null;

    while (true) {
      const data: ListResult = await graphql<ListResult>(
        this.config,
        LIST_METAOBJECTS,
        {
          type,
          first: 100,
          after,
        },
      );

      all.push(...data.metaobjects.nodes);

      if (!data.metaobjects.pageInfo.hasNextPage) break;
      after = data.metaobjects.pageInfo.endCursor;
    }

    return all;
  }

  async getMetaobjectByHandle(
    type: string,
    handle: string,
  ): Promise<MetaobjectNode | null> {
    const data = await graphql<{
      metaobjectByHandle: MetaobjectNode | null;
    }>(this.config, GET_METAOBJECT_BY_HANDLE, {
      handle: { type, handle },
    });

    return data.metaobjectByHandle;
  }

  async createMetaobject(input: {
    type: string;
    handle: string;
    fields: Array<{ key: string; value: string }>;
  }): Promise<MetaobjectNode> {
    const data = await graphql<{
      metaobjectCreate: {
        metaobject: MetaobjectNode | null;
        userErrors: Array<{ field: string[]; message: string }>;
      };
    }>(this.config, CREATE_METAOBJECT, { metaobject: input });

    const result = data.metaobjectCreate;
    if (result.userErrors.length > 0) {
      throw new Error(
        `Failed to create metaobject: ${result.userErrors.map((e) => e.message).join(", ")}`,
      );
    }

    return result.metaobject!;
  }

  async updateMetaobject(
    id: string,
    input: { fields: Array<{ key: string; value: string }> },
  ): Promise<MetaobjectNode> {
    const data = await graphql<{
      metaobjectUpdate: {
        metaobject: MetaobjectNode | null;
        userErrors: Array<{ field: string[]; message: string }>;
      };
    }>(this.config, UPDATE_METAOBJECT, { id, metaobject: input });

    const result = data.metaobjectUpdate;
    if (result.userErrors.length > 0) {
      throw new Error(
        `Failed to update metaobject: ${result.userErrors.map((e) => e.message).join(", ")}`,
      );
    }

    return result.metaobject!;
  }
}
