"use client";

import { Puck } from "@puckeditor/core";
import type { Data } from "@puckeditor/core";
import type { PageType } from "@cms/_lib/page-types";
import { puckConfig } from "@cms/_lib/config";
import { usePagePreviewMetadata } from "@cms/_lib/page-preview/use-page-preview";
import { useEditorOverrides } from "@cms/_lib/use-editor-overrides";

export function EditorCanvas({
  initialData,
  pageType,
  overrides,
  onPublish,
}: {
  initialData: Data;
  pageType: PageType;
  overrides: ReturnType<typeof useEditorOverrides>;
  onPublish: (data: Data) => Promise<void>;
}) {
  const { metadata, handleDataChange } = usePagePreviewMetadata({
    initialData,
    pageType,
  });

  return (
    <Puck
      config={puckConfig}
      data={initialData}
      iframe={{ enabled: true }}
      metadata={metadata}
      overrides={overrides}
      onChange={handleDataChange}
      onPublish={onPublish}
    />
  );
}
