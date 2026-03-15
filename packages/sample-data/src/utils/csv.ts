import { parse } from "csv-parse/sync";
import { readFileSync } from "node:fs";

export function parseCSVFile<T extends object>(
  filePath: string,
): T[] {
  const content = readFileSync(filePath, "utf-8");
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as T[];
}
