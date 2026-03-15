import type { MagentoCategory, ShopifyCollectionInput } from "../types.js";
import { debug, info } from "../utils/logger.js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildCollectionHandle(category: MagentoCategory): string {
  const pathParts = category.path
    ? category.path.split("/").filter(Boolean)
    : [];
  if (pathParts.length > 0) {
    return slugify([...pathParts, category.name].join(" - "));
  }
  return slugify(category.name);
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

    const handle = buildCollectionHandle(category);

    if (seenHandles.has(handle)) {
      debug(`Skipping duplicate collection handle: ${handle}`);
      continue;
    }
    seenHandles.add(handle);

    collections.push({
      title: category.name,
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
    nameToHandle.set(cat.name, buildCollectionHandle(cat));
  }
  return new Map(
    [...nameToHandle.entries()].map(([name, handle]) => [
      name,
      new Set([handle]),
    ]),
  );
}
