import type { Config } from "@puckeditor/core";
import { heroConfig } from "@cms/_components/blocks/hero";
import { textBlockConfig } from "@cms/_components/blocks/text-block";
import { productCategoryBlockConfig } from "@cms/_components/blocks/product-category-block";
import { imageBannerConfig } from "@cms/_components/blocks/image-banner";
import { spacerConfig } from "@cms/_components/blocks/spacer";
import { collectionProductsBlockConfig } from "@cms/_components/blocks/collection-products-block";
import { headerBlockConfig } from "@cms/_components/blocks/header-block";
import { PAGE_TYPES } from "@cms/_lib/page-types";
import { SHOW_HIDE_OPTIONS, type CmsRootProps } from "@cms/_lib/fragments";

import type { HeroProps } from "@cms/_components/blocks/hero";
import type { TextBlockProps } from "@cms/_components/blocks/text-block";
import type { ProductCategoryBlockProps } from "@cms/_components/blocks/product-category-block";
import type { ImageBannerProps } from "@cms/_components/blocks/image-banner";
import type { SpacerProps } from "@cms/_components/blocks/spacer";
import type { CollectionProductsBlockProps } from "@cms/_components/blocks/collection-products-block";
import type { HeaderBlockProps } from "@cms/_components/blocks/header-block";

type Props = {
  Hero: HeroProps;
  TextBlock: TextBlockProps;
  ProductCategory: ProductCategoryBlockProps;
  ImageBanner: ImageBannerProps;
  Spacer: SpacerProps;
  CollectionProducts: CollectionProductsBlockProps;
  Header: HeaderBlockProps;
};

export const puckConfig: Config<Props, CmsRootProps> = {
  root: {
    fields: {
      title: { type: "text", label: "Title" },
      type: {
        type: "select",
        label: "Page Type",
        options: PAGE_TYPES,
      },
      hideHeader: {
        type: "radio",
        label: "Site Header",
        options: SHOW_HIDE_OPTIONS,
      },
      hideFooter: {
        type: "radio",
        label: "Site Footer",
        options: SHOW_HIDE_OPTIONS,
      },
    },
  },
  categories: {
    content: {
      components: ["Hero", "TextBlock", "ImageBanner"],
      title: "Content",
    },
    commerce: {
      components: ["ProductCategory", "CollectionProducts"],
      title: "Commerce",
    },
    layout: {
      components: ["Spacer"],
      title: "Layout",
    },
    fragments: {
      components: ["Header"],
      title: "Fragments",
    },
  },
  components: {
    Hero: heroConfig,
    TextBlock: textBlockConfig,
    ProductCategory: productCategoryBlockConfig,
    ImageBanner: imageBannerConfig,
    Spacer: spacerConfig,
    CollectionProducts: collectionProductsBlockConfig,
    Header: headerBlockConfig,
  },
};
