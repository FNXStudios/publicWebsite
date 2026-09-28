import { z } from 'zod';

/**
 * Validates a configuration module at import time. Invalid content throws with a
 * readable report, which fails `next build`, `pnpm validate:config` and the tests.
 */
export function parseConfig<S extends z.ZodType>(name: string, schema: S, data: unknown): z.output<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid ${name} configuration:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
