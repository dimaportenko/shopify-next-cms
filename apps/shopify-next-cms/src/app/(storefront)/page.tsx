import { ProductCategory } from "@/components/product-category";
import { cache } from "react";
import { getCmsPageBySlug } from "@/lib/shopify/queries/cms-pages";
import { Render } from "@puckeditor/core";
import { puckConfig } from "@cms/_lib/config";
import { CmsPageShell } from "@/components/cms-page-shell";

const getCmsPage = cache(getCmsPageBySlug);

export default async function Home() {
  const page = await getCmsPage({ slug: "home", pageType: "home" });

  return (
    <CmsPageShell page={page}>
      {page && page.status === "published" && (
        <Render config={puckConfig} data={page.puckData} />
      )}

      <ProductCategory />
    </CmsPageShell>
  );
}
