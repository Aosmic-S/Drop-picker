import { logger } from "./logger.js";

interface RetryOptions {
  attempts?: number;
  baseDelayMs?: number;
  label?: string;
}

/** Retries an async function with exponential backoff. */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { attempts = 3, baseDelayMs = 1000, label = "operation" } = options;
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const isLast = attempt === attempts;
      logger.warn(`${label} failed (attempt ${attempt}/${attempts})`, {
        error: err instanceof Error ? err.message : String(err),
      });
      if (!isLast) {
        const delay = baseDelayMs * 2 ** (attempt - 1);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastError;
}
