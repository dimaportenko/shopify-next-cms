import { cn } from "@/lib/utils";
import type { ComponentConfig } from "@puckeditor/core";
import Image from "next/image";

export interface ImageBannerProps {
  imageUrl: string;
  alt: string;
  overlayText: string;
  height: "sm" | "md" | "lg";
}

function ImageBannerRender({
  imageUrl,
  alt,
  overlayText,
  height,
}: ImageBannerProps) {
  const heightClass =
    height === "sm" ? "h-48" : height === "lg" ? "h-[500px]" : "h-80";

  return (
    <section className={cn("relative w-full overflow-hidden", heightClass)}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt || "Banner image"}
          fill
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <p className="text-muted-foreground">Add an image URL</p>
        </div>
      )}
      {overlayText && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {overlayText}
          </h2>
        </div>
      )}
    </section>
  );
}

export const imageBannerConfig: ComponentConfig<ImageBannerProps> = {
  fields: {
    imageUrl: { type: "text" },
    alt: { type: "text" },
    overlayText: { type: "text" },
    height: {
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
  },
  defaultProps: {
    imageUrl: "",
    alt: "",
    overlayText: "",
    height: "md",
  },
  render: ImageBannerRender,
};
