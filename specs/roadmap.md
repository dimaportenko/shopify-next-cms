# Roadmap

High-level implementation order, broken into small phases. Driven by `todo.md` and the known tech-stack gaps in `tech-stack.md`. Each phase is scoped to be completable in a single focused session.

## Guiding principles

- **Small phases.** Each phase has one observable outcome.
- **Gates first.** Testing and CI land before feature work that would benefit from them.
- **Mission alignment.** Every phase must serve the "CLI-scaffoldable, Shopify-only, CMS-ready starter" mission.
- **No speculative abstractions.** Only generalize when the second concrete use case appears.

## Phase legend

- 🟢 **Not started**
- 🟡 **In progress**
- ✅ **Done**

---

## Milestone 1 — Foundation hardening

Close the three prioritized tech-stack gaps before growing features.

### 1.1 — Monorepo hygiene: shared configs package 🟢
- Create `packages/tsconfig` with `base.json`, `nextjs.json`, `node.json`.
- Migrate `apps/shopify-next-cms` and `apps/docs` to extend shared configs.
- Migrate `packages/cms-migrations` and `packages/sample-data` similarly.
- **Done when:** no duplicated `compilerOptions` across workspace; `pnpm typecheck` green.

### 1.2 — Monorepo hygiene: shared ESLint + Prettier configs 🟢
- Create `packages/eslint-config` exporting `next`, `node`, `base`.
- Create `packages/prettier-config`.
- Apps consume shared configs; local overrides only where justified.
- **Done when:** `pnpm lint` green, formatting identical across packages.

### 1.3 — Monorepo hygiene: pnpm catalog + version pinning 🟢
- Adopt pnpm [catalog](https://pnpm.io/catalogs) for React, Next, TypeScript, Tailwind, Zod, tRPC, React Query.
- Pin all direct dependencies to exact versions (drop `^`) in catalog entries.
- **Done when:** all app `package.json`s reference `catalog:` for shared deps; `pnpm install` reproducible.

### 1.4 — Testing: Playwright E2E scaffold 🟢
- Add Playwright to `apps/shopify-next-cms` with one smoke test: homepage renders.
- Add `pnpm test:e2e` script at root.
- Document local run instructions in `apps/docs`.
- **Done when:** `pnpm test:e2e` passes locally against a running dev server.

### 1.5 — Testing: unit test runner 🟢
- Add Vitest at workspace root; one unit test per package that has non-trivial logic (`sample-data`, `cms-migrations`).
- Add `pnpm test` script.
- **Done when:** `pnpm test` green.

### 1.6 — CI pipeline 🟢
- GitHub Actions workflow: `pnpm install` → `lint` → `typecheck` → `codegen --check` → `test` → `test:e2e` (smoke only).
- Required on PRs to `main`.
- **Done when:** green CI on a trivial PR.

---

## Milestone 2 — Routing & page-type configuration

Direct from `todo.md`: "add configuration for routes per page type and handle".

### 2.1 — Page-type config module 🟢
- Create `apps/shopify-next-cms/src/config/routes.ts` mapping page type (`product`, `collection`, `cms-page`, `category`) → URL pattern.
- Centralize path builders: `productPath(handle)`, `collectionPath(handle)`, etc.
- **Done when:** all storefront code uses builders, no inline path strings.

### 2.2 — Configurable handle routing 🟢
- Support overriding patterns via env (e.g. `/p/[handle]` vs `/products/[handle]`).
- Validate config at app boot with Zod.
- **Done when:** changing a route pattern in config updates all links + route files consistently (or surfaces a clear error).

### 2.3 — Docs: routing guide 🟢
- New doc page in `apps/docs/content/docs/` explaining the routing config.
- **Done when:** page published under `shopify-integration` or new `routing` section.

---

## Milestone 3 — CLI scaffolder (`create-shopify-next-cms`)

The mission's headline deliverable: the one-command bootstrap. Extracted from PRD v0.1.

### 3.1 — CLI package skeleton 🟢
- Create `packages/create-shopify-next-cms` with `bin` entry and basic arg parsing.
- **Done when:** `pnpm --filter create-shopify-next-cms build` produces a runnable CLI.

### 3.2 — Template extraction 🟢
- Snapshot `apps/shopify-next-cms` into `templates/shopify-next-cms-default/` (or a generation script that copies on demand).
- Replace hard-coded names with template variables.
- **Done when:** running CLI in a temp dir produces a working, renamed copy.

### 3.3 — Post-scaffold guidance 🟢
- CLI prints setup steps (env vars, `pnpm install`, `codegen`, `cms-migrations run`).
- Optionally auto-install deps behind a flag.
- **Done when:** fresh clone → `npx` → running storefront in ≤15 minutes on a fresh machine.

### 3.4 — npm publish workflow 🟢
- CI job to publish `create-shopify-next-cms` on tag.
- **Done when:** package is installable via `npx create-shopify-next-cms@latest`.

---

## Milestone 4 — CMS polish (deferred)

Not prioritized in this cut. Revisit after Milestones 1–3.

- Draft/preview flow for CMS pages.
- Publish workflow with version history.
- Editor auth beyond `CMS_SECRET`.
- Additional Puck blocks (forms, embeds, marketing widgets).
- Image/asset workflows beyond Shopify file uploads.

---

## Out of scope

See `mission.md` non-goals. Multi-template scaffolding, hosted product, role-based permissions, multi-store orchestration — not on this roadmap.
