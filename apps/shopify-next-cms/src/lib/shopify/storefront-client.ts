import type { ShopifyResponse } from "./types";
import { ShopifyApiError, ShopifyNetworkError } from "./types";

const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL!;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

const STOREFRONT_API_VERSION = "2026-04";

export async function storefrontQuery<
  T,
  V extends Record<string, unknown> = Record<string, unknown>,
>(query: string, variables?: V): Promise<T> {
  const response = await fetch(
    `https://${SHOPIFY_STORE_URL}/api/${STOREFRONT_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    },
  );

  if (!response.ok) {
    throw new ShopifyNetworkError(response.status, response.statusText);
  }

  const json: ShopifyResponse<T> = await response.json();

  if (json.errors?.length) {
    throw new ShopifyApiError(json.errors, json.extensions);
  }

  return json.data as T;
}
