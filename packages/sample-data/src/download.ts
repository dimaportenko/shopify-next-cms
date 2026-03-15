import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { simpleGit } from "simple-git";
import { info, success, warn } from "./utils/logger.js";

const REPO_URL = "https://github.com/dimaportenko/magento2-sample-data.git";
const BRANCH = "2.4-develop";

export function getCacheDir(): string {
  return join(process.cwd(), ".cache", "sample-data");
}

export async function downloadSampleData(force: boolean = false): Promise<string> {
  const cacheDir = getCacheDir();

  if (existsSync(cacheDir) && !force) {
    info("Using cached sample data. Use --force to re-download.");
    return cacheDir;
  }

  if (existsSync(cacheDir) && force) {
    warn("Force flag set — re-downloading sample data...");
    const { rmSync } = await import("node:fs");
    rmSync(cacheDir, { recursive: true, force: true });
  }

  info(`Cloning sample data from ${REPO_URL} (branch: ${BRANCH})...`);
  mkdirSync(cacheDir, { recursive: true });

  const git = simpleGit();
  await git.clone(REPO_URL, cacheDir, [
    "--branch",
    BRANCH,
    "--depth",
    "1",
    "--single-branch",
  ]);

  success("Sample data downloaded successfully.");
  return cacheDir;
}

export function getFixturesPath(cacheDir: string, module: string): string {
  return join(cacheDir, "app", "code", "Magento", module, "fixtures");
}

export function getMediaPath(cacheDir: string): string {
  return join(cacheDir, "pub", "media", "catalog", "product");
}
