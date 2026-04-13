"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ProductDto } from "@/lib/shopify/types";
import { ProductImageGallery } from "./product-image-gallery";
import { ProductInfoAccordion } from "./product-info-accordion";
import { ProductVariantSelector } from "./product-variant-selector";
import { ProductActions } from "./product-actions";
import { formatMoney, getSelectedVariant, getSlides } from "./utils";

function getInitialOptions(product: ProductDto): Record<string, string> {
  const firstAvailable =
    product.variants?.find((v) => v.availableForSale) ?? product.variants?.[0];
  if (!firstAvailable) return {};
  return Object.fromEntries(
    firstAvailable.selectedOptions.map((opt) => [opt.name, opt.value]),
  );
}

interface ProductDetailProps {
  product: ProductDto;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedOptions, setSelectedOptions] = React.useState(() =>
    getInitialOptions(product),
  );

  const slides = React.useMemo(() => getSlides(product), [product]);
  const selectedVariant = getSelectedVariant(product, selectedOptions);

  const price = selectedVariant
    ? formatMoney(
        selectedVariant.price.amount,
        selectedVariant.price.currencyCode,
      )
    : formatMoney(
        product.priceRange.minVariantPrice.amount,
        product.priceRange.minVariantPrice.currencyCode,
      );

  const compareAtPrice =
    selectedVariant?.compareAtPrice &&
    Number(selectedVariant.compareAtPrice.amount) >
      Number(selectedVariant.price.amount)
      ? formatMoney(
          selectedVariant.compareAtPrice.amount,
          selectedVariant.compareAtPrice.currencyCode,
        )
      : null;

  const discountPercent = compareAtPrice
    ? Math.round(
        ((Number(selectedVariant!.compareAtPrice!.amount) -
          Number(selectedVariant!.price.amount)) /
          Number(selectedVariant!.compareAtPrice!.amount)) *
          100,
      )
    : 0;

  const isAvailable = selectedVariant
    ? selectedVariant.availableForSale
    : product.availableForSale;

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <ProductImageGallery
            productTitle={product.title}
            slides={slides}
            scrollToUrl={selectedVariant?.image?.url}
          />
          <ProductInfoAccordion description={product.description} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-1">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
              {product.vendor}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {product.title}
            </h1>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold">{price}</span>
              {compareAtPrice && (
                <span className="text-base text-muted-foreground line-through">
                  {compareAtPrice}
                </span>
              )}
              {discountPercent > 0 && (
                <Badge variant="destructive">{discountPercent}% Off</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Inclusive of all taxes
            </p>
          </div>

          {product.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          {product.options.map((option) => (
            <ProductVariantSelector
              key={option.name}
              option={option}
              product={product}
              selectedOptions={selectedOptions}
              onOptionChange={handleOptionChange}
            />
          ))}

          <div className="flex items-center gap-2">
            <div
              className={cn(
                "size-2 rounded-full",
                isAvailable ? "bg-green-500" : "bg-destructive",
              )}
            />
            <span className="text-sm text-muted-foreground">
              {isAvailable ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <Separator />

          <ProductActions
            isAvailable={isAvailable}
            onlineStoreUrl={product.onlineStoreUrl}
          />
        </div>
      </div>
    </div>
  );
}
