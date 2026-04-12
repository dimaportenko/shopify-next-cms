"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, useTRPC } from "@/trpc/client";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export function useMediaUpload() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const mutation = useMutation({
    mutationFn: async (file: File): Promise<string> => {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file");
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error("File size must be under 20MB");
      }

      const staged = await trpcClient.media.stagedUpload.mutate({
        filename: file.name,
        mimeType: file.type,
        fileSize: String(file.size),
      });

      const formData = new FormData();
      for (const param of staged.parameters) {
        formData.append(param.name, param.value);
      }
      formData.append("file", file);

      const uploadRes = await fetch(staged.url, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file to Shopify");
      }

      const result = await trpcClient.media.create.mutate({
        resourceUrl: staged.resourceUrl,
        filename: file.name,
        alt: file.name,
      });

      return result.url;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.media.list.queryKey(),
      });
    },
  });

  return {
    upload: mutation.mutateAsync,
    isUploading: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}
