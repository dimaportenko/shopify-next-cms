import { cache } from "react";
import type { Metadata } from "next";
import { Render } from "@puckeditor/core";
import { notFound } from "next/navigation";
import { CollectionProductsSection } from "@/components/collection-products-section";
import { CmsPageShell } from "@/components/cms-page-shell";
import { puckConfig } from "@/app/cms/_lib/config";
import { getCollectionByHandle } from "@/lib/shopify/queries/collections";
import { getCmsPageBySlug } from "@/lib/shopify/queries/cms-pages";

const getCollection = cache(getCollectionByHandle);
const getCmsPage = cache(getCmsPageBySlug);

type CollectionPageParams = Promise<{ handle: string }>;

export default async function CollectionPage({
  params,
}: {
  params: CollectionPageParams;
}) {
  const { handle } = await params;
  const [collection, page] = await Promise.all([
    getCollection({ handle }),
    getCmsPage({ slug: "default", pageType: "collection" }).catch(() => null),
  ]);

  if (!collection) {
    notFound();
  }

  return (
    <CmsPageShell page={page}>
      <main className="min-h-screen bg-background">
        {page && page.status === "published" ? (
          <Render
            config={puckConfig}
            data={page.puckData}
            metadata={{ collection }}
          />
        ) : (
          <CollectionProductsSection collection={collection} />
        )}
      </main>
    </CmsPageShell>
  );
}

export async function generateMetadata({
  params,
}: {
  params: CollectionPageParams;
}): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection({ handle });

  return {
    title: collection?.title ?? "Collection Not Found",
    description:
      collection?.description ||
      `Browse products from the ${collection?.title ?? "storefront"} collection.`,
  };
}
