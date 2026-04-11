"use client";

import type { Data } from "@puckeditor/core";
import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import type { PageType } from "@/app/cms/_lib/page-types";
import { isValidPageType } from "@/app/cms/_lib/page-types";
import { fetchCmsPageBySlug } from "@/lib/api/cms-pages";
import { publishPageAction } from "@cms/_lib/actions";
import { EditorCanvas } from "@cms/_components/editor/editor-canvas";
import { FRAGMENT_SLUGS } from "@cms/_lib/fragments";
import { useEditorOverrides } from "@cms/_lib/use-editor-overrides";
import type { CmsPage } from "@/lib/shopify/types";

const EMPTY_DATA: Data = { content: [], root: {} };

export default function EditorPage() {
  const { slug, pageType } = useParams<{ slug: string; pageType: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const validPageType: PageType = isValidPageType(pageType)
    ? pageType
    : "general";

  const {
    data: page,
    isPending,
    error,
  } = useQuery({
    queryKey: ["cms-page", validPageType, slug],
    queryFn: () => fetchCmsPageBySlug({ slug, pageType: validPageType }),
  });

  const isEditingFragment = validPageType === "fragment";

  const fragmentQueryFn = useCallback(
    async (fragmentSlug: string): Promise<CmsPage | null> => {
      try {
        return await fetchCmsPageBySlug({
          slug: fragmentSlug,
          pageType: "fragment",
        });
      } catch {
        return null;
      }
    },
    [],
  );

  const { data: headerFragment } = useQuery({
    queryKey: ["cms-page", "fragment", FRAGMENT_SLUGS.header],
    queryFn: () => fragmentQueryFn(FRAGMENT_SLUGS.header),
    enabled: !isEditingFragment,
  });

  const { data: footerFragment } = useQuery({
    queryKey: ["cms-page", "fragment", FRAGMENT_SLUGS.footer],
    queryFn: () => fragmentQueryFn(FRAGMENT_SLUGS.footer),
    enabled: !isEditingFragment,
  });

  const initialData = useMemo(() => {
    if (!page) {
      return null;
    }

    const puckData: Data = page.puckData || EMPTY_DATA;
    const rootProps = (puckData.root?.props ?? {}) as Record<string, unknown>;
    const nextRootProps = { ...rootProps };

    if (!nextRootProps.title && page.title) {
      nextRootProps.title = page.title;
    }

    if (!nextRootProps.type && page.pageType) {
      nextRootProps.type = page.pageType;
    }

    if (
      nextRootProps.title !== rootProps.title ||
      nextRootProps.type !== rootProps.type
    ) {
      return {
        ...puckData,
        root: {
          ...puckData.root,
          props: nextRootProps,
        },
      } satisfies Data;
    }

    return puckData;
  }, [page]);

  const pageTitle = page?.title || slug;

  const handlePublish = useCallback(
    async (data: Data) => {
      await publishPageAction(slug, validPageType, data);
      await queryClient.invalidateQueries({
        queryKey: ["cms-page", validPageType, slug],
      });
    },
    [slug, validPageType, queryClient],
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

  if (error || !initialData || !page) {
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
    <EditorCanvas
      key={page.id}
      initialData={initialData}
      pageType={validPageType}
      overrides={overrides}
      onPublish={handlePublish}
    />
  );
}
