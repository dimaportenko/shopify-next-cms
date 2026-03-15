import type {
  MagentoSimpleProduct,
  MagentoConfigurableProduct,
  ShopifyProductInput,
  ShopifyVariantInput,
  ShopifyImageInput,
} from "../types.js";
import type { ProductStatus } from "../types/admin.types.js";
import { debug, info } from "../utils/logger.js";

const GITHUB_RAW_BASE =
  "https://raw.githubusercontent.com/dimaportenko/magento2-sample-data/2.4-develop/pub/media/catalog/product";

function parseAdditionalAttributes(
  attrString?: string,
): Record<string, string> {
  if (!attrString) return {};
  const attrs: Record<string, string> = {};
  // Format: "key1=value1,key2=value2" or "key1=value1,key2=value2"
  const pairs = attrString.split(",");
  for (const pair of pairs) {
    const eqIndex = pair.indexOf("=");
    if (eqIndex === -1) continue;
    const key = pair.slice(0, eqIndex).trim();
    const value = pair.slice(eqIndex + 1).trim();
    if (key && value) {
      attrs[key] = value;
    }
  }
  return attrs;
}

function extractTags(attrs: Record<string, string>): string[] {
  const tags: string[] = [];
  const tagKeys = [
    "activity",
    "material",
    "style_bags",
    "style_general",
    "pattern",
    "climate",
    "gender",
    "category_gear",
  ];
  for (const key of tagKeys) {
    if (attrs[key]) {
      const values = attrs[key].split(",").map((v) => v.trim());
      for (const val of values) {
        tags.push(`${key}:${val}`);
      }
    }
  }
  return tags;
}

