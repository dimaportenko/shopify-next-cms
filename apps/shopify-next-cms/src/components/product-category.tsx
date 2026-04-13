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
import { getCollectionPath } from "@/lib/routes";

export interface CategoryItem {
  name: string;
  image: string;
  href: string;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    name: "Tops",
    image:
      "https://cdn.shopify.com/s/files/1/0985/3655/4867/files/Blue_Top_Category.png?v=1775327136",
    href: "women-tops",
  },
  {
    name: "Hoodies",
    image:
      "https://cdn.shopify.com/s/files/1/0985/3655/4867/files/Hoodie_Category.png?v=1775328264",
    href: "women-tops-hoodies-sweatshirts",
  },
  {
    name: "Pants",
    image:
      "https://cdn.shopify.com/s/files/1/0985/3655/4867/files/Pink_pants_category.png?v=1775327382",
    href: "women-bottoms-pants",
  },
  {
    name: "Jackets",
    image:
      "https://cdn.shopify.com/s/files/1/0985/3655/4867/files/Blue_Jacket_Category.png?v=1775327993",
    href: "women-tops-jackets",
  },
  {
    name: "Shorts",
    image:
      "https://cdn.shopify.com/s/files/1/0985/3655/4867/files/wsh01-green_main.png?v=1775326685",
    href: "women-bottoms-shorts",
  },
  {
    name: "Gear",
    image:
      "https://cdn.shopify.com/s/files/1/0985/3655/4867/files/Gear_Category.png?v=1775328430",
    href: "gear",
  },
  {
    name: "Bags",
    image:
      "https://cdn.shopify.com/s/files/1/0985/3655/4867/files/bags-category.png?v=1775326869",
    href: "gear-bags",
  },
];

function toCollectionHref(href: string): string {
  if (!href) return "#";
  if (href.startsWith("/")) return href;
  return getCollectionPath(href);
}

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
                  href={toCollectionHref(category.href)}
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
