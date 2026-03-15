// Magento source types

export interface MagentoSimpleProduct {
  sku: string;
  name: string;
  price: string;
  qty: string;
  description: string;
  short_description?: string;
  category: string;
  weight?: string;
  product_type?: string;
  additional_attributes?: string;
}

export interface MagentoConfigurableProduct {
  sku: string;
  name: string;
  price: string;
  description: string;
  short_description?: string;
  categories: string;
  product_type: string;
  configurable_variations?: string;
  additional_attributes?: string;
}

export interface MagentoCategory {
  name: string;
  url_key: string;
  path: string;
  active: string;
  is_anchor?: string;
  include_in_menu?: string;
}

export interface MagentoImageMapping {
  sku: string;
  image: string;
}

// Shopify target types

export interface ShopifyProductInput {
  title: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  status: "ACTIVE" | "DRAFT";
  options: string[];
  variants: ShopifyVariantInput[];
  images: ShopifyImageInput[];
}

export interface ShopifyVariantInput {
  sku: string;
  price: string;
  inventoryQuantity: number;
  options: string[];
}

export interface ShopifyImageInput {
  src: string;
  altText?: string;
}

export interface ShopifyCollectionInput {
  title: string;
  handle: string;
  descriptionHtml: string;
  published: boolean;
}

// Transformed data ready for import

export interface TransformedData {
  products: ShopifyProductInput[];
  collections: ShopifyCollectionInput[];
  collectionMembership: Map<string, string[]>; // collection handle → product SKUs
}

// Import result types

export interface ImportResult {
  productsCreated: number;
  productsSkipped: number;
  productsFailed: number;
  collectionsCreated: number;
  collectionsSkipped: number;
  collectionsFailed: number;
  collectsCreated: number;
}
