---
name: puck-cms-patterns
description: Patterns for building Puck visual editor blocks, custom fields, and Shopify CMS integrations. Use when creating or modifying Puck component configs, adding custom Puck field types, building array fields with sub-fields, implementing Shopify file/media uploads via staged upload API, writing tRPC procedures that call Shopify Admin GraphQL, connecting tRPC + react-query to CMS data, using Puck metadata to pass external context to blocks, or conditionally showing/hiding root fields with resolveFields. Triggers on tasks involving ComponentConfig, puck fields, puck blocks, puck metadata, resolveFields, media pickers, Shopify stagedUploadsCreate, fileCreate, tRPC routers for CMS data, or CMS editor features.
---

# Puck CMS Patterns

This skill captures proven patterns for building Puck visual editor components with Shopify CMS integration. These patterns come from real production code and avoid common pitfalls that require refactoring.

## Puck Documentation

When you need to look up Puck API details (field types, overrides, plugins, component config options), use the ctx7 CLI:

```bash
# Find the Puck library ID
npx ctx7 library puck

# Query specific topics
npx ctx7 docs /puckeditor/puck "custom fields array fields configuration"
npx ctx7 docs /puckeditor/puck "component config overrides"
npx ctx7 docs /puckeditor/puck "external field adaptor"
```

The library ID is `/puckeditor/puck`. Always check docs for field type APIs before implementing — Puck's field system has options like `min`, `max`, `getItemSummary`, `defaultItemProps` that are easy to miss.

## Puck Block Structure

Every Puck block follows this pattern: a render component, a typed props interface, and a `ComponentConfig` export.

```tsx
import type { ComponentConfig } from "@puckeditor/core";
import { MyComponent } from "@/components/my-component";

export interface MyBlockProps {
  title: string;
  items: ItemType[];
}

function MyBlockRender({ title, items }: MyBlockProps) {
  return <MyComponent title={title} items={items} />;
}

export const myBlockConfig: ComponentConfig<MyBlockProps> = {
  fields: { /* field definitions */ },
  defaultProps: { /* defaults */ },
  render: MyBlockRender,
};
```

Keep the block config and the presentational component separate. The block config lives in `app/cms/_components/blocks/`, the component in `components/`. This separation means the component works outside the CMS editor too.

### Array Fields

Use Puck's `type: "array"` for repeatable items. Define sub-fields with `arrayFields`, provide `defaultItemProps` for new items, and `getItemSummary` for the editor UI label.

```tsx
categories: {
  type: "array",
  label: "Categories",
  arrayFields: {
    name: { type: "text", label: "Name" },
    image: mediaPickerFieldConfig("Image"),  // custom field works as sub-field
    href: { type: "text", label: "Link URL" },
  },
  defaultItemProps: { name: "New Category", image: "", href: "#" },
  getItemSummary: (item) => item.name || "Untitled",
},
```

When array data has sensible defaults, export them from the component file and import in the block config to avoid duplication.

### Custom Fields

Custom fields use `type: "custom"` with a `render` function. Wrap them in a factory function for reuse:

```tsx
export function mediaPickerFieldConfig(label = "Image") {
  return {
    type: "custom" as const,
    label,
    render: ({ value, onChange, readOnly }: {
      value: string;
      onChange: (value: string) => void;
      readOnly?: boolean;
    }) => (
      <MediaPickerField value={value} onChange={onChange} readOnly={readOnly} />
    ),
  };
}
```

This factory pattern lets you use the field in both standalone configs and as `arrayFields` sub-fields.

## Puck Metadata — Passing External Context to Blocks

Use Puck's `metadata` prop to inject server-fetched data (like a Shopify collection) into blocks without making blocks fetch their own data:

**On the rendering side** (`<Render>` for storefront, `<Puck>` for editor):
```tsx
<Render config={puckConfig} data={page.puckData} metadata={{ collection }} />
// or in the editor:
<Puck config={puckConfig} data={initialData} metadata={{ collection: collectionData ?? null }} />
```

**Inside the block**, access metadata via `puck.metadata`:
```tsx
function CollectionProductsBlockRender({
  puck,
}: CollectionProductsBlockProps & {
  puck?: { metadata?: { collection?: CollectionDto | null } };
}) {
  const collection = puck?.metadata?.collection ?? null;
  return <CollectionProductsSection collection={collection} />;
}
```

The `metadata` prop is typed as `{ [key: string]: any }` — Puck passes it through to all blocks. When metadata is absent (e.g., no collection selected), blocks should render a graceful empty state.

### Fetching Metadata in the Editor

