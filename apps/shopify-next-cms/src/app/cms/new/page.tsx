"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPageAction } from "@cms/_lib/actions";
import { PAGE_TYPES } from "@cms/_lib/page-types";
import type { PageType } from "@cms/_lib/page-types";

export default function NewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [pageType, setPageType] = useState<PageType>("general");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      await createPageAction(title.trim(), slug.trim(), pageType);
      router.push(`/cms/${pageType}/${slug.trim()}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create page");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Create New Page</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="pageType" className="text-sm font-medium">
            Page Type
          </label>
          <select
            id="pageType"
            value={pageType}
            onChange={(e) => setPageType(e.target.value as PageType)}
            className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {PAGE_TYPES.map((pt) => (
              <option key={pt.value} value={pt.value}>
                {pt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Page Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="My New Page"
            required
            className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium">
            URL Slug
          </label>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>/</span>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="my-new-page"
              required
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting || !title.trim() || !slug.trim()}
            className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create & Edit"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/cms")}
            className="inline-flex h-10 items-center rounded-md border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
