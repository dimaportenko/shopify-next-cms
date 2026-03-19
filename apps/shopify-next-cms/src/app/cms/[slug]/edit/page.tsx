"use client";

import { Puck } from "@puckeditor/core";
import type { Data } from "@puckeditor/core";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { puckConfig } from "../../_lib/config";
import { publishPageAction } from "../../_lib/actions";

const EMPTY_DATA: Data = { content: [], root: {} };

export default function EditorPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [initialData, setInitialData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/cms/pages/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Page not found");
        return r.json();
      })
      .then((page) => {
        setInitialData(page.puckData || EMPTY_DATA);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

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
      onPublish={async (data) => {
        await publishPageAction(slug, data);
        router.push("/cms");
      }}
    />
  );
}
