import { existsSync } from "node:fs";
import { join } from "node:path";
import type { MagentoCategory } from "../types.js";
import { parseCSVFile } from "../utils/csv.js";
import { getFixturesPath } from "../download.js";
import { debug, info } from "../utils/logger.js";

export function parseCategories(cacheDir: string): MagentoCategory[] {
  const categories: MagentoCategory[] = [];

  const modules = ["CatalogSampleData", "ConfigurableSampleData"];

  for (const module of modules) {
    const fixturesPath = getFixturesPath(cacheDir, module);
    const categoriesFile = join(fixturesPath, "categories.csv");

    if (!existsSync(categoriesFile)) {
      debug(`No categories file found at ${categoriesFile}`);
      continue;
    }

    const parsed = parseCSVFile<MagentoCategory>(categoriesFile);
    categories.push(...parsed);
    debug(`Parsed ${parsed.length} categories from ${module}`);
  }

  info(`Parsed ${categories.length} total categories`);
  return categories;
}
