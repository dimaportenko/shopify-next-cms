"use client";

import { useRouter } from "next/navigation";
import { deletePageAction } from "@cms/_lib/actions";

export function DeletePageButton({
  pageId,
  pageTitle,
}: {
  pageId: string;
  pageTitle: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        if (!confirm(`Delete "${pageTitle}"? This cannot be undone.`)) return;
        await deletePageAction(pageId);
        router.refresh();
      }}
      className="inline-flex h-9 items-center rounded-md border border-destructive px-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
    >
      Delete
    </button>
  );
}
