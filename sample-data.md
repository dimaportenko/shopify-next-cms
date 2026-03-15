# PRD: Sample Data Import Tool

## Status

Draft v0.1

## Overview

A CLI tool that downloads product and category data from [magento2-sample-data](https://github.com/dimaportenko/magento2-sample-data), transforms it into Shopify-compatible format, and imports it into a Shopify store — creating products with images and organizing them into collections.

This gives developers using `shopify-next-cms` a one-command way to populate a store with realistic sample data for development, demos, and testing.

## Problem Statement

A freshly created Shopify development store is empty. Developers need realistic product catalogs to build and test storefronts. Manually creating products and collections is tedious and time-consuming. The Magento 2 sample data repository provides a well-structured, freely available catalog (~200 products across multiple categories) that can serve as an excellent seed dataset.

## Product Goal

Ship a CLI command that populates a Shopify store with sample products and collections derived from Magento 2 sample data, requiring only Shopify Admin API credentials.

## Usage

```bash
pnpm sample-data import
```

Or as a standalone script:

```bash
npx ts-node scripts/sample-data/import.ts
```

## Data Source

**Repository:** `https://github.com/dimaportenko/magento2-sample-data` (branch: `2.4-develop`)

### Source Structure

```
app/code/Magento/
├── CatalogSampleData/fixtures/
│   ├── categories.csv                    # Gear categories (Bags, Fitness, Watches)
│   ├── attributes.csv                    # Product attributes
│   └── SimpleProduct/
│       ├── products_gear_bags.csv        # Simple product data
│       ├── products_gear_fitness_*.csv
│       ├── products_gear_watches.csv
│       ├── images_gear_bags.csv          # SKU → image path mapping
│       ├── images_gear_fitness_*.csv
│       └── images_gear_watches.csv
├── ConfigurableSampleData/fixtures/
│   ├── categories.csv                    # Apparel categories (Men, Women, nested)
│   ├── attributes.csv                    # Configurable attributes (size, color)
│   └── products.csv                      # Configurable + simple variant products
pub/media/
├── catalog/product/                      # Product images (JPG)
└── wysiwyg/                              # CMS media assets
```

### Source Data Summary

| Module                    | Content                                                  |
| ------------------------- | -------------------------------------------------------- |
| CatalogSampleData         | ~50 simple products (bags, fitness equipment, watches)   |
| ConfigurableSampleData    | ~200 configurable products (tops, bottoms, jackets, etc) |
| Categories (combined)     | ~30 categories with hierarchy                            |
| Product images            | JPGs organized by SKU in `pub/media/catalog/product/`    |

### Key CSV Columns Used

**Simple products** (`products_gear_*.csv`):
- `sku`, `name`, `price`, `qty`, `description`, `category`
- Custom attributes: `material`, `style_bags`, `activity`, `pattern`, etc.

**Configurable products** (`products.csv`):
- `sku`, `name`, `price`, `description`, `categories`, `product_type`
- `configurable_variations` (child SKU references with size/color)
- `additional_attributes` (activity, material, gender, etc.)

**Categories** (`categories.csv`):
- `name`, `url_key`, `path` (parent hierarchy), `active`, `is_anchor`, `include_in_menu`

**Images** (`images_gear_*.csv`):
- `sku`, `image` (relative path under `pub/media/catalog/product/`)

## Functional Requirements

### 1. Download & Cache Source Data

- Clone or download the `magento2-sample-data` repository to a local cache directory (`.cache/sample-data/`).
- If the cache already exists, skip download (use `--force` flag to re-download).
- Parse all relevant CSV fixture files from both `CatalogSampleData` and `ConfigurableSampleData`.

### 2. Transform Magento Data to Shopify Format

#### 2.1 Products

Map Magento product fields to Shopify product fields:

| Magento Field                | Shopify Field             |
| ---------------------------- | ------------------------- |
| `name`                       | `title`                   |
| `sku`                        | `variants[].sku`          |
| `price`                      | `variants[].price`        |
| `description`                | `descriptionHtml` (body)  |
| `qty`                        | `variants[].inventoryQuantity` |
| Product images               | `media[].originalSource`  |
| `product_type` (configurable)| Product with variants     |

**Configurable products:** Create a single Shopify product with multiple variants. Extract `size` and `color` from `configurable_variations` as Shopify product options.

**Simple products:** Create a Shopify product with a single default variant.

**Product attributes** (material, activity, style, etc.): Store as Shopify product metafields or tags.

#### 2.2 Collections

Map Magento categories to Shopify custom collections:

| Magento Field   | Shopify Field                       |
| --------------- | ----------------------------------- |
| `name`          | `title`                             |
| `url_key`       | `handle`                            |
| `path`          | Hierarchy (for description/sorting) |
| `active`        | `published`                         |

Create the following collections based on source categories:

**Top-level:**
- Men
- Women
- Gear

**Nested (as flat collections with naming convention):**
- Men - Tops, Men - Bottoms, Men - Jackets, Men - Hoodies & Sweatshirts, etc.
- Women - Tops, Women - Bottoms, Women - Jackets, etc.
- Gear - Bags, Gear - Fitness Equipment, Gear - Watches

**Promotional/Curated:**
- New Luma Yoga Collection
- Erin Recommends
- Performance Fabrics
- Eco Friendly
- Women Sale, Men Sale

#### 2.3 Collection Membership

Assign products to collections based on the `category`/`categories` field in the source CSV. A product can belong to multiple collections.

### 3. Import to Shopify

#### 3.1 Shopify Admin API Integration

- Use the Shopify Admin REST API or GraphQL Admin API.
- Authenticate via Admin API access token (from environment variable `SHOPIFY_ADMIN_ACCESS_TOKEN`).
- Target store URL from `SHOPIFY_STORE_URL` environment variable.

#### 3.2 Import Order

1. **Create collections** first (needed for product assignment).
2. **Create products** with variants, images, and pricing.
3. **Assign products to collections** via collection membership (collects).

#### 3.3 Image Upload

- Upload product images from `pub/media/catalog/product/` to Shopify.
- Use the image path mapping from `images_*.csv` to associate images with the correct product SKU.
- Support multiple images per product (primary + alternate views).

#### 3.4 Rate Limiting & Error Handling

- Respect Shopify API rate limits (use `retry-after` headers and bucket approach).
- Implement retry logic with exponential backoff for transient errors.
- Log progress and errors to console.
- Continue on individual product/collection failures (don't abort the entire import).

#### 3.5 Idempotency

- Before creating, check if a product with the same SKU already exists (skip or update).
- Before creating, check if a collection with the same handle already exists (skip or update).
- Support `--clean` flag to delete all sample data before re-importing.

### 4. CLI Interface

```bash
pnpm sample-data <command> [options]
```

**Commands:**

| Command   | Description                                      |
| --------- | ------------------------------------------------ |
| `import`  | Download source data and import into Shopify      |
| `clean`   | Remove all previously imported sample data        |
| `status`  | Show import status (counts of products/collections) |

**Options:**

| Flag                | Description                                    | Default |
| ------------------- | ---------------------------------------------- | ------- |
| `--force`           | Re-download source data even if cached         | false   |
| `--dry-run`         | Parse and transform data without calling APIs  | false   |
| `--products-only`   | Import only products (skip collections)        | false   |
| `--collections-only`| Import only collections (skip products)        | false   |
| `--limit <n>`       | Import only the first N products               | all     |
| `--verbose`         | Enable detailed logging                        | false   |

### 5. Environment Variables

| Variable                       | Required | Description                          |
| ------------------------------ | -------- | ------------------------------------ |
| `SHOPIFY_STORE_URL`            | Yes      | Store URL (e.g. `mystore.myshopify.com`) |
| `SHOPIFY_ADMIN_ACCESS_TOKEN`   | Yes      | Admin API access token               |

## Technical Implementation

### Package Location

```
packages/sample-data/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── download.ts           # Git clone / cache management
│   ├── parser/
│   │   ├── categories.ts     # Parse category CSVs
│   │   ├── products.ts       # Parse product CSVs (simple + configurable)
│   │   └── images.ts         # Parse image mapping CSVs
│   ├── transformer/
│   │   ├── collections.ts    # Magento category → Shopify collection
│   │   └── products.ts       # Magento product → Shopify product
│   ├── importer/
│   │   ├── shopify-client.ts # Shopify Admin API client
│   │   ├── collections.ts    # Create/update collections
│   │   ├── products.ts       # Create/update products with images
│   │   └── collects.ts       # Product ↔ collection assignments
│   └── utils/
│       ├── csv.ts            # CSV parsing utilities
│       ├── rate-limiter.ts   # API rate limit handler
│       └── logger.ts         # Logging utility
├── package.json
└── tsconfig.json
```

### Dependencies

- `csv-parse` — CSV parsing
- `@shopify/shopify-api` or raw `fetch` — Shopify Admin API calls
- `simple-git` or shell `git clone` — repo download
- `commander` or `yargs` — CLI argument parsing

### Shopify API Operations

**Products** (GraphQL Admin API):
- `productCreate` mutation
- `productVariantsBulkCreate` mutation
- `productCreateMedia` mutation (image upload via staged uploads)

**Collections:**
- `collectionCreate` mutation (custom collections)
- `collectionAddProducts` mutation

**Queries:**
- `products` query (check existing by SKU)
- `collections` query (check existing by handle)

## Non-Functional Requirements

- The tool must handle the full sample dataset (~250 products, ~30 collections) within a reasonable time frame (~5-10 minutes).
- Progress should be visible in the terminal (product X of Y, collection X of Y).
- The tool must not leave partial data on failure — log what was created so the user can run `clean` if needed.
- Must work with Shopify development stores (no paid plan required).

## Success Criteria

1. Running `pnpm sample-data import` on an empty Shopify dev store creates:
   - All products with correct titles, descriptions, pricing, and variants
   - Product images correctly associated with their products
   - Collections matching the Magento category hierarchy
   - Products assigned to the correct collections
2. Running the command again skips already-imported items (idempotent).
3. Running `pnpm sample-data clean` removes all imported sample data.
4. `--dry-run` outputs what would be created without calling Shopify APIs.

## Risks and Open Questions

- **Image hosting:** Magento images are stored as local files in the repo. They need to be uploaded to Shopify via staged uploads or external URL. Consider hosting them temporarily or using Shopify's `stagedUploadsCreate` mutation.
- **Configurable product mapping:** Magento's configurable product model (parent + simple children) maps well to Shopify's product + variants, but some edge cases (e.g., products with >3 options or >100 variants) may need special handling.
- **Rate limits:** With ~250 products and images, the import may be throttled. Bulk operations API (`bulkOperationRunMutation`) could be an alternative for large datasets.
- **Metafield mapping:** Decision needed on which Magento attributes to store as metafields vs tags vs product type.
- **Category hierarchy:** Shopify collections are flat. Need to decide naming convention for nested categories (e.g., "Men - Tops - Jackets" vs "Men > Tops > Jackets").

## Future Considerations

- Support for importing CMS sample pages (from `CmsSampleData`) as Puck-managed pages
- Support for customer sample data
- Support for review/rating sample data
- Bulk Operations API for faster import
- Interactive mode with product/collection selection
- Export tool (Shopify → Magento format) for bidirectional testing
