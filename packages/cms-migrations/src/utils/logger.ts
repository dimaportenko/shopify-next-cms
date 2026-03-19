let verbose = false;

export function setVerbose(v: boolean) {
  verbose = v;
}

export function info(message: string) {
  console.log(`[cms-migrations] ${message}`);
}

export function success(message: string) {
  console.log(`[cms-migrations] ✓ ${message}`);
}

export function warn(message: string) {
  console.warn(`[cms-migrations] ⚠ ${message}`);
}

export function error(message: string) {
  console.error(`[cms-migrations] ✗ ${message}`);
}

export function debug(message: string) {
  if (verbose) {
    console.log(`[cms-migrations] [debug] ${message}`);
  }
}
