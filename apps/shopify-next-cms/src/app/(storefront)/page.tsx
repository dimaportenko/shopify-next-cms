import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeCustomizer } from "@/components/theme-customizer";
import { ProductCategory } from "@/components/product-category";
import Link from "next/link";
import { cache } from "react";
import { getCmsPageBySlug } from "@/lib/shopify/queries/cms-pages";
import { Render } from "@puckeditor/core";
import { puckConfig } from "../cms/_lib/config";

const getCmsPage = cache(getCmsPageBySlug);

export default async function Home() {
  const page = await getCmsPage({ slug: "home", pageType: "home" });

  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center justify-between gap-10 px-16 py-32 sm:items-start">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
            <Separator orientation="vertical" className="h-6" />
            <Link href="/cms">
              <Badge variant="secondary">Shopify CMS</Badge>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeCustomizer />
            <ThemeToggle />
          </div>
        </div>
      </main>

      {page && page.status === "published" && (
        <Render config={puckConfig} data={page.puckData} />
      )}

      <ProductCategory />
    </div>
  );
}
