# Mission

## What Shopify Next CMS is

An **open-source starter template** that developers clone via a single CLI command:

```bash
npx create-shopify-next-cms@latest my-shopify-app
```

to bootstrap a custom, headless Shopify storefront with a built-in Puck-based CMS — where **all CMS content lives inside Shopify itself** (Metaobjects), with no extra database, no extra service, and no third-party CMS vendor.

## Problems we exist to eliminate

1. **The Liquid ceiling.** Shopify's Liquid themes cap what a team can build. A headless Next.js app removes that ceiling while keeping Shopify as the commerce backend.
2. **Content teams blocked on engineering.** Without a CMS, every marketing experiment becomes a developer ticket. Puck gives content teams a visual editor for page composition.
3. **Third-party CMS lock-in.** External CMSes (Contentful, Sanity, Storyblok, etc.) force their own content model, their own auth, their own billing, and their own sync problems. We refuse that tradeoff.
4. **Glue-code fatigue between CMS and commerce.** Storefront data (products, collections, variants) and CMS content (pages, sections, theme) come from two different systems that must be kept in sync. We collapse both into the Shopify API surface.
5. **Heavy setup.** No database to provision, no extra auth service, no third-party account. Shopify credentials are enough.
6. **Empty-store bootstrap.** A fresh Shopify dev store has no catalog, so devs lose time hand-crafting test products before they can build anything. The bundled sample-data CLI seeds a realistic catalog in one command, letting development start immediately without real or manually-entered test data.

## Core value proposition

- **One command to start.** `create-shopify-next-cms` scaffolds a working app.
- **Shopify is the only backend.** Storefront data via Storefront API, CMS data via Admin API + Metaobjects. One source of truth, one set of credentials, one billing relationship.
- **Visual page editing.** Puck editor with drag-and-drop blocks, wired to Shopify Metaobjects for persistence.
- **Next.js 16 + React 19 baseline.** Server Components, streaming, modern caching primitives.
- **Fork-friendly.** This is a template, not a framework. Users own the code after scaffolding and adapt it freely.

## Who this is for

Primary audiences, in priority order:

1. **Freelance / agency developers** shipping custom Shopify storefronts for clients and needing a CMS-ready foundation they can adapt per project.
2. **In-house engineering teams** at brands moving off Liquid themes toward headless Next.js, who want a CMS without introducing a new vendor.
3. **Learners and OSS contributors** studying modern Next.js 16 + Shopify + Puck patterns, or contributing back to the project.

Explicitly **not** the target: non-technical merchants looking for a hosted turnkey product. This is a developer starter.

## What success looks like

- A developer can go from `npx create-shopify-next-cms` to a running storefront with a CMS-editable homepage in under 15 minutes, needing only Shopify credentials.
- Agencies use it as a repeatable base across multiple client projects.
- Contributors recognize the repo as a reference implementation of Next.js 16 + Shopify headless + Puck integration.

## Non-goals (for now)

- Multiple scaffolding templates / theme variants.
- A hosted product or SaaS offering.
- Role-based CMS permissions beyond basic editor protection.
- Multi-store orchestration.
- Replacing Shopify admin for merchandising workflows.
