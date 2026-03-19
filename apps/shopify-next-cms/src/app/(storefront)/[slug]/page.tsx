import { Render } from "@puckeditor/core";
import { notFound } from "next/navigation";
import { getCmsPageBySlug } from "@/lib/shopify/queries/cms-pages";
import { puckConfig } from "@/app/cms/_lib/config";

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getCmsPageBySlug(slug);

  if (!page || page.status !== "published") {
    notFound();
  }

  return <Render config={puckConfig} data={page.puckData} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getCmsPageBySlug(slug);
  return { title: page?.title ?? "Page Not Found" };
}
