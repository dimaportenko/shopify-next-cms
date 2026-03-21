import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tailwindcss from "eslint-plugin-tailwindcss";

const __dirname = dirname(fileURLToPath(import.meta.url));

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tailwindcss.configs["flat/recommended"],
  {
    settings: {
      tailwindcss: {
        config: resolve(__dirname, "src/app/globals.css"),
      },
    },
    rules: {
      "tailwindcss/no-custom-classname": [
        "warn",
        { whitelist: ["text\\-destructive\\-foreground"] },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated GraphQL codegen types
    "types/**",
  ]),
]);

export default eslintConfig;
