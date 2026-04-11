export const PAGE_TYPES = [
  { label: "General", value: "general" },
  { label: "Product", value: "product" },
  { label: "Collection", value: "collection" },
  { label: "Home", value: "home" },
  { label: "Fragment", value: "fragment" },
] as const;

export type PageType = (typeof PAGE_TYPES)[number]["value"];

export const PAGE_TYPE_VALUES: PageType[] = PAGE_TYPES.map((pt) => pt.value);

export const isValidPageType = (value: string): value is PageType =>
  PAGE_TYPE_VALUES.includes(value as PageType);
