"use client";

import { Puck } from "@puckeditor/core";
import type { Data } from "@puckeditor/core";
import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import type { PageType } from "@/app/cms/_lib/page-types";
import { isValidPageType } from "@/app/cms/_lib/page-types";
import { puckConfig, type CmsData } from "@cms/_lib/config";
import { publishPageAction } from "@cms/_lib/actions";
import { FRAGMENT_SLUGS } from "@cms/_lib/fragments";
import { useEditorOverrides } from "@cms/_lib/use-editor-overrides";
import { useCollectionByHandle } from "@cms/_lib/use-collection-by-handle";
import { useFragmentQuery } from "@cms/_lib/use-fragment-query";

const EMPTY_DATA: Data = { content: [], root: {} };

function getRootHandle(data: CmsData | null): string {
  return data?.root?.props?.collectionHandle ?? "";
}

export default function EditorPage() {
  const { slug, pageType } = useParams<{ slug: string; pageType: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const validPageType: PageType = isValidPageType(pageType)
    ? pageType
    : "general";

  const isCollectionPage = validPageType === "collection";

  const {
    data: page,
    isPending,
    error,
  } = useQuery(
    trpc.cms.getPageBySlug.queryOptions({
      slug,
      pageType: validPageType,
    }),
  );

  const isEditingFragment = validPageType === "fragment";
  const { data: headerFragment } = useFragmentQuery(
    FRAGMENT_SLUGS.header,
    !isEditingFragment,
  );
  const { data: footerFragment } = useFragmentQuery(
    FRAGMENT_SLUGS.footer,
    !isEditingFragment,
  );

  const initialData = useMemo(() => {
    if (!page) {
      return null;
    }

    const puckData = (page.puckData || EMPTY_DATA) as CmsData;
    const rootProps = puckData.root?.props;

    if (!rootProps?.title && page.title) {
      return {
        ...puckData,
        root: {
          ...puckData.root,
          props: { ...rootProps, title: page.title },
        },
      } satisfies CmsData;
    }

    return puckData;
  }, [page]);

  const [collectionHandle, setCollectionHandle] = useState("");
  const activeHandle = collectionHandle || getRootHandle(initialData);

  const { data: collectionData } = useCollectionByHandle(
    isCollectionPage && activeHandle ? activeHandle : null,
  );

  const handleDataChange = useCallback(
    (data: CmsData) => {
      if (!isCollectionPage) return;
      setCollectionHandle((prev) => {
        const next = getRootHandle(data);
        return next === prev ? prev : next;
      });
    },
    [isCollectionPage],
  );

  const pageTitle = page?.title || slug;

  const handlePublish = useCallback(
    async (data: Data) => {
      await publishPageAction(slug, validPageType, data);
      await queryClient.invalidateQueries({
        queryKey: trpc.cms.getPageBySlug.queryKey({
          slug,
          pageType: validPageType,
        }),
      });
    },
    [slug, validPageType, queryClient, trpc],
  );

  const overrides = useEditorOverrides({
    pageTitle,
    handlePublish,
    headerFragment,
    footerFragment,
    isEditingFragment,
  });

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Failed to load page"}
        </p>
        <button
          type="button"
          onClick={() => router.push("/cms")}
          className="text-sm underline"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <Puck
      config={puckConfig}
      data={initialData}
      iframe={{ enabled: true }}
      overrides={overrides}
      onPublish={handlePublish}
      onChange={handleDataChange}
      metadata={
        isCollectionPage ? { collection: collectionData ?? null } : undefined
      }
    />
  );
}
