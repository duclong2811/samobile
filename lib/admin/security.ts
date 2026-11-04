import { headers } from "next/headers";

/** Rejects cross-site POSTs (CSRF). Run in every Server Action, before any write. */
export async function assertSameOrigin(): Promise<void> {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!origin || !host) throw new Error("Blocked: missing origin.");
  let originHost: string;
  try { originHost = new URL(origin).host; } catch { throw new Error("Blocked: invalid origin."); }
  if (originHost !== host) throw new Error("Blocked: cross-origin request.");
}
