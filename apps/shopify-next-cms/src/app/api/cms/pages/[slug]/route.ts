import { getCmsPageBySlug } from "@/lib/shopify/queries/cms-pages";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const page = await getCmsPageBySlug(slug);

  if (!page) {
    return Response.json({ error: "Page not found" }, { status: 404 });
  }

  return Response.json(page);
}
