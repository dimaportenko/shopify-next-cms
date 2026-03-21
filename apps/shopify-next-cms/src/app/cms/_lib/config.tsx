import type { Config } from "@puckeditor/core";
import { heroConfig } from "@cms/_components/hero";
import { textBlockConfig } from "@cms/_components/text-block";
import { productCategoryBlockConfig } from "@cms/_components/product-category-block";
import { imageBannerConfig } from "@cms/_components/image-banner";
import { spacerConfig } from "@cms/_components/spacer";
import { PAGE_TYPES } from "@cms/_lib/page-types";

import type { HeroProps } from "@cms/_components/hero";
import type { TextBlockProps } from "@cms/_components/text-block";
import type { ProductCategoryBlockProps } from "@cms/_components/product-category-block";
import type { ImageBannerProps } from "@cms/_components/image-banner";
import type { SpacerProps } from "@cms/_components/spacer";

type Props = {
  Hero: HeroProps;
  TextBlock: TextBlockProps;
  ProductCategory: ProductCategoryBlockProps;
  ImageBanner: ImageBannerProps;
  Spacer: SpacerProps;
};

export const puckConfig: Config<Props> = {
  root: {
    fields: {
      title: { type: "text" },
      type: {
        type: "select",
        options: PAGE_TYPES as unknown as { label: string; value: string }[],
      },
    },
  },
  categories: {
    content: {
      components: ["Hero", "TextBlock", "ImageBanner"],
      title: "Content",
    },
    commerce: {
      components: ["ProductCategory"],
      title: "Commerce",
    },
    layout: {
      components: ["Spacer"],
      title: "Layout",
    },
  },
  components: {
    Hero: heroConfig,
    TextBlock: textBlockConfig,
    ProductCategory: productCategoryBlockConfig,
    ImageBanner: imageBannerConfig,
    Spacer: spacerConfig,
  },
};
