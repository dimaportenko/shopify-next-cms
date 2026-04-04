import { z } from "zod";
import { adminQuery } from "@/lib/shopify/admin-client";
import {
  FILE_BY_ID_QUERY,
  FILE_CREATE,
  FILES_QUERY,
} from "@/lib/shopify/queries/media.admin";
import type {
  FileByIdQuery,
  FileByIdQueryVariables,
  FileCreateMutation,
  FileCreateMutationVariables,
  FilesQuery,
  FilesQueryVariables,
} from "@generated-types/admin.generated";
import type { FileContentType } from "@generated-types/admin.types";

const IMAGE_CONTENT_TYPE: FileContentType = "IMAGE" as FileContentType;

const fileCreateBodySchema = z.object({
  resourceUrl: z.string().min(1),
  filename: z.string().min(1),
  alt: z.string().optional(),
});

type MediaImageNode = Extract<
  FilesQuery["files"]["edges"][number]["node"],
  { image?: unknown }
>;

const POLL_ATTEMPTS = 5;
const POLL_DELAY_MS = 1000;

async function pollForImageUrl(fileId: string): Promise<string | undefined> {
  for (let i = 0; i < POLL_ATTEMPTS; i++) {
    const data = await adminQuery<FileByIdQuery, FileByIdQueryVariables>(
      FILE_BY_ID_QUERY,
      { id: fileId },
    );
    const url = data.node?.image?.url;
    if (url) return url;
    await new Promise((resolve) => setTimeout(resolve, POLL_DELAY_MS));
  }
  return undefined;
}

function isMediaImageNode(
  node: FilesQuery["files"]["edges"][number]["node"],
): node is MediaImageNode {
  return "image" in node && node.image != null;
}

export async function POST(request: Request) {
  const parsed = fileCreateBodySchema.safeParse(await request.json());

  if (!parsed.success) {
    return Response.json(
      { error: "resourceUrl and filename are required" },
      { status: 400 },
    );
  }

  const { resourceUrl, filename, alt } = parsed.data;

  const data = await adminQuery<
    FileCreateMutation,
    FileCreateMutationVariables
  >(FILE_CREATE, {
    files: [
      {
        originalSource: resourceUrl,
        filename,
        alt: alt ?? filename,
        contentType: IMAGE_CONTENT_TYPE,
      },
    ],
  });

  const result = data.fileCreate;
  if (!result) {
    return Response.json(
      { error: "File create mutation returned no result" },
      { status: 500 },
    );
  }

  if (result.userErrors.length > 0) {
    return Response.json(
      { error: result.userErrors[0].message },
      { status: 400 },
    );
  }

  const file = result.files?.[0];
  if (!file) {
    return Response.json(
      { error: "No file returned after creation" },
      { status: 500 },
    );
  }

  let imageUrl = "image" in file ? file.image?.url : undefined;

  if (!imageUrl) {
    imageUrl = await pollForImageUrl(file.id);
  }

  return Response.json({
    id: file.id,
    url: imageUrl ?? resourceUrl,
    alt: file.alt,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const first = Number(searchParams.get("first") ?? "20");
  const after = searchParams.get("after") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  const query = [search, "media_type:IMAGE"].filter(Boolean).join(" ");

  const data = await adminQuery<FilesQuery, FilesQueryVariables>(FILES_QUERY, {
    first,
    after,
    query,
  });

  const images = data.files.edges.flatMap((edge) => {
    const { node } = edge;
    if (!isMediaImageNode(node) || !node.image) return [];
    return {
      id: node.id,
      url: node.image.url,
      alt: node.alt ?? "",
      width: node.image.width,
      height: node.image.height,
    };
  });

  return Response.json({
    images,
    pageInfo: data.files.pageInfo,
  });
}
