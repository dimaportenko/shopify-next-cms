import type { Config } from "@puckeditor/core";
import { heroConfig } from "../_components/hero";
import { textBlockConfig } from "../_components/text-block";
import { productCategoryBlockConfig } from "../_components/product-category-block";
import { imageBannerConfig } from "../_components/image-banner";
import { spacerConfig } from "../_components/spacer";
import { PAGE_TYPES } from "./page-types";

import type { HeroProps } from "../_components/hero";
import type { TextBlockProps } from "../_components/text-block";
import type { ProductCategoryBlockProps } from "../_components/product-category-block";
import type { ImageBannerProps } from "../_components/image-banner";
import type { SpacerProps } from "../_components/spacer";

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
