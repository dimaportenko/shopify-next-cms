import { z } from "zod";
import { adminQuery } from "@/lib/shopify/admin-client";
import { STAGED_UPLOADS_CREATE } from "@/lib/shopify/queries/media.admin";
import type {
  StagedUploadsCreateMutation,
  StagedUploadsCreateMutationVariables,
} from "@generated-types/admin.generated";
import type {
  StagedUploadHttpMethodType,
  StagedUploadTargetGenerateUploadResource,
} from "@generated-types/admin.types";

const HTTP_METHOD_POST: StagedUploadHttpMethodType =
  "POST" as StagedUploadHttpMethodType;
const RESOURCE_FILE: StagedUploadTargetGenerateUploadResource =
  "FILE" as StagedUploadTargetGenerateUploadResource;

const stagedUploadBodySchema = z.object({
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  fileSize: z.string().min(1),
});

export async function POST(request: Request) {
  const parsed = stagedUploadBodySchema.safeParse(await request.json());

  if (!parsed.success) {
    return Response.json(
      { error: "filename, mimeType, and fileSize are required" },
      { status: 400 },
    );
  }

  const { filename, mimeType, fileSize } = parsed.data;

  const data = await adminQuery<
    StagedUploadsCreateMutation,
    StagedUploadsCreateMutationVariables
  >(STAGED_UPLOADS_CREATE, {
    input: [
      {
        filename,
        mimeType,
        fileSize,
        httpMethod: HTTP_METHOD_POST,
        resource: RESOURCE_FILE,
      },
    ],
  });

  const result = data.stagedUploadsCreate;
  if (!result) {
    return Response.json(
      { error: "Staged upload mutation returned no result" },
      { status: 500 },
    );
  }

  if (result.userErrors.length > 0) {
    return Response.json(
      { error: result.userErrors[0].message },
      { status: 400 },
    );
  }

  const target = result.stagedTargets?.[0];
  if (!target) {
    return Response.json(
      { error: "No staged upload target returned" },
      { status: 500 },
    );
  }

  return Response.json({
    url: target.url,
    resourceUrl: target.resourceUrl,
    parameters: target.parameters,
  });
}
