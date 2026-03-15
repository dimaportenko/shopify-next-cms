import type { MagentoCategory, ShopifyCollectionInput } from "../types.js";
import { debug, info } from "../utils/logger.js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildCollectionTitle(category: MagentoCategory): string {
  const pathParts = category.path
    ? category.path.split("/").filter(Boolean)
    : [];
  // If path has parent info, create "Parent - Child" naming
  if (pathParts.length > 0) {
    return [...pathParts, category.name].join(" - ");
  }
  return category.name;
}

export function transformCategoriesToCollections(
  categories: MagentoCategory[],
): ShopifyCollectionInput[] {
  const collections: ShopifyCollectionInput[] = [];
  const seenHandles = new Set<string>();

  for (const category of categories) {
    if (category.active === "0") {
      debug(`Skipping inactive category: ${category.name}`);
      continue;
    }

    const title = buildCollectionTitle(category);
    const handle = slugify(title);

    if (seenHandles.has(handle)) {
      debug(`Skipping duplicate collection handle: ${handle}`);
      continue;
    }
    seenHandles.add(handle);

    collections.push({
      title,
      handle,
      descriptionHtml: `<p>Products in the ${category.name} category.</p>`,
    });
  }

  info(`Transformed ${collections.length} collections`);
  return collections;
}

export function buildCollectionMembership(
  categories: MagentoCategory[],
): Map<string, Set<string>> {
  // category name → handle mapping for product assignment
  const nameToHandle = new Map<string, string>();
  for (const cat of categories) {
    const title = buildCollectionTitle(cat);
    nameToHandle.set(cat.name, slugify(title));
  }
  return new Map(
    [...nameToHandle.entries()].map(([name, handle]) => [
      name,
      new Set([handle]),
    ]),
  );
}
