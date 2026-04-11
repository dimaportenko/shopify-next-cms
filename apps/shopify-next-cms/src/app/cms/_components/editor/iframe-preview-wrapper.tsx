"use client";

import type { ReactNode } from "react";
import { CmsPageChrome } from "@/components/cms-page-chrome";
import { usePuck } from "@cms/_lib/use-puck";
import type { CmsPage } from "@/lib/shopify/types";

export function IframePreviewWrapper({
  children,
  headerFragment,
  footerFragment,
  isEditingFragment,
}: {
  children: ReactNode;
  headerFragment: CmsPage | null | undefined;
  footerFragment: CmsPage | null | undefined;
  isEditingFragment: boolean;
}) {
  // Narrow selectors — returning primitives avoids re-render on unrelated
  // root prop changes like the title field updating per keystroke.
  const headerHidden = usePuck(
    (state) => state.appState.data.root.props?.hideHeader === "hide",
  );
  const footerHidden = usePuck(
    (state) => state.appState.data.root.props?.hideFooter === "hide",
  );

  if (isEditingFragment) {
    return <>{children}</>;
  }

  return (
    <CmsPageChrome
      headerFragment={headerFragment}
      footerFragment={footerFragment}
      headerHidden={headerHidden}
      footerHidden={footerHidden}
    >
      {children}
    </CmsPageChrome>
  );
}
