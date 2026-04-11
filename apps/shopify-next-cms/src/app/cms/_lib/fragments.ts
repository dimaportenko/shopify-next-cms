import type { CmsPage } from "@/lib/shopify/types";
import type { PageType } from "./page-types";

export const FRAGMENT_SLUGS = {
  header: "header",
  footer: "footer",
} as const;

export type FragmentSlug = (typeof FRAGMENT_SLUGS)[keyof typeof FRAGMENT_SLUGS];

export const FRAGMENT_SLUG_VALUES: FragmentSlug[] =
  Object.values(FRAGMENT_SLUGS);

export interface FragmentDefinition {
  slug: FragmentSlug;
  label: string;
  description: string;
}

export const FRAGMENT_DEFINITIONS: readonly FragmentDefinition[] = [
  {
    slug: "header",
    label: "Site Header",
    description: "Shown at the top of every page",
  },
  {
    slug: "footer",
    label: "Site Footer",
    description: "Shown at the bottom of every page",
  },
];

export function isFragmentSlug(value: string): value is FragmentSlug {
  return FRAGMENT_SLUG_VALUES.includes(value as FragmentSlug);
}

export const SHOW_HIDE_OPTIONS = [
  { label: "Show", value: "show" },
  { label: "Hide", value: "hide" },
] as const;

export type SitePartVisibility = (typeof SHOW_HIDE_OPTIONS)[number]["value"];

export interface CmsRootProps {
  title?: string;
  type?: PageType;
  hideHeader?: SitePartVisibility;
  hideFooter?: SitePartVisibility;
}

export function getCmsRootProps(
  page: CmsPage | null | undefined,
): CmsRootProps {
  return (page?.puckData?.root?.props ?? {}) as CmsRootProps;
}

export function isHidden(value: SitePartVisibility | undefined): boolean {
  return value === "hide";
}

export function isPublishedFragment(
  page: CmsPage | null | undefined,
): page is CmsPage {
  return page != null && page.status === "published";
}