The editor page needs to bridge between Puck's root props (where the user enters a collection handle) and the fetched data (passed back as metadata). Use Puck's `onChange` callback to track root prop changes:

```tsx
const [collectionHandle, setCollectionHandle] = useState("");
const activeHandle = collectionHandle || getRootHandle(initialData);

const { data: collectionData } = useCollectionByHandle(
  isCollectionPage && activeHandle ? activeHandle : null,
);

const handleDataChange = useCallback(
  (data: CmsData) => {
    if (!isCollectionPage) return;
    setCollectionHandle((prev) => {
      const next = getRootHandle(data);
      return next === prev ? prev : next;
    });
  },
  [isCollectionPage],
);
```

The functional updater `(prev) => next === prev ? prev : next` prevents re-renders when the handle hasn't changed — Puck's `onChange` fires on every keystroke in any field.

## Conditional Root Fields with `resolveFields`

Use `resolveFields` on the root config to show/hide fields based on other root prop values. This runs on every field panel render, so avoid expensive work:

```tsx
export const puckConfig: Config<Props, CmsRootProps> = {
  root: {
    fields: {
      title: { type: "text", label: "Title" },
      type: { type: "select", label: "Page Type", options: PAGE_TYPES },
      collectionHandle: { type: "text", label: "Collection Handle" },
      // ...
    },
    resolveFields: (data, { fields }) => {
      if (data.props?.type !== "collection") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { collectionHandle, ...rest } = fields;
        return rest;
      }
      return fields;
    },
  },
};
```

Add the field to `CmsRootProps` in `fragments.ts` so it's part of the typed root props interface.

## Typed Puck Data

Define `CmsData` as a parameterized `Data` type to get proper typing on root props:

```tsx
// config.tsx
import type { Config, Data } from "@puckeditor/core";
export type CmsData = Data<Props, CmsRootProps>;
```

Make `CmsPage` generic so consumers can narrow the puck data type:

```tsx
// types.ts
export interface CmsPage<D extends Data = Data> {
  id: string;
  puckData: D;
  // ...
}
```

The stored JSON from Shopify is untyped, so a cast is needed at the consumption boundary:

```tsx
const puckData = (page.puckData || EMPTY_DATA) as CmsData;
```

This is a legitimate boundary narrowing — the cast belongs at the point of use where you know the data matches your config's shape.

## Shopify Admin API Integration

### GraphQL Queries

Place Shopify Admin GraphQL queries in files named `*.admin.ts` so the codegen picks them up. After writing new queries, run `pnpm codegen:admin` to generate types, then import from `@generated-types/admin.generated`.

```tsx
// queries/media.admin.ts
export const FILE_CREATE = `#graphql
  mutation FileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) { ... }
  }
`;

// After running codegen:admin, use the generated types:
import type { FileCreateMutation, FileCreateMutationVariables }
  from "@generated-types/admin.generated";

const data = await adminQuery<FileCreateMutation, FileCreateMutationVariables>(
  FILE_CREATE, { files: [...] }
);
```

Never hand-write response interfaces for Shopify queries. The codegen generates precise types from your actual query selections, including union types for polymorphic fields like `File` (which can be `MediaImage | Video | GenericFile | ...`).

### Enum Values from Generated Types

Shopify enums are declared in `.d.ts` files and have no runtime values. Isolate the cast to a module-level constant:

```tsx
import type { FileContentType } from "@generated-types/admin.types";
const IMAGE_CONTENT_TYPE: FileContentType = "IMAGE" as FileContentType;
```

This keeps the `as` cast in one place instead of scattered through business logic.

### Staged Upload Flow (3-Step)

Uploading files to Shopify requires three steps:

1. **Get staged URL** — call `stagedUploadsCreate` with file metadata, get back `{ url, resourceUrl, parameters }`
2. **Upload to staged URL** — POST a `FormData` to the returned `url` with all `parameters` appended before the file
3. **Register the file** — call `fileCreate` with `originalSource: resourceUrl`

The file may not have a CDN URL immediately after step 3 (Shopify processes asynchronously). Poll with a `node(id:)` query to get the final URL, falling back to the `resourceUrl` if polling times out.

Add `shopify-staged-uploads.storage.googleapis.com` to `next.config.ts` `remotePatterns` — staged upload URLs use this hostname.

## tRPC Integration

The project uses tRPC v11 for end-to-end type-safe API calls. All CMS data fetching goes through tRPC procedures — no manual API routes or `as` casts on `response.json()`.

### Router Structure

