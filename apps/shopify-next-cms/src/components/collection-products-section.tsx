"use client";

import type { PagePreviewEntity } from "@cms/_lib/page-preview/shared";
import { CollectionProductCard } from "@/components/collection-product-card";
import type { CollectionDto } from "@/lib/shopify/types";

interface CollectionProductsSectionProps {
  collection: CollectionDto | null;
  preview?: PagePreviewEntity<CollectionDto>;
}

function getCollectionHeading(title: string): string {
  return `${title} Collection`;
}

function getEmptyStateCopy(preview?: PagePreviewEntity<CollectionDto>) {
  switch (preview?.state) {
    case "loading":
      return {
        eyebrow: "Loading collection preview",
        title: preview?.handle
          ? `Fetching “${preview.handle}”.`
          : "Fetching collection preview.",
        description:
          "The editor will update automatically when Shopify collection data is ready.",
      };
    case "not-found":
      return {
        eyebrow: "Collection not found",
        title: preview?.handle
          ? `No Shopify collection matches “${preview.handle}”.`
          : "No Shopify collection matches this handle.",
        description:
          "Check the collection handle in page settings and try again.",
      };
    case "error":
      return {
        eyebrow: "Collection preview unavailable",
        title: "We couldn't load this collection preview.",
        description: "Try again in a moment or verify your Shopify connection.",
      };
    case "idle":
    case "ready":
    default:
      return {
        eyebrow: "Collection preview unavailable",
        title: "Set a preview collection handle.",
        description:
          "Use the Preview Collection Handle page setting to render collection-aware blocks in the editor.",
      };
  }
}

export function CollectionProductsSection({
  collection,
  preview,
}: CollectionProductsSectionProps) {
  if (!collection) {
    const emptyState = getEmptyStateCopy(preview);

    return (
      <section className="mx-auto h-full w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-3xl border border-dashed border-border px-6 py-20 text-center">
          <p className="text-sm font-medium tracking-[0.24em] text-muted-foreground uppercase">
            {emptyState.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            {emptyState.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            {emptyState.description}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto h-full w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8 text-center md:mb-12">
        <p className="text-sm font-medium tracking-[0.24em] text-muted-foreground uppercase">
          {collection.title}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {getCollectionHeading(collection.title)}
        </h1>
      </div>

      {collection.products.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {collection.products.map((product) => (
            <CollectionProductCard
              key={product.id}
              product={product}
              fallbackHref={`/collections/${collection.handle}`}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border px-6 py-20 text-center">
          <p className="text-sm font-medium tracking-[0.24em] text-muted-foreground uppercase">
            Coming soon
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            Products for this collection are on the way.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Check back soon for new arrivals in this collection.
          </p>
        </div>
      )}
    </section>
  );
}
