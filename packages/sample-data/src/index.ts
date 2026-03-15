#!/usr/bin/env node

import { Command } from "commander";
import { downloadSampleData } from "./download.js";
import { parseCategories } from "./parser/categories.js";
import { parseProducts } from "./parser/products.js";
import { parseImages } from "./parser/images.js";
import { transformCategoriesToCollections } from "./transformer/collections.js";
import {
  transformAllProducts,
  buildProductCollectionMap,
} from "./transformer/products.js";
import { getConfig } from "./importer/shopify-client.js";
import {
  importCollections,
  deleteAllCollections,
} from "./importer/collections.js";
import { importProducts, deleteAllProducts } from "./importer/products.js";
import { assignProductsToCollections } from "./importer/collects.js";
import { info, setVerbose, success, error } from "./utils/logger.js";

const program = new Command();

program
  .name("sample-data")
  .description(
    "Import Magento 2 sample data into a Shopify store as products and collections",
  )
  .version("0.1.0");

program
  .command("import")
  .description("Download source data and import into Shopify")
  .option("--force", "Re-download source data even if cached", false)
  .option(
    "--dry-run",
    "Parse and transform data without calling Shopify APIs",
    false,
  )
  .option("--products-only", "Import only products (skip collections)", false)
  .option(
    "--collections-only",
    "Import only collections (skip products)",
    false,
  )
  .option("--limit <n>", "Import only the first N products", parseInt)
  .option("--verbose", "Enable detailed logging", false)
  .action(async (options) => {
    if (options.verbose) setVerbose(true);

    try {
      // Step 1: Download source data
      const cacheDir = await downloadSampleData(options.force);

      // Step 2: Parse CSVs
      info("Parsing source data...");
      const categories = parseCategories(cacheDir);
      const { simple, configurable } = parseProducts(cacheDir);
      const imageMap = parseImages(cacheDir);

      // Step 3: Transform
      info("Transforming to Shopify format...");
      const collections = transformCategoriesToCollections(categories);
      let products = transformAllProducts(simple, configurable, imageMap);
      const productCollectionMap = buildProductCollectionMap(
        simple,
        configurable,
      );

      if (options.limit) {
        products = products.slice(0, options.limit);
        info(`Limited to ${products.length} products`);
      }

      // Build collection membership: handle → SKUs
      const collectionMembership = new Map<string, string[]>();
      for (const [sku, categoryNames] of productCollectionMap.entries()) {
        for (const catName of categoryNames) {
          const handle = catName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
          const existing = collectionMembership.get(handle) ?? [];
          existing.push(sku);
          collectionMembership.set(handle, existing);
        }
      }

      // Step 4: Dry run output
      if (options.dryRun) {
        info("=== DRY RUN ===");
        info(`Would create ${collections.length} collections:`);
        for (const c of collections) {
          info(`  - ${c.title} (${c.handle})`);
        }
        info(`Would create ${products.length} products:`);
        for (const p of products) {
          info(
            `  - ${p.title} (${p.variants.length} variant${p.variants.length === 1 ? "" : "s"}, ${p.images.length} image${p.images.length === 1 ? "" : "s"})`,
          );
        }
        info(
          `Would create ${[...collectionMembership.values()].reduce((a, b) => a + b.length, 0)} product-collection assignments`,
        );
        return;
      }

      // Step 5: Import to Shopify
      const config = getConfig();

      if (!options.productsOnly) {
        info("Importing collections...");
        await importCollections(config, collections);
      }

      if (!options.collectionsOnly) {
        info("Importing products...");
        await importProducts(config, products);
      }

      if (!options.productsOnly && !options.collectionsOnly) {
        info("Assigning products to collections...");
        await assignProductsToCollections(config, collectionMembership);
      }

      success("Import complete!");
    } catch (err) {
      error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

program
  .command("clean")
  .description("Remove all products and collections from the store")
  .option("--verbose", "Enable detailed logging", false)
  .action(async (options) => {
    if (options.verbose) setVerbose(true);

    try {
      const config = getConfig();

      info("Deleting all products...");
      const productsDeleted = await deleteAllProducts(config);

      info("Deleting all collections...");
      const collectionsDeleted = await deleteAllCollections(config);

      success(
        `Clean complete: ${productsDeleted} products, ${collectionsDeleted} collections deleted`,
      );
    } catch (err) {
      error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

program
  .command("status")
  .description("Show import status (counts of products and collections)")
  .option("--verbose", "Enable detailed logging", false)
  .action(async (options) => {
    if (options.verbose) setVerbose(true);

    try {
      const config = getConfig();

      const productResult = await import("./importer/shopify-client.js").then(
        ({ graphql }) =>
          graphql<{
            products: { edges: Array<{ node: { id: string } }> };
          }>(config, `{ products(first: 1) { edges { node { id } } } }`),
      );

      const collectionResult = await import(
        "./importer/shopify-client.js"
      ).then(({ graphql }) =>
        graphql<{
          collections: { edges: Array<{ node: { id: string } }> };
        }>(
          config,
          `{ collections(first: 1) { edges { node { id } } } }`,
        ),
      );

      // Use count queries
      const countResult = await import("./importer/shopify-client.js").then(
        ({ graphql }) =>
          graphql<{
            productsCount: { count: number };
            collectionsCount: { count: number };
          }>(
            config,
            `{
              productsCount { count }
              collectionsCount { count }
            }`,
          ),
      );

      info(`Products: ${countResult.productsCount?.count ?? "unknown"}`);
      info(`Collections: ${countResult.collectionsCount?.count ?? "unknown"}`);
    } catch (err) {
      error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

program.parse();
