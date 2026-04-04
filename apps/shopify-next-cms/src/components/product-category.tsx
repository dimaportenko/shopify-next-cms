"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export interface CategoryItem {
  name: string;
  image: string;
  href: string;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    name: "Ear buds",
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-category/image-15.png",
    href: "#",
  },
  {
    name: "Smart Watches",
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-category/image-16.png",
    href: "#",
  },
  {
    name: "Sunglass",
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-category/image-17.png",
    href: "#",
  },
  {
    name: "Cap",
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-category/image-18.png",
    href: "#",
  },
  {
    name: "Footwear",
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-category/image-19.png",
    href: "#",
  },
  {
    name: "Home Decor",
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-category/image-20.png",
    href: "#",
  },
  {
    name: "Audio Visual",
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-category/image-12.png",
    href: "#",
  },
  {
    name: "Smart Hubs",
    image:
      "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-category/image-13.png",
    href: "#",
  },
];

interface ProductCategoryProps {
  heading?: string;
  subheading?: string;
  label?: string;
  categories?: CategoryItem[];
}

export function ProductCategory({
  heading = "Shop By Category",
  subheading = "Explore our gallery to learn more about our amazing products and their features.",
  label = "Category",
  categories,
}: ProductCategoryProps = {}) {
  const items = categories?.length ? categories : DEFAULT_CATEGORIES;

  return (
    <section className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-4 text-center sm:mb-16 lg:mb-24">
          <p className="text-sm font-medium text-primary uppercase">{label}</p>
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            {heading}
          </h2>
          <p className="text-xl text-muted-foreground">{subheading}</p>
        </div>
        <Carousel
          className="w-full px-6"
          opts={{
            align: "start",
            loop: false,
          }}
        >
          <CarouselContent className="-ml-6">
            {items.map((category) => (
              <CarouselItem
                key={category.name}
                className="basis-full pl-6 min-[475px]:basis-1/2 md:basis-1/4 xl:basis-1/6"
              >
                <Link
                  href={category.href}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="mb-6 flex size-35 items-center justify-center rounded-full bg-linear-to-b from-primary/25 to-muted/5 hover:border-2 hover:border-primary">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={120}
                      height={80}
                      className="h-20 max-w-30 object-contain"
                    />
                  </div>
                  <h3 className="text-center text-xl font-medium">
                    {category.name}
                  </h3>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="top-12 left-0 translate-y-0 md:-left-4" />
          <CarouselNext className="top-12 right-0 translate-y-0 md:-right-4" />
        </Carousel>
      </div>
    </section>
  );
}
