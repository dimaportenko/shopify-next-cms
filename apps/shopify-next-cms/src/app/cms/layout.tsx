"use client";

import "@puckeditor/core/puck.css";
import "./cms.css";
import { CmsThemeProvider, useCmsTheme } from "@cms/_lib/cms-theme-provider";

function CmsLayoutInner({ children }: { children: React.ReactNode }) {
  const { editorTheme } = useCmsTheme();

  return (
    <div
      className={`cms-editor-root${editorTheme === "dark" ? " cms-dark" : ""}`}
    >
      {children}
    </div>
  );
}

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <CmsThemeProvider>
      <CmsLayoutInner>{children}</CmsLayoutInner>
    </CmsThemeProvider>
  );
}
