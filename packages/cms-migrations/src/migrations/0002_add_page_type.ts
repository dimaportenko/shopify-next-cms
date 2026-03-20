import type { Migration } from "../types.js";
import { info } from "../utils/logger.js";

export const migration: Migration = {
  id: "0002_add_page_type",
  description: "Add page_type field to cms_page and backfill existing pages",

  up: async (client) => {
    const def = await client.getMetaobjectDefinition("cms_page");
    if (!def) {
      throw new Error("cms_page definition not found — run 0001 first");
    }

    const hasField = def.fieldDefinitions.some((f) => f.key === "page_type");
    if (!hasField) {
      info("Adding page_type field to cms_page definition...");
      await client.updateMetaobjectDefinition(def.id, {
        fieldDefinitions: [
          {
            create: {
              key: "page_type",
              name: "Page Type",
              type: "single_line_text_field",
            },
          },
        ],
      });
    } else {
      info("page_type field already exists, skipping definition update");
    }

    info("Backfilling existing pages with default page_type...");
    const pages = await client.listAllMetaobjects("cms_page");
    let backfilled = 0;

    for (const page of pages) {
      const pageType = page.fields.find((f) => f.key === "page_type")?.value;
      if (!pageType) {
        await client.updateMetaobject(page.id, {
          fields: [{ key: "page_type", value: "general" }],
        });
        backfilled++;
      }
    }

    if (backfilled > 0) {
      info(`Backfilled ${backfilled} page(s) with page_type "general"`);
    }
  },
};
