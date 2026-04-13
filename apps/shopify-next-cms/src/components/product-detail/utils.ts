import type { ImageDto, ProductDto, VariantDto } from "@/lib/shopify/types";

export function formatMoney(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}

export function getSlides(product: ProductDto): ImageDto[] {
  if (product.images.length > 0) return product.images;
  return product.featuredImage ? [product.featuredImage] : [];
}

export function getSelectedVariant(
  product: ProductDto,
  selectedOptions: Record<string, string>,
): VariantDto | undefined {
  return product.variants?.find((v) =>
    v.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value),
  );
}
