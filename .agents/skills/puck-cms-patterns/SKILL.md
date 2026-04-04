---
name: puck-cms-patterns
description: Patterns for building Puck visual editor blocks, custom fields, and Shopify CMS integrations. Use when creating or modifying Puck component configs, adding custom Puck field types, building array fields with sub-fields, implementing Shopify file/media uploads via staged upload API, writing API routes that call Shopify Admin GraphQL, or connecting react-query to CMS data. Triggers on tasks involving ComponentConfig, puck fields, puck blocks, media pickers, Shopify stagedUploadsCreate, fileCreate, or CMS editor features.
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

## API Route Patterns

### Input Validation with Zod

API routes are system boundaries — validate input with Zod schemas instead of type assertions. This gives runtime validation and type inference in one step:

```tsx
import { z } from "zod";

const bodySchema = z.object({
  resourceUrl: z.string().min(1),
  filename: z.string().min(1),
  alt: z.string().optional(),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "..." }, { status: 400 });
  }
  const { resourceUrl, filename, alt } = parsed.data;  // fully typed
}
```

### Handling Nullable Shopify Responses

Shopify mutations return deeply optional types (`Maybe<{ files?: Maybe<Array<...>> }>`). Check each level explicitly and return appropriate error responses instead of using non-null assertions (`!`):

```tsx
const result = data.fileCreate;
if (!result) {
  return Response.json({ error: "Mutation returned no result" }, { status: 500 });
}
if (result.userErrors.length > 0) {
  return Response.json({ error: result.userErrors[0].message }, { status: 400 });
}
const file = result.files?.[0];
if (!file) {
  return Response.json({ error: "No file returned" }, { status: 500 });
}
```

### Type-Safe Filtering of Union Types

Shopify file queries return unions (`MediaImage | Video | GenericFile | ...`). Use a type guard with `flatMap` instead of `filter().map()` — TypeScript narrows within the `flatMap` callback but loses narrowing across `filter` → `map`:

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

## React Query Integration

### Cache Invalidation After Mutations

When a mutation changes data that a query caches, invalidate the query. Otherwise users see stale data when navigating back:

```tsx
const queryClient = useQueryClient();

// After publishing a page:
await publishPageAction(slug, pageType, data);
await queryClient.invalidateQueries({ queryKey: ["cms-page", pageType, slug] });

// After uploading media:
const mutation = useMutation({
  mutationFn: uploadFile,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["cms", "media"] });
  },
});
```

### Upload Hooks

Extract the upload logic into a pure async function and wrap it with `useMutation`. This gives you `isPending`, `error`, and automatic cache invalidation — no manual `useState` needed:

```tsx
async function uploadFile(file: File): Promise<string> {
  // validation, 3-step upload, return CDN URL
}

export function useMediaUpload() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cms", "media"] }),
  });
  return {
    upload: mutation.mutateAsync,
    isUploading: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}
```

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

## Editor UI Components

Use `<img>` (not `next/image`) in editor panel components. The editor sidebar shows thumbnails for content editors — image URLs may come from any domain, and `next/image` requires all hostnames to be whitelisted. The `@next/next/no-img-element` eslint disable is the standard acknowledgment for this intentional choice.

For media library modals in the Puck editor, use shadcn `Dialog` with `createPortal` or the standard dialog pattern — the modal needs to escape Puck's panel z-index context.
