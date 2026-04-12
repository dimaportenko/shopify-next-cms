import type { ComponentConfig } from "@puckeditor/core";
import {
  ProductCategory,
  DEFAULT_CATEGORIES,
  type CategoryItem,
} from "@/components/product-category";
import { mediaPickerFieldConfig } from "@cms/_components/editor/media-picker";
import { collectionPickerFieldConfig } from "@cms/_components/editor/collection-picker";

export interface ProductCategoryBlockProps {
  heading: string;
  subheading: string;
  label: string;
  categories: CategoryItem[];
}

function ProductCategoryBlockRender({
  heading,
  subheading,
  label,
  categories,
}: ProductCategoryBlockProps) {
  return (
    <ProductCategory
      heading={heading}
      subheading={subheading}
      label={label}
      categories={categories}
    />
  );
}

export const productCategoryBlockConfig: ComponentConfig<ProductCategoryBlockProps> =
  {
    fields: {
      heading: { type: "text", label: "Heading" },
      subheading: { type: "textarea", label: "Subheading" },
      label: { type: "text", label: "Label" },
      categories: {
        type: "array",
        label: "Categories",
        arrayFields: {
          name: { type: "text", label: "Name" },
          image: mediaPickerFieldConfig("Image"),
          href: collectionPickerFieldConfig("Collection"),
        },
        defaultItemProps: {
          name: "New Category",
          image: "",
          href: "",
        },
        getItemSummary: (item) => item.name || "Untitled",
      },
    },
    defaultProps: {
      heading: "Shop By Category",
      subheading:
        "Explore our gallery to learn more about our amazing products and their features.",
      label: "Category",
      categories: DEFAULT_CATEGORIES,
    },
    render: ProductCategoryBlockRender,
  };
