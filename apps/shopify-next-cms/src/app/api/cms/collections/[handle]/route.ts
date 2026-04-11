import { z } from "zod";
import { getCollectionByHandle } from "@/lib/shopify/queries/collections";

const paramsSchema = z.object({
  handle: z.string().trim().min(1),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ handle: string }> },
) {
  const parsedParams = paramsSchema.safeParse(await params);

  if (!parsedParams.success) {
    return Response.json(
      { error: "Collection handle is required" },
      { status: 400 },
    );
  }

  const collection = await getCollectionByHandle({
    handle: parsedParams.data.handle,
  });

  if (!collection) {
    return Response.json({ error: "Collection not found" }, { status: 404 });
  }

  return Response.json(collection);
}
