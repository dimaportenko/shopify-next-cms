"use client";

import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMediaUpload } from "./use-media-upload";
import { MediaLibraryModal } from "./media-library-modal";

interface MediaPickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

type UploadStatus = "idle" | "uploading" | "done";

export function MediaPickerField({
  value,
  onChange,
  readOnly,
}: MediaPickerFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { upload, error } = useMediaUpload();

  const handleUpload = useCallback(
    async (file: File) => {
      setUploadStatus("uploading");
      try {
        const cdnUrl = await upload(file);
        onChange(cdnUrl);
        setUploadStatus("done");
        setTimeout(() => setUploadStatus("idle"), 2000);
      } catch {
        setUploadStatus("idle");
      }
    },
    [upload, onChange],
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    if (readOnly) return;
    const file = event.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Preview / Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          if (!readOnly) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        className={cn(
          "flex min-h-20 items-center justify-center rounded-lg border-2 border-dashed p-2 text-center transition-all",
          isDragOver
            ? "border-primary bg-primary/10"
            : "border-border bg-muted/50",
        )}
      >
        {!value && (
          <span className="text-xs text-muted-foreground">
            {isDragOver ? "Drop image here" : "No image selected"}
          </span>
        )}
        {value && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={value}
            alt="Selected"
            className="max-h-30 max-w-full rounded object-contain"
          />
        )}
      </div>

      {/* Upload progress */}
      {uploadStatus === "uploading" && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="inline-block size-3 animate-spin rounded-full border-2 border-muted-foreground border-t-primary" />
          Uploading...
        </div>
      )}
      {uploadStatus === "done" && (
        <div className="text-xs text-green-600">Upload complete</div>
      )}

      {/* Error */}
      {error && <div className="text-xs text-destructive">{error}</div>}

      {/* Actions */}
      {!readOnly && (
        <div className="flex flex-wrap gap-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadStatus === "uploading"}
          >
            Upload
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setIsModalOpen(true)}
          >
            Browse Library
          </Button>
          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs text-destructive hover:text-destructive"
              onClick={() => onChange("")}
            >
              Remove
            </Button>
          )}
        </div>
      )}

      <MediaLibraryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSelect={onChange}
      />
    </div>
  );
}
