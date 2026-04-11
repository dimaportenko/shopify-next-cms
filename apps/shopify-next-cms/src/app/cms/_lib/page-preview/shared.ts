import type { Data } from "@puckeditor/core";
import type { PageType } from "@cms/_lib/page-types";
import type { CollectionDto, ProductDto } from "@/lib/shopify/types";

export type PagePreviewState =
  | "idle"
  | "loading"
  | "ready"
  | "not-found"
  | "error";

export interface PagePreviewEntity<TData> {
  data: TData | null;
  handle: string | null;
  state: PagePreviewState;
}

export interface CmsPagePreviewMetadata {
  collection?: CollectionDto | null;
  product?: ProductDto | null;
  preview?: {
    collection?: PagePreviewEntity<CollectionDto>;
    product?: PagePreviewEntity<ProductDto>;
  };
}

export interface CmsPreviewRootProps {
  previewCollectionHandle?: string;
  previewProductHandle?: string;
}

export interface PagePreviewDefinition<TData, TRootField extends string> {
  pageType: PageType;
  queryKey: string;
  rootField: TRootField;
  field: {
    type: "text";
    label: string;
    placeholder: string;
    visible: false;
  };
  fetchByHandle: (handle: string) => Promise<TData | null>;
  buildMetadata: (preview: PagePreviewEntity<TData>) => CmsPagePreviewMetadata;
}

export function getRootTextFieldValue(
  data: Pick<Data, "root"> | null | undefined,
  fieldName: string,
): string | null {
  const rootProps = data?.root?.props as Record<string, unknown> | undefined;
  const value = rootProps?.[fieldName];

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

export function getPagePreviewState<TData>({
  handle,
  isPending,
  error,
  data,
}: {
  handle: string | null;
  isPending: boolean;
  error: Error | null;
  data: TData | null | undefined;
}): PagePreviewState {
  if (handle === null) {
    return "idle";
  }

  if (isPending) {
    return "loading";
  }

  if (error) {
    return "error";
  }

  if (data) {
    return "ready";
  }

  return "not-found";
}

export function getPagePreviewEntity<TData>({
  preview,
  fallbackData,
}: {
  preview: PagePreviewEntity<TData> | null | undefined;
  fallbackData: TData | null | undefined;
}): PagePreviewEntity<TData> {
  if (preview) {
    return preview;
  }

  if (fallbackData) {
    return {
      data: fallbackData,
      handle: null,
      state: "ready",
    };
  }

  return {
    data: null,
    handle: null,
    state: "idle",
  };
}
