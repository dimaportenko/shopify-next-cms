"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

interface StagedUploadResponse {
  url: string;
  resourceUrl: string;
  parameters: { name: string; value: string }[];
}

interface FileCreateResponse {
  url: string;
}

async function uploadFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image file");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must be under 20MB");
  }

  // Step 1: Get staged upload URL
  const stagedRes = await fetch("/api/cms/media/staged-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      mimeType: file.type,
      fileSize: String(file.size),
    }),
  });

  if (!stagedRes.ok) {
    const data: { error?: string } = await stagedRes.json();
    throw new Error(data.error ?? "Failed to prepare upload");
  }

  const { url, resourceUrl, parameters }: StagedUploadResponse =
    await stagedRes.json();

  // Step 2: Upload file to Shopify's staged URL
  const formData = new FormData();
  for (const param of parameters) {
    formData.append(param.name, param.value);
  }
  formData.append("file", file);

  const uploadRes = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    throw new Error("Failed to upload file to Shopify");
  }

  // Step 3: Register the file
  const createRes = await fetch("/api/cms/media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      resourceUrl,
      filename: file.name,
      alt: file.name,
    }),
  });

  if (!createRes.ok) {
    const data: { error?: string } = await createRes.json();
    throw new Error(data.error ?? "Failed to register file");
  }

  const { url: cdnUrl }: FileCreateResponse = await createRes.json();
  return cdnUrl;
}

export function useMediaUpload() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "media"] });
    },
  });

  return {
    upload: mutation.mutateAsync,
    isUploading: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}
