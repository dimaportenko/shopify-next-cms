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

import type { PageType } from "@/app/cms/_lib/page-types";
export type { PageType };

export interface CmsPage<D extends Data = Data> {
  id: string;
  title: string;
  slug: string;
  pageType: PageType;
  puckData: D;
  status: "draft" | "published";
  updatedAt: string;
}

export interface CmsPageSummary {
  id: string;
  title: string;
  slug: string;
  pageType: PageType;
  status: "draft" | "published";
  updatedAt: string;
}

export interface ImageDto {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export interface MoneyDto {
  amount: string;
  currencyCode: string;
}

export interface ProductDto {
  id: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  availableForSale: boolean;
  onlineStoreUrl: string | null;
  tags: string[];
  featuredImage: ImageDto | null;
  images: ImageDto[];
  priceRange: {
    minVariantPrice: MoneyDto;
    maxVariantPrice: MoneyDto;
  };
  compareAtPriceRange: {
    minVariantPrice: MoneyDto | null;
    maxVariantPrice: MoneyDto | null;
  };
}

export interface CollectionDto {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ImageDto | null;
  products: ProductDto[];
}
