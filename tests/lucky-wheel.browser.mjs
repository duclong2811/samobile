import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const { chromium } = await import(process.argv[2] ? pathToFileURL(process.argv[2]).href : "playwright");
const base = process.env.BASE_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ headless: true });

try {
  for (const locale of ["vi", "en", "ko"]) {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.addInitScript((selectedLocale) => localStorage.setItem("samobile.language.v1", selectedLocale), locale);
      await page.goto(`${base}/${locale}/lucky-wheel`, { waitUntil: "networkidle" });
      assert.equal(await page.locator("#language-dialog").getAttribute("open"), null, "language dialog unexpectedly blocked the game");
      assert.equal(await page.locator(".lucky-wheel-label").count(), 10);
      const metrics = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
      assert(metrics.scrollWidth <= metrics.width, `${locale} ${viewport.width}px horizontal overflow`);
      await page.locator(".lucky-wheel-spin").click();
      await page.waitForTimeout(150);
      assert.equal(
        await page.locator(".lucky-wheel-spin").isDisabled(),
        true,
        `spin did not start: button=${await page.locator(".lucky-wheel-spin").textContent()} errors=${errors.join(" | ")}`,
      );
      await page.locator(".lucky-wheel-spin:not(:disabled)").waitFor({ timeout: 7000 });
      assert(await page.locator(".lucky-wheel-result strong").isVisible());
      assert.deepEqual(errors, []);
      if (locale === "vi") await page.screenshot({ path: `.next/lucky-wheel-${viewport.width}.png`, fullPage: true });
      await page.close();
    }
  }
  const homepage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await homepage.addInitScript(() => localStorage.setItem("samobile.language.v1", "vi"));
  await homepage.goto(`${base}/vi`, { waitUntil: "networkidle" });
  assert.equal(await homepage.locator(".home-lucky-wheel a").getAttribute("href"), "/vi/lucky-wheel");
  await homepage.locator(".home-lucky-wheel a").click();
  await homepage.waitForURL(`${base}/vi/lucky-wheel`);
  await homepage.close();
  console.log("PASS lucky wheel desktop/mobile render, spin result, overflow and client errors");
} finally {
  await browser.close();
}
