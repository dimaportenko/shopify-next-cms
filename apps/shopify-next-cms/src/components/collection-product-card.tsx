"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { ProductDto } from "@/lib/shopify/types";

interface CollectionProductCardProps {
  product: ProductDto;
  fallbackHref: string;
}

function formatMoney(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

function getSlides(product: ProductDto) {
  const images = product.images;

  if (images.length > 0) {
    return images;
  }

  return product.featuredImage ? [product.featuredImage] : [];
}

export function CollectionProductCard({
  product,
  fallbackHref,
}: CollectionProductCardProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const slides = getSlides(product);
  const href = product.onlineStoreUrl ?? fallbackHref;
  const price = formatMoney(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode,
  );
  const compareAt = product.compareAtPriceRange.minVariantPrice
    ? formatMoney(
        product.compareAtPriceRange.minVariantPrice.amount,
        product.compareAtPriceRange.minVariantPrice.currencyCode,
      )
    : null;
  const showDiscount =
    compareAt !== null &&
    Number(product.compareAtPriceRange.minVariantPrice?.amount ?? 0) >
      Number(product.priceRange.minVariantPrice.amount);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    const updateSelectedIndex = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    updateSelectedIndex();
    api.on("select", updateSelectedIndex);
    api.on("reInit", updateSelectedIndex);

    return () => {
      api.off("select", updateSelectedIndex);
      api.off("reInit", updateSelectedIndex);
    };
  }, [api]);

  return (
    <article className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-muted/40">
        {slides.length > 0 ? (
          <Carousel
            setApi={setApi}
            opts={{ loop: true }}
            className="w-full"
            aria-label={`${product.title} gallery`}
          >
            <CarouselContent className="ml-0">
              {slides.map((slide, index) => (
                <CarouselItem key={`${product.id}-${index}`} className="pl-0">
                  <div className="relative aspect-4/5 w-full">
                    <Image
                      src={slide.url}
                      alt={slide.altText ?? product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/90 px-3 py-2 backdrop-blur-sm">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                      "size-2 rounded-full transition-all",
                      selectedIndex === index
                        ? "w-5 bg-foreground"
                        : "bg-muted-foreground/40 hover:bg-muted-foreground/70",
                    )}
                  />
                ))}
              </div>

              <Button
                render={
                  <Link
                    href={href}
                    target={product.onlineStoreUrl ? "_blank" : undefined}
                    rel={product.onlineStoreUrl ? "noreferrer" : undefined}
                  />
                }
                nativeButton={false}
                className="h-10 px-4"
              >
                Add to Cart
                <ShoppingCart className="size-4" />
              </Button>
            </div>
          </Carousel>
        ) : (
          <div className="relative aspect-4/5 w-full bg-linear-to-b from-secondary/60 to-muted/70">
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/90 px-3 py-2 backdrop-blur-sm">
                <span className="size-2 rounded-full bg-foreground" />
              </div>
              <Button
                render={
                  <Link
                    href={href}
                    target={product.onlineStoreUrl ? "_blank" : undefined}
                    rel={product.onlineStoreUrl ? "noreferrer" : undefined}
                  />
                }
                nativeButton={false}
                className="h-10 px-4"
              >
                Add to Cart
                <ShoppingCart className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1 px-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {product.vendor}
          </h3>
          <span className="text-lg font-semibold text-foreground">{price}</span>
        </div>

        {showDiscount ? (
          <div className="flex items-center justify-between gap-4 text-sm">
            <p className="text-muted-foreground">{product.title}</p>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground line-through">
                {compareAt}
              </span>
              <span className="font-medium text-primary">
                {Math.round(
                  ((Number(
                    product.compareAtPriceRange.minVariantPrice?.amount,
                  ) -
                    Number(product.priceRange.minVariantPrice.amount)) /
                    Number(
                      product.compareAtPriceRange.minVariantPrice?.amount,
                    )) *
                    100,
                )}
                % Off
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{product.title}</p>
        )}
      </div>
    </article>
  );
}
