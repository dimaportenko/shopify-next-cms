import { debug, error } from "../utils/logger.js";
import { throttle, updateFromResponse, withRetry } from "../utils/rate-limiter.js";

export interface ShopifyConfig {
  storeUrl: string;
  accessToken: string;
}

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

export async function graphql<T = Record<string, unknown>>(
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

  // Update rate limit state
  const cost = result.extensions?.cost?.throttleStatus;
  if (cost) {
    updateFromResponse(cost.currentlyAvailable, cost.maximumAvailable);
  }

  if (result.errors?.length) {
    const messages = result.errors.map((e) => e.message).join("; ");
    error(`GraphQL errors: ${messages}`);
    debug(`Query: ${query.slice(0, 200)}`);
    throw new Error(`GraphQL errors: ${messages}`);
  }

  return result.data as T;
}
