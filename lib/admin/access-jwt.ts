// Pure verification of Cloudflare Access JWTs (no Next.js imports, so it can be unit-tested in Node).
type Jwk = JsonWebKey & { kid?: string };
export type AccessPayload = { aud?: string | string[]; iss?: string; exp?: number; nbf?: number; email?: string };
export type FetchLike = (url: string) => Promise<{ ok: boolean; json(): Promise<unknown> }>;

export const TEAM_DOMAIN = /^[a-z0-9-]+\.cloudflareaccess\.com$/;
let cache: { domain: string; keys: Jwk[]; fetchedAt: number } | null = null;
export function resetKeyCache() { cache = null; }

function b64urlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const bin = atob(b64);
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
const decodeJson = <T,>(value: string): T => JSON.parse(new TextDecoder().decode(b64urlToBytes(value))) as T;

async function getKeys(domain: string, forceRefresh: boolean, fetchImpl: FetchLike, now: number): Promise<Jwk[]> {
  const same = cache && cache.domain === domain;
  if (same && now - cache!.fetchedAt < 10 * 60_000 && !forceRefresh) return cache!.keys;
  // Rate-limit forced refreshes so a forged `kid` cannot make every request hit the network.
  if (same && forceRefresh && now - cache!.fetchedAt < 60_000) return cache!.keys;
  const response = await fetchImpl(`https://${domain}/cdn-cgi/access/certs`);
  if (!response.ok) throw new Error("Cannot load Cloudflare Access signing keys.");
  const { keys } = (await response.json()) as { keys: Jwk[] };
  cache = { domain, keys, fetchedAt: now };
  return keys;
}

export async function verifyAccessJwt(
  token: string, domain: string, aud: string,
  opts: { fetchImpl?: FetchLike; nowMs?: number } = {},
): Promise<AccessPayload | null> {
  const fetchImpl: FetchLike = opts.fetchImpl ?? ((url) => fetch(url));
  const nowMs = opts.nowMs ?? Date.now();
  if (!TEAM_DOMAIN.test(domain)) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  let header: { alg?: string; kid?: string };
  let payload: AccessPayload;
  try { header = decodeJson(h); payload = decodeJson(p); } catch { return null; }
  if (header.alg !== "RS256" || !header.kid) return null; // rejects alg=none / HS256 confusion

  let keys = await getKeys(domain, false, fetchImpl, nowMs);
  let jwk = keys.find((key) => key.kid === header.kid);
  if (!jwk) { keys = await getKeys(domain, true, fetchImpl, nowMs); jwk = keys.find((key) => key.kid === header.kid); }
  if (!jwk) return null;

  let valid = false;
  try {
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64urlToBytes(s), new TextEncoder().encode(`${h}.${p}`));
  } catch { return null; }
  if (!valid) return null;

  const now = Math.floor(nowMs / 1000);
  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!audiences.includes(aud)) return null;
  if (payload.iss !== `https://${domain}`) return null;
  if (typeof payload.exp !== "number" || payload.exp <= now) return null;
  if (typeof payload.nbf === "number" && payload.nbf > now + 60) return null;
  return payload;
}
