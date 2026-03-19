import type { Data } from "@puckeditor/core";
import { adminQuery } from "../admin-client";
import type { CmsPage, CmsPageSummary } from "../types";
import type {
  ListCmsPagesQuery,
  ListCmsPagesQueryVariables,
  GetCmsPageQuery,
  GetCmsPageQueryVariables,
  CreateCmsPageMutation,
  CreateCmsPageMutationVariables,
  UpdateCmsPageMutation,
  UpdateCmsPageMutationVariables,
  DeleteCmsPageMutation,
  DeleteCmsPageMutationVariables,
} from "@generated-types/admin.generated";
import {
  LIST_CMS_PAGES,
  GET_CMS_PAGE_BY_SLUG,
  CREATE_CMS_PAGE,
  UPDATE_CMS_PAGE,
  DELETE_CMS_PAGE,
} from "./cms-pages.admin";

const CMS_PAGE_TYPE = "cms_page";

// --- Helpers ---

type MetaobjectNode = NonNullable<GetCmsPageQuery["metaobjectByHandle"]>;
type MetaobjectField = MetaobjectNode["fields"][number];

function getField(fields: MetaobjectField[], key: string): string {
  return fields.find((f) => f.key === key)?.value ?? "";
}

function parseMetaobjectToPage(node: MetaobjectNode): CmsPage {
  const fields = node.fields;
  let puckData: Data = { content: [], root: {} };
  try {
    const raw = getField(fields, "puck_data");
    if (raw) puckData = JSON.parse(raw);
  } catch {
    // keep default empty data
  }

  return {
    id: node.id,
    title: getField(fields, "title"),
    slug: getField(fields, "slug") || node.handle,
    puckData,
    status: (getField(fields, "status") as "draft" | "published") || "draft",
    updatedAt: getField(fields, "updated_at"),
  };
}

function parseMetaobjectToSummary(node: MetaobjectNode): CmsPageSummary {
  const fields = node.fields;
  return {
    id: node.id,
    title: getField(fields, "title"),
    slug: getField(fields, "slug") || node.handle,
    status: (getField(fields, "status") as "draft" | "published") || "draft",
    updatedAt: getField(fields, "updated_at"),
  };
}

// --- Public API ---

export async function listCmsPages(): Promise<CmsPageSummary[]> {
  const data = await adminQuery<ListCmsPagesQuery, ListCmsPagesQueryVariables>(
    LIST_CMS_PAGES,
  );
  return data.metaobjects.nodes.map(parseMetaobjectToSummary);
}

export async function getCmsPageBySlug(slug: string): Promise<CmsPage | null> {
  const data = await adminQuery<GetCmsPageQuery, GetCmsPageQueryVariables>(
    GET_CMS_PAGE_BY_SLUG,
    {
      handle: { type: CMS_PAGE_TYPE, handle: slug },
    },
  );

  if (!data.metaobjectByHandle) return null;
  return parseMetaobjectToPage(data.metaobjectByHandle);
}

export async function createCmsPage(
  title: string,
  slug: string,
): Promise<CmsPage> {
  const data = await adminQuery<
    CreateCmsPageMutation,
    CreateCmsPageMutationVariables
  >(CREATE_CMS_PAGE, {
    metaobject: {
      type: CMS_PAGE_TYPE,
      handle: slug,
      fields: [
        { key: "title", value: title },
        { key: "slug", value: slug },
        { key: "puck_data", value: JSON.stringify({ content: [], root: {} }) },
        { key: "status", value: "draft" },
        { key: "updated_at", value: new Date().toISOString() },
      ],
    },
  });

  if (!data.metaobjectCreate) {
    throw new Error("Failed to create metaobject");
  }

  if (data.metaobjectCreate.userErrors.length > 0) {
    throw new Error(
      data.metaobjectCreate.userErrors.map((e) => e.message).join(", "),
    );
  }

  if (!data.metaobjectCreate.metaobject) {
    throw new Error("Metaobject was not returned after creation");
  }

  return parseMetaobjectToPage(data.metaobjectCreate.metaobject);
}

export async function updateCmsPage(
  id: string,
  updates: {
    puckData?: Data;
    title?: string;
    status?: "draft" | "published";
  },
): Promise<CmsPage> {
  const fields: { key: string; value: string }[] = [
    { key: "updated_at", value: new Date().toISOString() },
  ];

  if (updates.puckData !== undefined) {
    fields.push({ key: "puck_data", value: JSON.stringify(updates.puckData) });
  }
  if (updates.title !== undefined) {
    fields.push({ key: "title", value: updates.title });
  }
  if (updates.status !== undefined) {
    fields.push({ key: "status", value: updates.status });
  }

  const data = await adminQuery<
    UpdateCmsPageMutation,
    UpdateCmsPageMutationVariables
  >(UPDATE_CMS_PAGE, {
    id,
    metaobject: { fields },
  });

  if (!data.metaobjectUpdate) {
    throw new Error("Failed to update metaobject");
  }

  if (data.metaobjectUpdate.userErrors.length > 0) {
    throw new Error(
      data.metaobjectUpdate.userErrors.map((e) => e.message).join(", "),
    );
  }

  if (!data.metaobjectUpdate.metaobject) {
    throw new Error("Metaobject was not returned after update");
  }

  return parseMetaobjectToPage(data.metaobjectUpdate.metaobject);
}

export async function deleteCmsPage(id: string): Promise<void> {
  const data = await adminQuery<
    DeleteCmsPageMutation,
    DeleteCmsPageMutationVariables
  >(DELETE_CMS_PAGE, {
    id,
  });

  if (!data.metaobjectDelete) {
    throw new Error("Failed to delete metaobject");
  }

  if (data.metaobjectDelete.userErrors.length > 0) {
    throw new Error(
      data.metaobjectDelete.userErrors.map((e) => e.message).join(", "),
    );
  }
}
