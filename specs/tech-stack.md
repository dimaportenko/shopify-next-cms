# Tech Stack

The canonical list of technologies used in this repo, why each was chosen, and where it lives.

## Monorepo & tooling

| Concern | Choice | Notes |
|---|---|---|
| Package manager | **pnpm** workspaces | Declared in `pnpm-workspace.yaml`. All commands use `pnpm`. |
| Build orchestration | **Turborepo** | `turbo.json` pipelines `dev`, `build`, `lint`, `typecheck`. |
| Language | **TypeScript 5** | Strict mode across apps and packages. |
| Linting | **ESLint 9** + `eslint-config-next` + `eslint-plugin-tailwindcss` | |
| Formatting | **Prettier** | Enforced on every coding task (per CLAUDE.md). |
| Node version | Types pinned at `@types/node ^20` | |

## Main app — `apps/shopify-next-cms/`

| Concern | Choice |
|---|---|
| Framework | **Next.js 16** (App Router, RSC) |
| React | **React 19.2** |
| Styling | **Tailwind CSS v4** via `@tailwindcss/postcss`, `tw-animate-css`, `tailwind-merge`, `class-variance-authority` |
| UI primitives | **shadcn/ui** (`shadcn` CLI, `components.json`), **@base-ui/react**, **lucide-react** icons |
| Theming | **next-themes** + live theme customizer (colors, typography, shadows) |
| Visual page editor | **@puckeditor/core** (Puck v0.21) |
| State | **Zustand** (client), **React Query** (`@tanstack/react-query`) for server state |
| API layer | **tRPC v11** (`@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query`) for CMS/admin procedures |
| Validation | **Zod v4** |
| Carousel / media | **embla-carousel-react** |

## Shopify integration

| Concern | Choice |
|---|---|
| Storefront data | **Shopify Storefront GraphQL API** |
| CMS persistence | **Shopify Admin GraphQL API** → **Shopify Metaobjects** |
| GraphQL codegen | **@graphql-codegen/cli** + **@shopify/api-codegen-preset** (`codegen`, `codegen:storefront`, `codegen:admin` scripts) |
| CMS schema versioning | **`packages/cms-migrations`** — versioned Metaobject definition migrations |
| Sample catalog | **`packages/sample-data`** — CLI to import Magento 2 sample data into Shopify |

## Docs — `apps/docs/`

- **Next.js** + **Fumadocs** (`content/docs/*.mdx`, `source.config.ts`)
- Topic areas: `puck-editor`, `shopify-integration`, `cms-migrations`, `sample-data`, `theme-customizer`

## Environment contract

Required env vars (see `.env.example`):

- `SHOPIFY_STORE_URL`
- `SHOPIFY_ADMIN_ACCESS_TOKEN`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `CMS_SECRET`
- `GOOGLE_FONTS_API_KEY`

## Mandatory per-task gates

Per project CLAUDE.md, every coding task must run:

1. `pnpm lint`
2. `pnpm typecheck`
3. `pnpm --filter shopify-next-cms codegen` (when GraphQL files change)
4. Prettier
5. Implementation testing — Playwright CLI for UI changes

## Known gaps (tracked in roadmap)

Gaps the constitution explicitly commits to closing:

1. **Monorepo hygiene.** No pnpm catalog for version unification. No shared `@repo/tsconfig`, `@repo/eslint-config`, or `@repo/prettier-config` packages — configs are duplicated in each app.
2. **Routing & page-type config.** No central configuration mapping page types (product, collection, CMS page, etc.) to URL patterns and handles. Currently hard-coded in `app/(storefront)/` routes.
3. **Testing infrastructure.** No unit test runner wired. No Playwright config committed. No CI pipeline enforcing lint / typecheck / codegen / tests.

Future work beyond these three gaps (auth/preview/publishing, versioning, multi-template scaffolding) is deliberately deferred — see `mission.md` non-goals.

## Stack decisions we are NOT revisiting

Any change to these is a mission-level decision, not a task-level one:

- Shopify as the only backend (no external DB, no external CMS).
- Next.js App Router + RSC (not Pages Router).
- Puck as the visual editor.
- Tailwind + shadcn as the styling baseline.
- pnpm + Turborepo as the monorepo tooling.
