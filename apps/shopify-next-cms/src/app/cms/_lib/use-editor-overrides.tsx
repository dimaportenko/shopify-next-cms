"use client";

import { useMemo } from "react";
import type { Data } from "@puckeditor/core";
import type { CmsPage } from "@/lib/shopify/types";
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
import { IframePreviewWrapper } from "@cms/_components/editor/iframe-preview-wrapper";

export function useEditorOverrides({
  pageTitle,
  handlePublish,
  headerFragment,
  footerFragment,
  isEditingFragment,
}: {
  pageTitle: string;
  handlePublish: (data: Data) => Promise<void>;
  headerFragment: CmsPage | null | undefined;
  footerFragment: CmsPage | null | undefined;
  isEditingFragment: boolean;
}) {
  return useMemo(
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
      iframe: ({ children }: { children: React.ReactNode }) => (
        <IframePreviewWrapper
          headerFragment={headerFragment}
          footerFragment={footerFragment}
          isEditingFragment={isEditingFragment}
        >
          {children}
        </IframePreviewWrapper>
      ),
    }),
    [
      pageTitle,
      handlePublish,
      headerFragment,
      footerFragment,
      isEditingFragment,
    ],
  );
}
