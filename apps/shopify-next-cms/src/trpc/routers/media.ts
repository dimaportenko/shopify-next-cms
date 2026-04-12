import { z } from "zod";
import { publicProcedure, router } from "../init";
import { adminQuery } from "@/lib/shopify/admin-client";
import {
  FILE_BY_ID_QUERY,
  FILE_CREATE,
  FILES_QUERY,
  STAGED_UPLOADS_CREATE,
} from "@/lib/shopify/queries/media.admin";
import type {
  FileByIdQuery,
  FileByIdQueryVariables,
  FileCreateMutation,
  FileCreateMutationVariables,
  FilesQuery,
  FilesQueryVariables,
  StagedUploadsCreateMutation,
  StagedUploadsCreateMutationVariables,
} from "@generated-types/admin.generated";
import type {
  FileContentType,
  StagedUploadHttpMethodType,
  StagedUploadTargetGenerateUploadResource,
} from "@generated-types/admin.types";
import { TRPCError } from "@trpc/server";

const IMAGE_CONTENT_TYPE: FileContentType = "IMAGE" as FileContentType;
const HTTP_METHOD_POST: StagedUploadHttpMethodType =
  "POST" as StagedUploadHttpMethodType;
const RESOURCE_FILE: StagedUploadTargetGenerateUploadResource =
  "FILE" as StagedUploadTargetGenerateUploadResource;

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

export const mediaRouter = router({
  list: publicProcedure
    .input(
      z.object({
        first: z.number().default(20),
        cursor: z.string().nullish(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const query = [input.search, "media_type:IMAGE"]
        .filter(Boolean)
        .join(" ");

      const data = await adminQuery<FilesQuery, FilesQueryVariables>(
        FILES_QUERY,
        { first: input.first, after: input.cursor ?? undefined, query },
      );

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

      return {
        images,
        nextCursor: data.files.pageInfo.hasNextPage
          ? (data.files.pageInfo.endCursor ?? undefined)
          : undefined,
      };
    }),

  create: publicProcedure
    .input(
      z.object({
        resourceUrl: z.string().min(1),
        filename: z.string().min(1),
        alt: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const data = await adminQuery<
        FileCreateMutation,
        FileCreateMutationVariables
      >(FILE_CREATE, {
        files: [
          {
            originalSource: input.resourceUrl,
            filename: input.filename,
            alt: input.alt ?? input.filename,
            contentType: IMAGE_CONTENT_TYPE,
          },
        ],
      });

      const result = data.fileCreate;
      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "File create mutation returned no result",
        });
      }

      if (result.userErrors.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.userErrors[0].message,
        });
      }

      const file = result.files?.[0];
      if (!file) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No file returned after creation",
        });
      }

      let imageUrl = "image" in file ? file.image?.url : undefined;
      if (!imageUrl) {
        imageUrl = await pollForImageUrl(file.id);
      }

      return {
        id: file.id,
        url: imageUrl ?? input.resourceUrl,
        alt: file.alt,
      };
    }),

  stagedUpload: publicProcedure
    .input(
      z.object({
        filename: z.string().min(1),
        mimeType: z.string().min(1),
        fileSize: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const data = await adminQuery<
        StagedUploadsCreateMutation,
        StagedUploadsCreateMutationVariables
      >(STAGED_UPLOADS_CREATE, {
        input: [
          {
            filename: input.filename,
            mimeType: input.mimeType,
            fileSize: input.fileSize,
            httpMethod: HTTP_METHOD_POST,
            resource: RESOURCE_FILE,
          },
        ],
      });

      const result = data.stagedUploadsCreate;
      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Staged upload mutation returned no result",
        });
      }

      if (result.userErrors.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.userErrors[0].message,
        });
      }

      const target = result.stagedTargets?.[0];
      if (!target) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No staged upload target returned",
        });
      }

      return {
        url: target.url,
        resourceUrl: target.resourceUrl,
        parameters: target.parameters,
      };
    }),
});
