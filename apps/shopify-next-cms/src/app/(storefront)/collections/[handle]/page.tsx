import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionProductCard } from "@/components/collection-product-card";
import { getCollectionByHandle } from "@/lib/shopify/queries/collections";

const getCollection = cache(getCollectionByHandle);

type CollectionPageParams = Promise<{ handle: string }>;

function getCollectionHeading(title: string): string {
  return `${title} Collection`;
}

export default async function CollectionPage({
  params,
}: {
  params: CollectionPageParams;
}) {
  const { handle } = await params;
  const collection = await getCollection({ handle });

  if (!collection) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
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
    </main>
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
