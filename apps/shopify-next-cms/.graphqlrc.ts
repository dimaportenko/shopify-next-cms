import { ApiType, shopifyApiProject } from "@shopify/api-codegen-preset";

const config = {
  schema: ["https://shopify.dev/storefront-graphql-direct-proxy"],
  projects: {
    default: shopifyApiProject({
      apiType: ApiType.Storefront,
      apiVersion: "2026-04",
      documents: ["./src/**/*.storefront.{ts,tsx}"],
      outputDir: "./types",
    }),
  },
};

export default config;
