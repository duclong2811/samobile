import type { AppEnv, D1Database } from "./types";

// `cloudflare:workers` only exists inside the Workers runtime (vinext / wrangler). It is loaded lazily,
// at request time, so plain `next build` can still compile and collect pages that never touch it.
export async function getEnv(): Promise<AppEnv> {
  const { env } = await import("cloudflare:workers");
  return env;
}

export async function getDb(): Promise<D1Database> {
  const env = await getEnv();
  if (!env.DB) throw new Error("D1 binding `DB` is missing. Check wrangler.jsonc and run the migrations.");
  return env.DB;
}
