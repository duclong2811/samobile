// Minimal structural types for the Cloudflare D1 binding, so the app needs no extra type package.
export interface D1Result<T = unknown> { results: T[]; success: boolean; meta: Record<string, unknown> }
export interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<D1Result>;
}
export interface D1Database {
  prepare(query: string): D1Statement;
  batch(statements: D1Statement[]): Promise<D1Result[]>;
}
/** Bindings and variables declared in wrangler.jsonc / .dev.vars. */
export interface AppEnv {
  DB: D1Database;
  /** Cloudflare Access team domain, e.g. "myteam.cloudflareaccess.com". */
  CF_ACCESS_TEAM_DOMAIN?: string;
  /** Cloudflare Access application AUD tag. */
  CF_ACCESS_AUD?: string;
  /** Optional comma-separated allow-list, checked in addition to the Access policy. */
  ADMIN_EMAILS?: string;
  /** Local development only (.dev.vars). Ignored whenever Access is configured. */
  ADMIN_DEV_EMAIL?: string;
}
