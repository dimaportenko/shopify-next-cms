---
name: shopify-next-cms-storefront-patterns
description: Patterns for storefront work in this shopify-next-cms repo. Use for anything under apps/shopify-next-cms/src/app/(storefront), especially collection/product/category pages, shared layout/header changes, Storefront GraphQL queries and fragments, reusable DTO mappers, shadcn-themed storefront UI, docs updates, or adapting a visual reference URL to the project’s design system.
---

# Shopify Next CMS Storefront Patterns

Use these patterns when implementing storefront-facing work in this repository.

## Scope

Apply this skill for:

- pages in `apps/shopify-next-cms/src/app/(storefront)`
- shared storefront shell/layout concerns
- collection and product-list UI
- Shopify Storefront GraphQL queries in `src/lib/shopify/queries/*.storefront.ts`
- reusable DTO and mapper work in `src/lib/shopify/queries/*.ts` and `src/lib/shopify/types.ts`
- storefront architecture docs in `apps/docs/content/docs/shopify-integration`

## Route and layout patterns

- Put shared storefront chrome in `apps/shopify-next-cms/src/app/(storefront)/layout.tsx`.
- Keep shared top-level UI in reusable components such as `src/components/header.tsx`.
- Keep route pages focused on data loading, metadata, and composition.
- Follow current Next.js async route patterns: `params` is promise-based and must be awaited.

## CMS-backed collection templates

Collection pages support CMS templates via Puck. The storefront renders the CMS template when published, falling back to the default `CollectionProductsSection` component:

```tsx
// collections/[handle]/page.tsx
const [collection, page] = await Promise.all([
  getCollection({ handle }),
  getCmsPage({ slug: "default", pageType: "collection" }).catch(() => null),
]);

{page && page.status === "published" ? (
  <Render config={puckConfig} data={page.puckData} metadata={{ collection }} />
) : (
  <CollectionProductsSection collection={collection} />
)}
```

The `metadata={{ collection }}` prop passes the collection data from the route's `[handle]` param into Puck blocks. Blocks access it via `puck.metadata.collection`.

### Collection handle in the CMS editor

The CMS editor provides a `collectionHandle` root field (visible only when page type is "collection") so editors can preview blocks with real collection data. The editor reads this field via Puck's `onChange` callback and fetches the collection via a tRPC procedure, then passes it back as Puck's `metadata` prop. See the `puck-cms-patterns` skill for the full implementation pattern.

## UI implementation patterns

- Prefer the project’s shadcn-compatible components and theme tokens.
- Use semantic classes like `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-muted`, and `text-primary` before introducing raw color values.
- Make new storefront UI feel native to the project rather than pasted from an external reference.
- If the user provides a live reference:
  - inspect it first
  - identify the exact section to reproduce
  - copy the structure and interaction model faithfully
  - then adapt the styling to the project theme system
- Avoid hardcoded one-off visual values unless the design truly requires them.

## Shopify Storefront GraphQL patterns

- Put Storefront GraphQL documents in `*.storefront.ts` files.
- Extract reusable fragments for repeatable entity shapes, especially `Product`.
- Compose queries from those fragments rather than duplicating product fields inline.
- After changing any Storefront query or fragment, run codegen immediately.

### Preferred pattern

```ts
export const PRODUCT_FRAGMENT = `#graphql
  fragment ProductFragment on Product {
    id
    handle
    title
    featuredImage {
      url
      altText
      width
      height
    }
  }
`;
```

Then reuse it from collection/search/recommendation queries.

## DTO and mapper patterns

- Use reusable domain DTO names without redundant transport prefixes:
  - `ProductDto`
  - `CollectionDto`
  - `ImageDto`
  - `MoneyDto`
- Keep transport-to-domain mapping centralized in shared helpers.
- Prefer small composable mapper functions such as:
  - `toImageDto`
  - `toMoneyDto`
  - `toProductDto`
- Keep collection-level mappers thin by delegating nested product normalization to shared product mappers.

## Product image/gallery pattern

- If a storefront card or gallery needs multiple product images, fetch `images(first: N)` in the shared product fragment.
- Use `featuredImage` as fallback, not as a fake repeated gallery.
- Let UI components prefer `product.images` and fall back gracefully when empty.

## Documentation pattern

When storefront architecture changes, update `apps/docs` in the same task.

Usually this means updating one or more of:

- `apps/docs/content/docs/shopify-integration/index.mdx`
- `apps/docs/content/docs/shopify-integration/graphql-codegen.mdx`
- a dedicated storefront architecture page if the change is substantial

Document:

- where the shared layout/header lives
- which fragment is reusable
- which DTOs/mappers are shared
- any new image/query behavior relevant to storefront pages

## Validation checklist

For storefront implementation tasks in this repo, run:

```bash
pnpm --filter shopify-next-cms codegen
pnpm --filter shopify-next-cms typecheck
pnpm --filter shopify-next-cms lint
pnpm --filter shopify-next-cms exec prettier --write <changed-files>
```

Then do a Playwright smoke test against the affected storefront route, for example:

```bash
playwright-cli open http://localhost:3000/collections/gear
```

Check that:

- the page renders
- expected content is present
- there are no console errors in a fresh browser session

## Decision rules

When multiple approaches are possible:

- prefer shared layout over repeated page-level headers
- prefer reusable fragments over repeated selections
- prefer reusable DTOs over query-specific nested ad hoc shapes
- prefer theme tokens over hardcoded storefront colors
- prefer updating docs now over leaving architecture undocumented
