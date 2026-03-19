import { ApiType, shopifyApiProject } from "@shopify/api-codegen-preset";

const config = {
  schema: ["https://shopify.dev/admin-graphql-direct-proxy"],
  projects: {
    default: shopifyApiProject({
      apiType: ApiType.Admin,
      apiVersion: "2026-04",
      documents: ["./src/**/*.admin.{ts,tsx}"],
      outputDir: "./types",
    }),
  },
};

export default config;
