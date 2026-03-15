let verbose = false;

export function setVerbose(v: boolean) {
  verbose = v;
}

export function info(message: string) {
  console.log(`[sample-data] ${message}`);
}

export function success(message: string) {
  console.log(`[sample-data] ✓ ${message}`);
}

export function warn(message: string) {
  console.warn(`[sample-data] ⚠ ${message}`);
}

export function error(message: string) {
  console.error(`[sample-data] ✗ ${message}`);
}

export function debug(message: string) {
  if (verbose) {
    console.log(`[sample-data] [debug] ${message}`);
  }
}

export function progress(current: number, total: number, label: string) {
  info(`[${current}/${total}] ${label}`);
}
