import { cache } from "react";
import type { Metadata } from "next";
import { Render } from "@puckeditor/core";
import { notFound } from "next/navigation";
import { CmsPageShell } from "@/components/cms-page-shell";
import { ProductDetail } from "@/components/product-detail";
import { puckConfig } from "@/app/cms/_lib/config";
import { getCmsPageBySlug } from "@/lib/shopify/queries/cms-pages";
import { getProductByHandle } from "@/lib/shopify/queries/products";

const getProduct = cache(getProductByHandle);
const getCmsPage = cache(getCmsPageBySlug);

type ProductPageParams = Promise<{ handle: string }>;

export default async function ProductPage({
  params,
}: {
  params: ProductPageParams;
}) {
  const { handle } = await params;
  const [product, page] = await Promise.all([
    getProduct({ handle }),
    getCmsPage({ slug: "default", pageType: "product" }).catch(() => null),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <CmsPageShell page={page}>
      <main className="min-h-screen bg-background">
        {page && page.status === "published" ? (
          <Render
            config={puckConfig}
            data={page.puckData}
            metadata={{ product }}
          />
        ) : (
          <ProductDetail product={product} />
        )}
      </main>
    </CmsPageShell>
  );
}

export async function generateMetadata({
  params,
}: {
  params: ProductPageParams;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct({ handle });

  return {
    title: product?.title ?? "Product Not Found",
    description:
      product?.description ||
      `Product details page of ${product?.title ?? "storefront"}.`,
  };
}
