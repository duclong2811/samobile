// Shared by the web app and the ingest worker; keep this file dependency-free.
export const articleCategories = ["general", "visa", "labor", "tax", "health", "life"] as const;
export type ArticleCategory = (typeof articleCategories)[number];
/** Categories where a wrong translation can harm readers; auto-publishing holds these by default. */
export const sensitiveCategories: readonly ArticleCategory[] = ["visa", "labor", "tax", "health"];
