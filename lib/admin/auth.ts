import { headers } from "next/headers";
import { getEnv } from "@/lib/db/client";
import { TEAM_DOMAIN, verifyAccessJwt } from "./access-jwt";

export type AdminUser = { email: string };

/**
 * Returns the signed-in admin, or null. Fails closed: with no Cloudflare Access configuration
 * and no explicit local-development identity, nobody is an admin.
 * Called by every admin page AND every Server Action — Server Actions are reachable by direct POST.
 */
export async function getAdmin(): Promise<AdminUser | null> {
  const env = await getEnv();
  const requestHeaders = await headers();
  const domain = env.CF_ACCESS_TEAM_DOMAIN?.trim().toLowerCase();
  const aud = env.CF_ACCESS_AUD?.trim();

  if (domain && aud) {
    if (!TEAM_DOMAIN.test(domain)) return null;
    const token = requestHeaders.get("cf-access-jwt-assertion");
    if (!token) return null;
    try {
      const payload = await verifyAccessJwt(token, domain, aud);
      const email = payload?.email?.toLowerCase();
      if (!email) return null;
      const allow = env.ADMIN_EMAILS?.split(",").map((value) => value.trim().toLowerCase()).filter(Boolean) ?? [];
      if (allow.length > 0 && !allow.includes(email)) return null;
      return { email };
    } catch { return null; }
  }

  // Local development only: honoured when Access is NOT configured and the request is to localhost.
  const host = (requestHeaders.get("host") ?? "").split(":")[0];
  if (env.ADMIN_DEV_EMAIL && (host === "localhost" || host === "127.0.0.1")) return { email: env.ADMIN_DEV_EMAIL };
  return null;
}

export class UnauthorizedError extends Error { constructor() { super("Unauthorized"); } }

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) throw new UnauthorizedError();
  return admin;
}
