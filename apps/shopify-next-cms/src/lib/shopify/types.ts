import type { Data } from "@puckeditor/core";

// --- Shopify API Error Types ---

export interface ShopifyErrorLocation {
  line: number;
  column: number;
}

export interface ShopifyErrorProblem {
  explanation: string;
  path: string[];
}

export interface ShopifyErrorExtensions {
  code?: string;
  value?: unknown;
  originalError?: string;
  problems?: ShopifyErrorProblem[];
}

export interface ShopifyGraphQLError {
  message: string;
  locations?: ShopifyErrorLocation[];
  path?: string[];
  extensions?: ShopifyErrorExtensions;
}

export interface ShopifyThrottleStatus {
  maximumAvailable: number;
  currentlyAvailable: number;
  restoreRate: number;
}

export interface ShopifyResponseExtensions {
  cost?: {
    requestedQueryCost: number;
    actualQueryCost: number;
    throttleStatus: ShopifyThrottleStatus;
  };
}

export interface ShopifyResponse<T> {
  data: T | null;
  errors?: ShopifyGraphQLError[];
  extensions?: ShopifyResponseExtensions;
}

export class ShopifyApiError extends Error {
  readonly errors: ShopifyGraphQLError[];
  readonly extensions?: ShopifyResponseExtensions;

  constructor(
    errors: ShopifyGraphQLError[],
    extensions?: ShopifyResponseExtensions,
  ) {
    const message = errors.map((e) => e.message).join(", ");
    super(`Shopify GraphQL error: ${message}`);
    this.name = "ShopifyApiError";
    this.errors = errors;
    this.extensions = extensions;
  }
}

export class ShopifyNetworkError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, statusText: string) {
    super(`Shopify API request failed: ${statusCode} ${statusText}`);
    this.name = "ShopifyNetworkError";
    this.statusCode = statusCode;
  }
}

// --- CMS Domain Types ---

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  puckData: Data;
  status: "draft" | "published";
  updatedAt: string;
}

export interface CmsPageSummary {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  updatedAt: string;
}
