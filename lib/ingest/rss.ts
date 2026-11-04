// Tolerant RSS 2.0 / Atom reader. No DOM and no dependencies, so it runs in Workers and in Node tests.
// It reads only what the feed itself publishes (title, link, description) — never the article page.
export type FeedItem = { key: string; title: string; link: string; description: string; publishedAt: string | null };

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body: string) => {
    if (body[0] === "#") {
      const code = body[1].toLowerCase() === "x" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : "";
    }
    return ENTITIES[body.toLowerCase()] ?? match;
  });
}

function cleanText(raw: string): string {
  const cdata = raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  // Decode once, strip any markup the feed embedded, then collapse whitespace.
  return decodeEntities(cdata).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function tag(block: string, name: string): string | null {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return match ? match[1] : null;
}

function atomLink(block: string): string | null {
  const links = [...block.matchAll(/<link\b([^>]*)\/?>/gi)].map((m) => m[1]);
  const preferred = links.find((attrs) => /rel\s*=\s*["']alternate["']/i.test(attrs)) ?? links.find((attrs) => !/rel\s*=/i.test(attrs)) ?? links[0];
  const href = preferred?.match(/href\s*=\s*["']([^"']+)["']/i);
  return href ? decodeEntities(href[1]) : null;
}

function safeUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(decodeEntities(value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")).trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch { return null; }
}

function toIso(value: string | null): string | null {
  if (!value) return null;
  const time = Date.parse(cleanText(value));
  return Number.isNaN(time) ? null : new Date(time).toISOString();
}

export function parseFeed(xml: string, maxItems = 30): FeedItem[] {
  const blocks = [...xml.matchAll(/<(item|entry)\b[\s\S]*?<\/\1>/gi)].map((m) => m[0]).slice(0, maxItems);
  const items: FeedItem[] = [];
  for (const block of blocks) {
    const isAtom = /^<entry/i.test(block);
    const title = cleanText(tag(block, "title") ?? "");
    const link = safeUrl(isAtom ? atomLink(block) : tag(block, "link")) ?? safeUrl(tag(block, "guid"));
    if (!title || !link) continue;
    const description = cleanText(tag(block, "description") ?? tag(block, "summary") ?? tag(block, "content:encoded") ?? tag(block, "content") ?? "");
    const guid = cleanText(tag(block, isAtom ? "id" : "guid") ?? "");
    items.push({
      key: (guid || link).slice(0, 500),
      title: title.slice(0, 300),
      link,
      description: description.slice(0, 2000),
      publishedAt: toIso(tag(block, "pubDate") ?? tag(block, "published") ?? tag(block, "updated") ?? tag(block, "dc:date")),
    });
  }
  return items;
}
