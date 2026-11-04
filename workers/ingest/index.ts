// Cron-driven worker that fetches news feeds, has the model judge + translate them, and writes articles.
// It is separate from the public site on purpose: the model API key lives only here.
import { runIngest, type IngestEnv, type IngestSummary } from "../../lib/ingest/pipeline";

type Env = IngestEnv & { INGEST_RUN_TOKEN?: string };
type ScheduledController = { scheduledTime: number; cron: string };
type Ctx = { waitUntil(promise: Promise<unknown>): void };

async function safeRun(env: Env): Promise<IngestSummary> {
  try {
    const summary = await runIngest(env);
    console.log("ingest", JSON.stringify(summary)); // counts only: never log feed text or secrets
    return summary;
  } catch (e) {
    console.log("ingest crashed:", e instanceof Error ? e.message : String(e));
    return { status: "aborted", message: "unexpected error", sources: 0, considered: 0, published: 0, held: 0, skipped: 0, failed: 0 };
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder(); const x = enc.encode(a); const y = enc.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

const worker = {
  async scheduled(_event: ScheduledController, env: Env, ctx: Ctx): Promise<void> {
    ctx.waitUntil(safeRun(env));
  },
  // Manual trigger for testing: POST /run with `Authorization: Bearer <INGEST_RUN_TOKEN>`.
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/run") return new Response("Not found", { status: 404 });
    const token = env.INGEST_RUN_TOKEN;
    const given = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
    if (!token || token.length < 16 || !timingSafeEqual(given, token)) return new Response("Unauthorized", { status: 401 });
    return Response.json(await safeRun(env));
  },
};

export default worker;
