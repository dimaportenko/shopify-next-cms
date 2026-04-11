import { cache } from "react";
import { Render } from "@puckeditor/core";
import { notFound } from "next/navigation";
import { getCmsPageBySlug } from "@/lib/shopify/queries/cms-pages";
import { puckConfig } from "@/app/cms/_lib/config";
import { CmsPageShell } from "@/components/cms-page-shell";

const getCmsPage = cache(getCmsPageBySlug);

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getCmsPage({ slug });

  if (!page || page.status !== "published") {
    notFound();
  }

  return (
    <CmsPageShell page={page}>
      <Render config={puckConfig} data={page.puckData} />
    </CmsPageShell>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getCmsPage({ slug });
  return { title: page?.title ?? "Page Not Found" };
}
