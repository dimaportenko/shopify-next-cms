#!/usr/bin/env node

import { Command } from "commander";
import { ShopifyClient, getConfig } from "./shopify-client.js";
import { runMigrations, getMigrationStatus } from "./runner.js";
import { setVerbose, error } from "./utils/logger.js";
import type { Migration } from "./types.js";

// --- Register all migrations ---
import { migration as m0001 } from "./migrations/0001_create_cms_page.js";

const allMigrations: Migration[] = [m0001];

// --- CLI ---

const program = new Command();

program
  .name("cms-migrations")
  .description("Manage Shopify metaobject schema migrations for CMS")
  .option("-v, --verbose", "Enable verbose logging", false);

program
  .command("run")
  .description("Run all pending migrations")
  .option("--dry-run", "Preview changes without applying", false)
  .action(async (options) => {
    const parentOpts = program.opts();
    setVerbose(parentOpts.verbose);

    try {
      const config = getConfig();
      const client = new ShopifyClient(config);
      await runMigrations(client, allMigrations, {
        dryRun: options.dryRun,
      });
    } catch (err) {
      error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

program
  .command("status")
  .description("Show migration status")
  .action(async () => {
    const parentOpts = program.opts();
    setVerbose(parentOpts.verbose);

    try {
      const config = getConfig();
      const client = new ShopifyClient(config);
      await getMigrationStatus(client, allMigrations);
    } catch (err) {
      error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

program.parse();
