import { shopifyApiProject, ApiType } from "@shopify/api-codegen-preset";

export default {
  schema: "https://shopify.dev/admin-graphql-direct-proxy/2026-04",
  documents: ["./src/**/*.{ts,tsx}"],
  projects: {
    default: shopifyApiProject({
      apiType: ApiType.Admin,
      apiVersion: "2026-04",
      documents: ["./src/**/*.{ts,tsx}"],
      outputDir: "./src/types",
    }),
  },
};
