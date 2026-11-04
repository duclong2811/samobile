import assert from "node:assert/strict";
import { verifyAccessJwt, resetKeyCache } from "../lib/admin/access-jwt.ts";

const DOMAIN = "team.cloudflareaccess.com", AUD = "aud-123", NOW = 1_800_000_000_000;
const b64u = (buf) => Buffer.from(buf).toString("base64url");
const json = (o) => b64u(JSON.stringify(o));

const pair = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
const other = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
const publicJwk = { ...(await crypto.subtle.exportKey("jwk", pair.publicKey)), kid: "k1", alg: "RS256" };

let fetches = 0;
const fetchImpl = async () => { fetches++; return { ok: true, json: async () => ({ keys: [publicJwk] }) }; };

async function sign(payload, { key = pair.privateKey, header = { alg: "RS256", kid: "k1" } } = {}) {
  const signing = `${json(header)}.${json(payload)}`;
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(signing));
  return `${signing}.${b64u(sig)}`;
}
const good = { aud: [AUD], iss: `https://${DOMAIN}`, exp: NOW / 1000 + 600, email: "owner@example.com" };
const verify = (token, extra = {}) => verifyAccessJwt(token, extra.domain ?? DOMAIN, extra.aud ?? AUD, { fetchImpl, nowMs: NOW });

const cases = [
  ["accepts a valid token", async () => assert.equal((await verify(await sign(good)))?.email, "owner@example.com")],
  ["accepts aud given as a string", async () => assert.ok(await verify(await sign({ ...good, aud: AUD })))],
  ["rejects wrong audience", async () => assert.equal(await verify(await sign({ ...good, aud: ["other"] })), null)],
  ["rejects wrong issuer", async () => assert.equal(await verify(await sign({ ...good, iss: "https://evil.cloudflareaccess.com" })), null)],
  ["rejects expired token", async () => assert.equal(await verify(await sign({ ...good, exp: NOW / 1000 - 1 })), null)],
  ["rejects token without exp", async () => { const rest = { ...good }; delete rest.exp; assert.equal(await verify(await sign(rest)), null); }],
  ["rejects not-yet-valid token", async () => assert.equal(await verify(await sign({ ...good, nbf: NOW / 1000 + 3600 })), null)],
  ["rejects signature from a different key", async () => assert.equal(await verify(await sign(good, { key: other.privateKey })), null)],
  ["rejects tampered payload (email swap)", async () => {
    const [h, , s] = (await sign(good)).split("."); assert.equal(await verify(`${h}.${json({ ...good, email: "attacker@evil.com" })}.${s}`), null);
  }],
  ["rejects alg=none", async () => assert.equal(await verify(`${json({ alg: "none", kid: "k1" })}.${json(good)}.`), null)],
  ["rejects HS256 key-confusion", async () => assert.equal(await verify(`${json({ alg: "HS256", kid: "k1" })}.${json(good)}.${b64u("x")}`), null)],
  ["rejects unknown kid", async () => assert.equal(await verify(await sign(good, { header: { alg: "RS256", kid: "nope" } })), null)],
  ["rejects malformed tokens", async () => { for (const t of ["", "a.b", "a.b.c.d", "!!.!!.!!"]) assert.equal(await verify(t), null); }],
  ["rejects a non-Cloudflare team domain (SSRF guard)", async () => assert.equal(await verify(await sign(good), { domain: "evil.example.com" }), null)],
  ["forged kids cannot trigger repeated key fetches", async () => {
    resetKeyCache(); fetches = 0;
    for (let i = 0; i < 5; i++) await verify(await sign(good, { header: { alg: "RS256", kid: `bad${i}` } }));
    assert.ok(fetches <= 2, `expected <=2 fetches, got ${fetches}`);
  }],
];

let failed = 0;
for (const [name, fn] of cases) {
  resetKeyCache();
  try { await fn(); console.log("PASS", name); } catch (e) { failed++; console.log("FAIL", name, "-", e.message); }
}
if (failed) process.exit(1);
console.log(`${cases.length} Access JWT checks passed`);
