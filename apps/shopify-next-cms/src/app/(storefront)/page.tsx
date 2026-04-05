import { ProductCategory } from "@/components/product-category";
import { cache } from "react";
import { getCmsPageBySlug } from "@/lib/shopify/queries/cms-pages";
import { Render } from "@puckeditor/core";
import { puckConfig } from "@cms/_lib/config";

const getCmsPage = cache(getCmsPageBySlug);

export default async function Home() {
  const page = await getCmsPage({ slug: "home", pageType: "home" });

  return (
    <>
      {page && page.status === "published" && (
        <Render config={puckConfig} data={page.puckData} />
      )}

      <ProductCategory />
    </>
  );
}
