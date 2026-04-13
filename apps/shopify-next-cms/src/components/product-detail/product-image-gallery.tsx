"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { ImageDto } from "@/lib/shopify/types";

interface ProductImageGalleryProps {
  productTitle: string;
  slides: ImageDto[];
  scrollToUrl?: string | null;
}

export function ProductImageGallery({
  productTitle,
  slides,
  scrollToUrl,
}: ProductImageGalleryProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const update = () => setSelectedIndex(api.selectedScrollSnap());
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  React.useEffect(() => {
    if (!api || !scrollToUrl) return;
    const idx = slides.findIndex((s) => s.url === scrollToUrl);
    if (idx >= 0 && idx !== api.selectedScrollSnap()) {
      api.scrollTo(idx);
    }
  }, [api, scrollToUrl, slides]);

  if (slides.length === 0) {
    return <div className="aspect-square rounded-2xl bg-muted" />;
  }

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true }}
      className="w-full"
      aria-label={`${productTitle} gallery`}
    >
      <CarouselContent className="ml-0">
        {slides.map((slide, index) => (
          <CarouselItem key={index} className="pl-0">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <Image
                src={slide.url}
                alt={slide.altText ?? productTitle}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "size-2.5 rounded-full transition-all",
                selectedIndex === index
                  ? "w-6 bg-foreground"
                  : "bg-muted-foreground/40 hover:bg-muted-foreground/70",
              )}
            />
          ))}
        </div>
      )}
    </Carousel>
  );
}
