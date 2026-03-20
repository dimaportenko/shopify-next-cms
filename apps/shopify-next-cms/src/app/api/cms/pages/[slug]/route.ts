import { getCmsPageBySlug } from "@/lib/shopify/queries/cms-pages";
import type { PageType } from "@/lib/shopify/types";
import { isValidPageType } from "@/app/cms/_lib/page-types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const rawType = searchParams.get("pageType") ?? "general";
  const pageType: PageType = isValidPageType(rawType) ? rawType : "general";

  const page = await getCmsPageBySlug({ slug, pageType });

  if (!page) {
    return Response.json({ error: "Page not found" }, { status: 404 });
  }

  return Response.json(page);
}
