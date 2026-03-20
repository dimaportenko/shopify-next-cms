import { ShopifyClient } from "./shopify-client.js";
import type { Migration, MetaobjectNode } from "./types.js";
import { info, success, warn, error as logError } from "./utils/logger.js";

const MIGRATION_STATE_TYPE = "cms_migration_state";
const MIGRATION_STATE_HANDLE = "default";

interface MigrationState {
  instanceId: string;
  applied: string[];
}

async function ensureMigrationState(
  client: ShopifyClient,
): Promise<MigrationState> {
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

  let instance = await client.getMetaobjectByHandle(
    MIGRATION_STATE_TYPE,
    MIGRATION_STATE_HANDLE,
  );

  if (!instance) {
    info("Creating migration state instance...");
    instance = await client.createMetaobject({
      type: MIGRATION_STATE_TYPE,
      handle: MIGRATION_STATE_HANDLE,
      fields: [
        { key: "applied_migrations", value: JSON.stringify([]) },
        { key: "last_run_at", value: new Date().toISOString() },
      ],
    });
  }

  return {
    instanceId: instance.id,
    applied: parseAppliedMigrations(instance),
  };
}

function parseAppliedMigrations(instance: MetaobjectNode): string[] {
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
  instanceId: string,
  applied: string[],
): Promise<void> {
  await client.updateMetaobject(instanceId, {
    fields: [
      { key: "applied_migrations", value: JSON.stringify(applied) },
      { key: "last_run_at", value: new Date().toISOString() },
    ],
  });
}

export async function runMigrations(
  client: ShopifyClient,
  migrations: Migration[],
  options: { dryRun?: boolean } = {},
): Promise<void> {
  const state = await ensureMigrationState(client);
  const { instanceId, applied } = state;
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
      applied.push(migration.id);
      await recordMigration(client, instanceId, applied);
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
  const state = await ensureMigrationState(client);
  const { applied } = state;
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
