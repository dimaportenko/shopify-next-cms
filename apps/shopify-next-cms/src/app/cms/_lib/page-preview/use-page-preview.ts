"use client";

import type { Data } from "@puckeditor/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import type { PageType } from "@cms/_lib/page-types";
import { getPagePreviewDefinition } from "./registry";
import {
  getPagePreviewState,
  getRootTextFieldValue,
  type CmsPagePreviewMetadata,
} from "./shared";

export function usePagePreviewMetadata({
  initialData,
  pageType,
}: {
  initialData: Data;
  pageType: PageType;
}) {
  const definition = getPagePreviewDefinition(pageType);
  const [previewHandle, setPreviewHandle] = useState<string | null>(() =>
    definition
      ? getRootTextFieldValue(initialData, definition.rootField)
      : null,
  );

  const {
    data: previewData,
    error,
    isPending,
  } = useQuery({
    queryKey: definition
      ? [definition.queryKey, previewHandle]
      : ["cms-preview-disabled", pageType],
    queryFn: async () => definition!.fetchByHandle(previewHandle!),
    enabled: definition !== null && previewHandle !== null,
    retry: false,
    staleTime: 60_000,
  });

  const metadata = useMemo<CmsPagePreviewMetadata | undefined>(() => {
    if (!definition) {
      return undefined;
    }

    const state = getPagePreviewState({
      handle: previewHandle,
      isPending,
      error: error instanceof Error ? error : null,
      data: previewData,
    });

    return definition.buildMetadata({
      data: state === "ready" ? (previewData ?? null) : null,
      handle: previewHandle,
      state,
    });
  }, [definition, error, isPending, previewData, previewHandle]);

  const handleDataChange = useCallback(
    (data: Data) => {
      if (!definition) {
        return;
      }

      setPreviewHandle(getRootTextFieldValue(data, definition.rootField));
    },
    [definition],
  );

  return {
    metadata,
    handleDataChange,
  };
}
