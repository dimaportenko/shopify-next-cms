"use client";

import { Puck } from "@puckeditor/core";
import type { Data } from "@puckeditor/core";
import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import type { PageType } from "@/app/cms/_lib/page-types";
import { isValidPageType } from "@/app/cms/_lib/page-types";
import { fetchCmsPageBySlug } from "@/lib/api/cms-pages";
import { puckConfig } from "@cms/_lib/config";
import { publishPageAction } from "@cms/_lib/actions";
import { EditorHeader } from "@cms/_components/editor/editor-header";
import {
  EditorDrawer,
  EditorFieldLabel,
  EditorFieldsPanel,
} from "@cms/_components/editor/editor-inspector";
import {
  EditorNumberField,
  EditorSelectField,
  EditorTextField,
  EditorTextareaField,
} from "@cms/_components/editor/editor-field-types";
import { EditorDrawerItem } from "@cms/_components/editor/editor-drawer-item";
import { PublishButton } from "@cms/_components/editor/publish-button";

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

  const initialData = useMemo(() => {
    if (!page) {
      return null;
    }

    const puckData: Data = page.puckData || EMPTY_DATA;
    const rootProps = (puckData.root?.props ?? {}) as Record<string, unknown>;

    if (!rootProps.title && page.title) {
      return {
        ...puckData,
        root: {
          ...puckData.root,
          props: { ...rootProps, title: page.title },
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

  const overrides = useMemo(
    () => ({
      header: ({ actions }: { actions: React.ReactNode }) => (
        <EditorHeader actions={actions} pageTitle={pageTitle} />
      ),
      headerActions: () => <PublishButton onPublish={handlePublish} />,
      drawer: ({ children }: { children: React.ReactNode }) => (
        <EditorDrawer>{children}</EditorDrawer>
      ),
      drawerItem: ({ name }: { name: string }) => (
        <EditorDrawerItem name={name} />
      ),
      fieldTypes: {
        text: EditorTextField,
        number: EditorNumberField,
        textarea: EditorTextareaField,
        select: EditorSelectField,
      },
      fields: ({
        children,
        isLoading,
        itemSelector,
      }: {
        children: React.ReactNode;
        isLoading: boolean;
        itemSelector?: { index: number; zone?: string } | null;
      }) => (
        <EditorFieldsPanel isLoading={isLoading} itemSelector={itemSelector}>
          {children}
        </EditorFieldsPanel>
      ),
      fieldLabel: ({
        children,
        icon,
        label,
        el,
        readOnly,
        className,
      }: {
        children?: React.ReactNode;
        icon?: React.ReactNode;
        label: string;
        el?: "label" | "div";
        readOnly?: boolean;
        className?: string;
      }) => (
        <EditorFieldLabel
          className={className}
          el={el}
          icon={icon}
          label={label}
          readOnly={readOnly}
        >
          {children}
        </EditorFieldLabel>
      ),
    }),
    [pageTitle, handlePublish],
  );

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
    />
  );
}
