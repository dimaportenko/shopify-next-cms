import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type {
  MagentoSimpleProduct,
  MagentoConfigurableProduct,
} from "../types.js";
import { parseCSVFile } from "../utils/csv.js";
import { getFixturesPath } from "../download.js";
import { debug, info } from "../utils/logger.js";

export interface ParsedProducts {
  simple: MagentoSimpleProduct[];
  configurable: MagentoConfigurableProduct[];
}

export function parseProducts(cacheDir: string): ParsedProducts {
  const simple: MagentoSimpleProduct[] = [];
  const configurable: MagentoConfigurableProduct[] = [];

  // Parse simple products from CatalogSampleData
  const simpleFixtures = getFixturesPath(cacheDir, "CatalogSampleData");
  const simpleProductDir = join(simpleFixtures, "SimpleProduct");

  if (existsSync(simpleProductDir)) {
    const productFiles = readdirSync(simpleProductDir).filter((f) =>
      f.startsWith("products_") && f.endsWith(".csv"),
    );

    for (const file of productFiles) {
      const filePath = join(simpleProductDir, file);
      const parsed = parseCSVFile<MagentoSimpleProduct>(filePath);
      simple.push(...parsed);
      debug(`Parsed ${parsed.length} simple products from ${file}`);
    }
  }

  // Parse configurable products from ConfigurableSampleData
  const configFixtures = getFixturesPath(cacheDir, "ConfigurableSampleData");
  const productsFile = join(configFixtures, "products.csv");

  if (existsSync(productsFile)) {
    const parsed = parseCSVFile<MagentoConfigurableProduct>(productsFile);

    // Separate parent configurables from child simples
    for (const product of parsed) {
      if (product.product_type === "configurable") {
        configurable.push(product);
      } else {
        simple.push({
          sku: product.sku,
          name: product.name,
          price: product.price,
          qty: "100",
          description: product.description,
          short_description: product.short_description,
          category: product.categories ?? "",
          product_type: product.product_type,
          additional_attributes: product.additional_attributes,
        });
      }
    }
    debug(
      `Parsed ${parsed.length} products from ConfigurableSampleData (${configurable.length} configurable)`,
    );
  }

  info(
    `Parsed ${simple.length} simple products and ${configurable.length} configurable products`,
  );
  return { simple, configurable };
}
