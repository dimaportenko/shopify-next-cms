import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { MagentoImageMapping } from "../types.js";
import { parseCSVFile } from "../utils/csv.js";
import { getFixturesPath } from "../download.js";
import { debug, info } from "../utils/logger.js";

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
        const images = imageMap.get(row.sku) ?? [];
        images.push(row.image);
        imageMap.set(row.sku, images);
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
        const images = imageMap.get(row.sku) ?? [];
        images.push(row.image);
        imageMap.set(row.sku, images);
      }
      debug(`Parsed ${parsed.length} image mappings from ${file}`);
    }
  }

  info(`Parsed image mappings for ${imageMap.size} products`);
  return imageMap;
}
