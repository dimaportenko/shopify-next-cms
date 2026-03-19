import { debug } from "./logger.js";

const SHOPIFY_GRAPHQL_COST_THRESHOLD = 800;
const SHOPIFY_GRAPHQL_RESTORE_RATE = 50;

interface RateLimiterState {
  availablePoints: number;
  lastRequestTime: number;
}

const state: RateLimiterState = {
  availablePoints: 1000,
  lastRequestTime: Date.now(),
};

export function updateFromResponse(
  currentlyAvailable: number,
  maximumAvailable: number,
) {
  state.availablePoints = currentlyAvailable;
  debug(
    `Rate limit: ${currentlyAvailable}/${maximumAvailable} points available`,
  );
}

export async function throttle(): Promise<void> {
  const now = Date.now();
  const elapsed = (now - state.lastRequestTime) / 1000;
  state.availablePoints = Math.min(
    1000,
    state.availablePoints + elapsed * SHOPIFY_GRAPHQL_RESTORE_RATE,
  );
  state.lastRequestTime = now;

  if (state.availablePoints < SHOPIFY_GRAPHQL_COST_THRESHOLD) {
    const waitTime = Math.ceil(
      ((SHOPIFY_GRAPHQL_COST_THRESHOLD - state.availablePoints) /
        SHOPIFY_GRAPHQL_RESTORE_RATE) *
        1000,
    );
    debug(`Rate limit: waiting ${waitTime}ms`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    state.availablePoints = SHOPIFY_GRAPHQL_COST_THRESHOLD;
    state.lastRequestTime = Date.now();
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      const delay = Math.pow(2, attempt) * 1000;
      debug(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Unreachable");
}
