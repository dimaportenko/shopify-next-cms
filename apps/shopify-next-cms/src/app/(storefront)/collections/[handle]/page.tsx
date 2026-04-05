import { cache } from "react";
import { notFound } from "next/navigation";
import { getCollectionByHandle } from "@/lib/shopify/queries/collections";

const getCollection = cache(getCollectionByHandle);

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await getCollection({ handle });

  if (!collection) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        {collection.title}
      </h1>
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await getCollection({ handle });

  return {
    title: collection?.title ?? "Collection Not Found",
  };
}
