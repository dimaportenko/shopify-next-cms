"use client";

import { Puck } from "@puckeditor/core";
import type { Data } from "@puckeditor/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { PageType } from "@/app/cms/_lib/page-types";
import { isValidPageType } from "@/app/cms/_lib/page-types";
import { puckConfig } from "@cms/_lib/config";
import { publishPageAction } from "@cms/_lib/actions";
import { EditorHeader } from "@cms/_components/editor/editor-header";
import { PublishButton } from "@cms/_components/editor/publish-button";

const EMPTY_DATA: Data = { content: [], root: {} };

export default function EditorPage() {
  const { slug, pageType } = useParams<{ slug: string; pageType: string }>();
  const router = useRouter();
  const [initialData, setInitialData] = useState<Data | null>(null);
  const [pageTitle, setPageTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const validPageType: PageType = isValidPageType(pageType)
    ? pageType
    : "general";

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/cms/pages/${slug}?pageType=${validPageType}`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error("Page not found");
        return r.json();
      })
      .then((page) => {
        setInitialData(page.puckData || EMPTY_DATA);
        setPageTitle(page.title || slug);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [slug, validPageType]);

  const handlePublish = useCallback(
    async (data: Data) => {
      await publishPageAction(slug, validPageType, data);
      router.push("/cms");
    },
    [slug, validPageType, router],
  );

  const overrides = useMemo(
    () => ({
      header: ({ actions }: { actions: React.ReactNode }) => (
        <EditorHeader actions={actions} pageTitle={pageTitle} />
      ),
      headerActions: () => <PublishButton onPublish={handlePublish} />,
    }),
    [pageTitle, handlePublish],
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
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
      data={initialData!}
      iframe={{ enabled: true }}
      overrides={overrides}
      onPublish={handlePublish}
    />
  );
}
