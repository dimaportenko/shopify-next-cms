import type { Migration } from "../types.js";
import { info } from "../utils/logger.js";

export const migration: Migration = {
  id: "0001_create_cms_page",
  description: "Create cms_page metaobject definition",

  up: async (client) => {
    const existing = await client.getMetaobjectDefinition("cms_page");
    if (existing) {
      info("cms_page definition already exists, skipping");
      return;
    }

    await client.createMetaobjectDefinition({
      type: "cms_page",
      name: "CMS Page",
      fieldDefinitions: [
        { key: "title", name: "Title", type: "single_line_text_field" },
        { key: "slug", name: "Slug", type: "single_line_text_field" },
        { key: "puck_data", name: "Puck Data", type: "json" },
        { key: "status", name: "Status", type: "single_line_text_field" },
        {
          key: "updated_at",
          name: "Updated At",
          type: "single_line_text_field",
        },
      ],
      access: { storefront: "READ" },
    });
  },

  down: async (client) => {
    await client.deleteMetaobjectDefinition("cms_page");
  },
};