```
src/trpc/
├── init.ts           — initTRPC, exports router + publicProcedure
├── client.tsx        — TRPCReactProvider, useTRPC, trpcClient (shared singleton)
└── routers/
    ├── _app.ts       — merged root router, exports AppRouter type
    ├── cms.ts        — getPageBySlug, getCollectionByHandle
    ├── media.ts      — list (cursor pagination), create, stagedUpload
    └── fonts.ts      — list
```

The catch-all handler lives at `src/app/api/trpc/[trpc]/route.ts`.

### Queries with useTRPC

Use `useTRPC()` hook to get the typed proxy, then pass `queryOptions()` to `useQuery`:

```tsx
const trpc = useTRPC();
const { data: page } = useQuery(
  trpc.cms.getPageBySlug.queryOptions({ slug, pageType }),
);
```

For cache invalidation, use `queryKey()`:
```tsx
await queryClient.invalidateQueries({
  queryKey: trpc.cms.getPageBySlug.queryKey({ slug, pageType }),
});
```

### Infinite Queries with Cursor Pagination

Use `cursor: z.string().nullish()` in the input schema and return `nextCursor` from the procedure:

```tsx
list: publicProcedure
  .input(z.object({ cursor: z.string().nullish(), search: z.string().optional() }))
  .query(async ({ input }) => {
    const data = await adminQuery(QUERY, { after: input.cursor ?? undefined });
    return {
      images,
      nextCursor: data.pageInfo.hasNextPage ? data.pageInfo.endCursor : undefined,
    };
  }),
```

Client side, use `infiniteQueryOptions`:
```tsx
const trpc = useTRPC();
return useInfiniteQuery(
  trpc.media.list.infiniteQueryOptions(
    { search },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  ),
);
```

### Imperative Mutations (Multi-Step Flows)

For multi-step flows like file upload (staged upload -> S3 upload -> file create), import the shared `trpcClient` singleton for imperative `.mutate()` calls:

```tsx
import { trpcClient, useTRPC } from "@/trpc/client";

const staged = await trpcClient.media.stagedUpload.mutate({ filename, mimeType, fileSize });
// ... upload to S3 ...
const result = await trpcClient.media.create.mutate({ resourceUrl, filename });
```

The singleton `trpcClient` is the same instance used by `TRPCReactProvider`, so HTTP batching is shared.

### Input Validation with Zod

tRPC procedures use Zod schemas for input validation. For TypeScript union types that already exist, use `z.enum()` instead of `z.string()` with manual coercion:

```tsx
import { PAGE_TYPE_VALUES } from "@/app/cms/_lib/page-types";

const pageTypeSchema = z.enum(PAGE_TYPE_VALUES as [PageType, ...PageType[]]).default("general");
```

### Handling Nullable Shopify Responses in tRPC

Shopify mutations return deeply optional types. Use `TRPCError` with appropriate codes instead of `Response.json()`:

```tsx
import { TRPCError } from "@trpc/server";

const result = data.fileCreate;
if (!result) {
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Mutation returned no result" });
}
if (result.userErrors.length > 0) {
  throw new TRPCError({ code: "BAD_REQUEST", message: result.userErrors[0].message });
}
```

### Type-Safe Filtering of Union Types

Shopify file queries return unions (`MediaImage | Video | GenericFile | ...`). Use a type guard with `flatMap` instead of `filter().map()` — TypeScript narrows within the `flatMap` callback but loses narrowing across `filter` -> `map`:

```tsx
type MediaImageNode = Extract<FilesQuery["files"]["edges"][number]["node"], { image?: unknown }>;

function isMediaImageNode(node: /* union type */): node is MediaImageNode {
  return "image" in node && node.image != null;
}

// flatMap lets TS narrow within the same callback
const images = data.files.edges.flatMap((edge) => {
  const { node } = edge;
  if (!isMediaImageNode(node) || !node.image) return [];
  return { id: node.id, url: node.image.url };  // no assertions needed
});
```

## Editor UI Components

Use `<img>` (not `next/image`) in editor panel components. The editor sidebar shows thumbnails for content editors — image URLs may come from any domain, and `next/image` requires all hostnames to be whitelisted. The `@next/next/no-img-element` eslint disable is the standard acknowledgment for this intentional choice.

For media library modals in the Puck editor, use shadcn `Dialog` with `createPortal` or the standard dialog pattern — the modal needs to escape Puck's panel z-index context.

## React 19 Event Types

React 19 deprecates `FormEvent` and the `React.*` namespace for event types. Import event types directly:

```tsx
// Deprecated
const handleSubmit = (event: React.FormEvent) => { ... }

// Correct — use the specific event type
import { type SubmitEvent } from "react";
const handleSubmit = (event: SubmitEvent) => { ... }

// Other events — import directly, not via React namespace
import { type ChangeEvent, type DragEvent } from "react";
```
