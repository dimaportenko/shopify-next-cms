import { ShopifyClient } from "./shopify-client.js";
import type { Migration } from "./types.js";
import { info, success, warn, error as logError } from "./utils/logger.js";

const MIGRATION_STATE_TYPE = "cms_migration_state";
const MIGRATION_STATE_HANDLE = "default";

async function ensureMigrationState(client: ShopifyClient): Promise<void> {
  const def = await client.getMetaobjectDefinition(MIGRATION_STATE_TYPE);

  if (!def) {
    info("Creating migration state metaobject definition...");
    await client.createMetaobjectDefinition({
      type: MIGRATION_STATE_TYPE,
      name: "CMS Migration State",
      fieldDefinitions: [
        {
          key: "applied_migrations",
          name: "Applied Migrations",
          type: "json",
        },
        {
          key: "last_run_at",
          name: "Last Run At",
          type: "single_line_text_field",
        },
      ],
    });
  }

  const instance = await client.getMetaobjectByHandle(
    MIGRATION_STATE_TYPE,
    MIGRATION_STATE_HANDLE,
  );

  if (!instance) {
    info("Creating migration state instance...");
    await client.createMetaobject({
      type: MIGRATION_STATE_TYPE,
      handle: MIGRATION_STATE_HANDLE,
      fields: [
        { key: "applied_migrations", value: JSON.stringify([]) },
        { key: "last_run_at", value: new Date().toISOString() },
      ],
    });
  }
}

async function getAppliedMigrations(client: ShopifyClient): Promise<string[]> {
  const instance = await client.getMetaobjectByHandle(
    MIGRATION_STATE_TYPE,
    MIGRATION_STATE_HANDLE,
  );

  if (!instance) return [];

  const field = instance.fields.find((f) => f.key === "applied_migrations");
  if (!field?.value) return [];

  try {
    return JSON.parse(field.value) as string[];
  } catch {
    return [];
  }
}

async function recordMigration(
  client: ShopifyClient,
  migrationId: string,
  applied: string[],
): Promise<void> {
  const instance = await client.getMetaobjectByHandle(
    MIGRATION_STATE_TYPE,
    MIGRATION_STATE_HANDLE,
  );

  if (!instance) {
    throw new Error("Migration state instance not found");
  }

  const updated = [...applied, migrationId];

  await client.updateMetaobject(instance.id, {
    fields: [
      { key: "applied_migrations", value: JSON.stringify(updated) },
      { key: "last_run_at", value: new Date().toISOString() },
    ],
  });
}

export async function runMigrations(
  client: ShopifyClient,
  migrations: Migration[],
  options: { dryRun?: boolean } = {},
): Promise<void> {
  await ensureMigrationState(client);

  const applied = await getAppliedMigrations(client);
  const sorted = [...migrations].sort((a, b) => a.id.localeCompare(b.id));
  const pending = sorted.filter((m) => !applied.includes(m.id));

  if (pending.length === 0) {
    success("All migrations are up-to-date");
    return;
  }

  info(`${pending.length} pending migration(s) to run`);

  for (const migration of pending) {
    info(`Running: ${migration.id} — ${migration.description}`);

    if (options.dryRun) {
      info(`  [dry-run] Would execute: ${migration.id}`);
      continue;
    }

    try {
      await migration.up(client);
      await recordMigration(client, migration.id, applied);
      applied.push(migration.id);
      success(`Completed: ${migration.id}`);
    } catch (err) {
      logError(
        `Failed: ${migration.id} — ${err instanceof Error ? err.message : String(err)}`,
      );
      throw err;
    }
  }

  if (options.dryRun) {
    info(`[dry-run] ${pending.length} migration(s) would be applied`);
  } else {
    success(`${pending.length} migration(s) applied successfully`);
  }
}

export async function getMigrationStatus(
  client: ShopifyClient,
  migrations: Migration[],
): Promise<void> {
  await ensureMigrationState(client);

  const applied = await getAppliedMigrations(client);
  const sorted = [...migrations].sort((a, b) => a.id.localeCompare(b.id));

  info(`Migration status (${applied.length} applied, ${sorted.length} total):`);

  for (const migration of sorted) {
    const status = applied.includes(migration.id) ? "✓" : "○";
    info(`  ${status} ${migration.id} — ${migration.description}`);
  }

  const pending = sorted.filter((m) => !applied.includes(m.id));
  if (pending.length > 0) {
    warn(`${pending.length} pending migration(s)`);
  } else {
    success("All migrations are up-to-date");
  }
}