function buildImageUrl(imagePath: string): string {
  // Image paths are like "/m/b/mb01-blue-0.jpg" — prepend GitHub raw URL
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${GITHUB_RAW_BASE}${cleanPath}`;
}

export function transformSimpleProduct(
  product: MagentoSimpleProduct,
  imageMap: Map<string, string[]>,
): ShopifyProductInput {
  const attrs = parseAdditionalAttributes(product.additional_attributes);
  const tags = extractTags(attrs);

  if (product.category) {
    tags.push(
      ...product.category
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    );
  }

  const images: ShopifyImageInput[] = [];
  const productImages = imageMap.get(product.sku) ?? [];
  for (const img of productImages) {
    images.push({
      src: buildImageUrl(img),
      altText: product.name,
    });
  }

  return {
    title: product.name,
    descriptionHtml: product.description || product.short_description || "",
    vendor: "Sample Data",
    productType: attrs["category_gear"] ?? "General",
    tags,
    status: "ACTIVE" as ProductStatus,
    options: [],
    variants: [
      {
        sku: product.sku,
        price: product.price,
        inventoryQuantity: parseInt(product.qty, 10) || 100,
        options: [],
      },
    ],
    images,
  };
}

interface VariationPart {
  sku: string;
  options: Record<string, string>;
}

function parseConfigurableVariations(variationsStr?: string): VariationPart[] {
  if (!variationsStr) return [];

  // Format: "sku=SKU1,size=S,color=Blue|sku=SKU2,size=M,color=Blue|..."
  const variations: VariationPart[] = [];
  const variantGroups = variationsStr.split("|");

  for (const group of variantGroups) {
    const parts = group.split(",");
    const variation: VariationPart = { sku: "", options: {} };

    for (const part of parts) {
      const eqIndex = part.indexOf("=");
      if (eqIndex === -1) continue;
      const key = part.slice(0, eqIndex).trim();
      const value = part.slice(eqIndex + 1).trim();

      if (key === "sku") {
        variation.sku = value;
      } else {
        variation.options[key] = value;
      }
    }

    if (variation.sku) {
      variations.push(variation);
    }
  }

  return variations;
}

export function transformConfigurableProduct(
  product: MagentoConfigurableProduct,
  imageMap: Map<string, string[]>,
): ShopifyProductInput {
  const attrs = parseAdditionalAttributes(product.additional_attributes);
  const tags = extractTags(attrs);

  if (product.categories) {
    tags.push(
      ...product.categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    );
  }

  const variations = parseConfigurableVariations(
    product.configurable_variations,
  );

  // Determine option names from variations
  const optionNames = new Set<string>();
  for (const v of variations) {
    for (const key of Object.keys(v.options)) {
      optionNames.add(key);
    }
  }
  const options = [...optionNames];

  // Build variants with per-variant images
  const variants: ShopifyVariantInput[] = variations.map((v) => {
    const variantImages = imageMap.get(v.sku) ?? [];
    const imageSrc = variantImages[0] ? buildImageUrl(variantImages[0]) : undefined;
    return {
      sku: v.sku,
      price: product.price,
      inventoryQuantity: 100,
      options: options.map((opt) => v.options[opt] ?? ""),
      imageSrc,
    };
  });

  // If no variants parsed, create a default one
  if (variants.length === 0) {
    variants.push({
      sku: product.sku,
      price: product.price,
      inventoryQuantity: 100,
      options: [],
    });
  }

  // Collect images from all variant SKUs and parent
  const images: ShopifyImageInput[] = [];
  const seenImages = new Set<string>();

  const allSkus = [product.sku, ...variations.map((v) => v.sku)];
  for (const sku of allSkus) {
    const productImages = imageMap.get(sku) ?? [];
    for (const img of productImages) {
      const url = buildImageUrl(img);
      if (!seenImages.has(url)) {
        seenImages.add(url);
        images.push({ src: url, altText: product.name });
      }
    }
  }

  return {
    title: product.name,
    descriptionHtml: product.description || product.short_description || "",
    vendor: "Sample Data",
    productType: attrs["category_gear"] ?? "General",
    tags,
    status: "ACTIVE" as ProductStatus,
    options,
    variants,
    images,
  };
}

// Match trailing measurement like "55 cm", "6 foot", "10 inch", "32"
const SIZE_SUFFIX_RE = /\s+(\d+(?:\.\d+)?(?:\s*(?:cm|mm|m|foot|feet|ft|inch|in|liter|l|oz|lb|kg|g))?)\s*$/i;

function extractBaseName(name: string): string {
  return name.replace(SIZE_SUFFIX_RE, "").trim();
}

function extractSize(name: string): string | null {
  const match = name.match(SIZE_SUFFIX_RE);
  return match ? match[1] : null;
}

function extractColorFromSku(sku: string): string | null {
  // Extract trailing alpha suffix, e.g. "24-WG081-gray" → "gray"
  const match = sku.match(/-([a-z]+)$/i);
  return match ? match[1] : null;
}

function groupSimpleProducts(
  simpleProducts: MagentoSimpleProduct[],
  imageMap: Map<string, string[]>,
): ShopifyProductInput[] {
  // Step 1: group by base name (strip trailing size measurements)
  const byBaseName = new Map<string, MagentoSimpleProduct[]>();
  for (const product of simpleProducts) {
    const baseName = extractBaseName(product.name);
    const group = byBaseName.get(baseName) ?? [];
    group.push(product);
    byBaseName.set(baseName, group);
  }

  const results: ShopifyProductInput[] = [];
  for (const [baseName, group] of byBaseName) {
    if (group.length === 1) {
      results.push(transformSimpleProduct(group[0], imageMap));
      continue;
    }

    // Detect which dimensions vary across the group
    const sizes = new Set(group.map((p) => extractSize(p.name)).filter(Boolean));
    const colors = new Set(group.map((p) => extractColorFromSku(p.sku)).filter(Boolean));
    const hasSize = sizes.size > 1;
    const hasColor = colors.size > 1;

    if (!hasSize && !hasColor) {
      // No detectable variant axes — just use name grouping with SKU suffix
      const names = new Set(group.map((p) => p.name));
      if (names.size === group.length) {
        // All different names, treat as individual products
        for (const p of group) {
          results.push(transformSimpleProduct(p, imageMap));
        }
        continue;
      }
    }

    // Build option names and variant option values
    const optionNames: string[] = [];
    if (hasSize) optionNames.push("Size");
    if (hasColor) optionNames.push("Color");
    // Fallback: if same name but no detected axes, use SKU suffix
    if (optionNames.length === 0) optionNames.push("Variant");

    const first = group[0];
    const attrs = parseAdditionalAttributes(first.additional_attributes);
    const tags = extractTags(attrs);
    if (first.category) {
      tags.push(
        ...first.category.split(",").map((c) => c.trim()).filter(Boolean),
      );
    }

    const images: ShopifyImageInput[] = [];
    const seenImages = new Set<string>();
    for (const p of group) {
      for (const img of imageMap.get(p.sku) ?? []) {
        const url = buildImageUrl(img);
        if (!seenImages.has(url)) {
          seenImages.add(url);
          images.push({ src: url, altText: baseName });
        }
      }
    }

    const variants: ShopifyVariantInput[] = group.map((p) => {
      const opts: string[] = [];
      if (hasSize) opts.push(extractSize(p.name) ?? "Default");
      if (hasColor) opts.push(extractColorFromSku(p.sku) ?? "Default");
      if (opts.length === 0) opts.push(extractColorFromSku(p.sku) ?? p.sku);
      return {
        sku: p.sku,
        price: p.price,
        inventoryQuantity: parseInt(p.qty, 10) || 100,
        options: opts,
      };
    });

    debug(`Grouped ${group.length} simple products as variants of "${baseName}" (options: ${optionNames.join(", ")})`);

    results.push({
      title: baseName,
      descriptionHtml: first.description || first.short_description || "",
      vendor: "Sample Data",
      productType: attrs["category_gear"] ?? "General",
      tags,
      status: "ACTIVE" as ProductStatus,
      options: optionNames,
      variants,
      images,
    });
  }

  return results;
}

export function transformAllProducts(
  simple: MagentoSimpleProduct[],
  configurable: MagentoConfigurableProduct[],
  imageMap: Map<string, string[]>,
): ShopifyProductInput[] {
  const products: ShopifyProductInput[] = [];

  // Track SKUs that are children of configurable products to avoid duplicates
  const childSkus = new Set<string>();
  for (const config of configurable) {
    const variations = parseConfigurableVariations(
      config.configurable_variations,
    );
    for (const v of variations) {
      childSkus.add(v.sku);
    }
  }

  const standaloneSimple = simple.filter((p) => {
    if (childSkus.has(p.sku)) {
      debug(`Skipping child variant as standalone: ${p.sku}`);
      return false;
    }
    return true;
  });

  products.push(...groupSimpleProducts(standaloneSimple, imageMap));

  for (const product of configurable) {
    products.push(transformConfigurableProduct(product, imageMap));
  }

  info(`Transformed ${products.length} products`);
  return products;
}

export function buildProductCollectionMap(
  simple: MagentoSimpleProduct[],
  configurable: MagentoConfigurableProduct[],
): Map<string, string[]> {
  // SKU → category names
  const map = new Map<string, string[]>();

  for (const p of simple) {
    if (p.category) {
      map.set(
        p.sku,
        p.category
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      );
    }
  }

  for (const p of configurable) {
    if (p.categories) {
      map.set(
        p.sku,
        p.categories
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      );
    }
  }

  return map;
}
