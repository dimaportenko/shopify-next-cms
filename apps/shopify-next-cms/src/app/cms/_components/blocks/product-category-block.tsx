import type { ComponentConfig } from "@puckeditor/core";
import { ProductCategory } from "@/components/product-category";

export interface ProductCategoryBlockProps {
  heading: string;
  subheading: string;
  label: string;
}

function ProductCategoryBlockRender({
  heading,
  subheading,
  label,
}: ProductCategoryBlockProps) {
  return (
    <ProductCategory heading={heading} subheading={subheading} label={label} />
  );
}

export const productCategoryBlockConfig: ComponentConfig<ProductCategoryBlockProps> =
  {
    fields: {
      heading: { type: "text", label: "heading" },
      subheading: { type: "textarea", label: "subheading" },
      label: { type: "text", label: "label" },
    },
    defaultProps: {
      heading: "Shop By Category",
      subheading:
        "Explore our gallery to learn more about our amazing products and their features.",
      label: "Category",
    },
    render: ProductCategoryBlockRender,
  };
