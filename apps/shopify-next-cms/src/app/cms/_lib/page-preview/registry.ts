import type { Fields } from "@puckeditor/core";
import { collectionPagePreview } from "@cms/_lib/collection-preview";
import type { CmsRootProps } from "@cms/_lib/fragments";
import type { PageType } from "@cms/_lib/page-types";

const PAGE_PREVIEW_DEFINITIONS = [collectionPagePreview] as const;

type RegisteredPagePreviewDefinition =
  (typeof PAGE_PREVIEW_DEFINITIONS)[number];

type RegisteredPreviewRootField =
  RegisteredPagePreviewDefinition["rootField"];

type CmsRootFields = Fields<CmsRootProps>;

export function getPagePreviewDefinition(
  pageType: PageType,
): RegisteredPagePreviewDefinition | null {
  return (
    PAGE_PREVIEW_DEFINITIONS.find(
      (definition) => definition.pageType === pageType,
    ) ?? null
  );
}

export const pagePreviewRootFields = {
  [collectionPagePreview.rootField]: collectionPagePreview.field,
} as const;

export function resolvePagePreviewRootFields(
  fields: CmsRootFields,
  pageType: PageType | undefined,
): CmsRootFields {
  const nextFields = { ...fields };

  for (const definition of PAGE_PREVIEW_DEFINITIONS) {
    const key: RegisteredPreviewRootField = definition.rootField;
    const field = nextFields[key];

    if (!field) {
      continue;
    }

    nextFields[key] = {
      ...field,
      visible: pageType === definition.pageType,
    };
  }

  return nextFields;
}
