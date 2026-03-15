import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { MagentoImageMapping } from "../types.js";
import { parseCSVFile } from "../utils/csv.js";
import { getFixturesPath } from "../download.js";
import { debug, info } from "../utils/logger.js";

interface ProductRow {
  sku: string;
  base_image?: string;
  additional_images?: string;
}

function addImage(imageMap: Map<string, string[]>, sku: string, image: string): void {
  if (!image || !sku) return;
  const images = imageMap.get(sku) ?? [];
  if (!images.includes(image)) {
    images.push(image);
    imageMap.set(sku, images);
  }
}

function extractImagesFromProductRows(
  filePath: string,
  imageMap: Map<string, string[]>,
): number {
  const rows = parseCSVFile<ProductRow>(filePath);
  let count = 0;
  for (const row of rows) {
    if (!row.sku) continue;
    if (row.base_image) {
      addImage(imageMap, row.sku, row.base_image);
      count++;
    }
    if (row.additional_images) {
      for (const img of row.additional_images.split(",")) {
        const trimmed = img.trim();
        if (trimmed) {
          addImage(imageMap, row.sku, trimmed);
          count++;
        }
      }
    }
  }
  return count;
}

export function parseImages(
  cacheDir: string,
): Map<string, string[]> {
  const imageMap = new Map<string, string[]>();

  // Parse image CSVs from CatalogSampleData (SimpleProduct)
  const simpleFixtures = getFixturesPath(cacheDir, "CatalogSampleData");
  const simpleProductDir = join(simpleFixtures, "SimpleProduct");

  if (existsSync(simpleProductDir)) {
    const imageFiles = readdirSync(simpleProductDir).filter((f) =>
      f.startsWith("images_") && f.endsWith(".csv"),
    );

    for (const file of imageFiles) {
      const filePath = join(simpleProductDir, file);
      const parsed = parseCSVFile<MagentoImageMapping>(filePath);

      for (const row of parsed) {
        addImage(imageMap, row.sku, row.image);
      }
      debug(`Parsed ${parsed.length} image mappings from ${file}`);
    }
  }

  // Parse image CSVs from ConfigurableSampleData
  const configFixtures = getFixturesPath(cacheDir, "ConfigurableSampleData");
  if (existsSync(configFixtures)) {
    const imageFiles = readdirSync(configFixtures).filter((f) =>
      f.startsWith("images") && f.endsWith(".csv"),
    );

    for (const file of imageFiles) {
      const filePath = join(configFixtures, file);
      const parsed = parseCSVFile<MagentoImageMapping>(filePath);

      for (const row of parsed) {
        addImage(imageMap, row.sku, row.image);
      }
      debug(`Parsed ${parsed.length} image mappings from ${file}`);
    }

    // Also extract images from the products.csv itself (base_image, additional_images columns)
    const productsFile = join(configFixtures, "products.csv");
    if (existsSync(productsFile)) {
      const count = extractImagesFromProductRows(productsFile, imageMap);
      debug(`Extracted ${count} inline images from ConfigurableSampleData/products.csv`);
    }
  }

  info(`Parsed image mappings for ${imageMap.size} products`);
  return imageMap;
}
