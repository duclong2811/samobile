import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

// Uses an existing Playwright installation; no application dependency is needed.
// node tests/homepage.browser.mjs <absolute-path-to-playwright/index.mjs>
const { chromium } = await import(process.argv[2] ? pathToFileURL(process.argv[2]).href : 'playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:3000';
const key = 'samobile.language.v1';
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const root = await page.request.get(base + '/', { maxRedirects: 0 });
  assert.equal(root.status(), 307);
  assert.equal(root.headers().location, '/en');
  await page.goto(base + '/en');
  await page.locator('#language-dialog[open]').waitFor();
  assert.equal(await page.locator('.language-option').count(), 7);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog[open]').count(), 1);
  assert.equal(await page.locator('.dialog-close').isVisible(), false);
  assert.equal(await page.locator('.language-option:disabled').count(), 4);
  await page.screenshot({ path: '.next/redesign-language-desktop.png' });
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    assert(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)), 'Tab escaped modal');
  }
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Shift+Tab');
    assert(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)), 'Shift+Tab escaped modal');
  }
  await page.locator('.language-option[lang="vi"]').click();
  await page.waitForURL('**/vi');
  assert.equal(await page.evaluate(k => localStorage.getItem(k), key), 'vi');
  await page.reload();
  assert.equal(await page.locator('dialog[open]').count(), 0);
  await page.goto(base + '/en');
  await page.waitForURL('**/vi');
  await page.locator('.language-trigger').click();
  await page.locator('.language-option[lang="ko"]').click();
  await page.waitForURL('**/ko');
  assert.equal(await page.evaluate(k => localStorage.getItem(k), key), 'ko');
  await page.reload();
  assert.equal(await page.locator('dialog[open]').count(), 0);
  await page.locator('.language-trigger').click();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog[open]').count(), 0);
  assert.equal(await page.locator(':focus').getAttribute('class'), 'language-trigger');
  assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
  console.log('PASS first visit, seven options, keyboard trap, persisted preference, explicit switching, Escape and focus return');

  for (const locale of ['en', 'ko', 'vi']) {
    await page.evaluate(({ key, locale }) => localStorage.setItem(key, locale), { key, locale });
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(base + '/' + locale);
      assert.equal(response.status(), 200);
      await page.locator('.hero-media img').evaluate(img => img.decode());
      assert.equal(await page.locator('html').getAttribute('lang'), locale);
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('dialog[open]').count(), 0);
      const metrics = await page.evaluate(() => ({
        width: innerWidth, scroll: document.documentElement.scrollWidth,
        broken: [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => !document.getElementById(h.slice(1))),
      }));
      assert(metrics.scroll <= metrics.width, `${locale} ${width} overflow: ${JSON.stringify(metrics)}`);
      assert.deepEqual(metrics.broken, []);
      assert.equal(await page.locator('.plan-card').count(), 6);
      const prices = { 'mobile-a':18500, 'mobile-b':26400, 'mobile-c':34900, 'mobile-d':41900, 'internet-100':22000, 'internet-500':33000 };
      for (const [id, price] of Object.entries(prices)) {
        assert.equal(await page.locator(`#${id} .plan-price strong`).textContent(), new Intl.NumberFormat(locale, {style:'currency',currency:'KRW',currencyDisplay:'narrowSymbol',maximumFractionDigits:0}).format(price));
        assert.equal(await page.locator(`#${id} .plan-button`).getAttribute('href'), '#consultation');
      }
      for (const [id, data, speed, calls, sms] of [['a','7 GB',1,null,null],['b','15 GB',3,100,100],['c','11 GB + 2 GB',3,null,null],['d','5 GB',5,null,null]]) {
        assert((await page.locator(`#mobile-${id} .plan-main-spec strong`).textContent()).includes(data));
        const benefits = await page.locator(`#mobile-${id} dd`).allTextContents();
        assert(benefits[0].includes(`${speed} Mbps`));
        const messages = JSON.parse(await (await import('node:fs/promises')).readFile(`messages/${locale}.json`, 'utf8'));
        assert.equal(benefits[1], calls === null ? messages.product.unlimited : `${calls} ${messages.product.minutes}`);
        assert.equal(benefits[2], sms === null ? messages.product.unlimited : `${sms} ${messages.product.messages}`);
        if (id === 'c' || id === 'd') assert((await page.locator(`#mobile-${id} .plan-main-spec strong`).textContent()).includes(messages.product.perDay));
      }
      for (const speed of [100,500]) {
        assert.equal(await page.locator(`#internet-${speed} h3`).textContent(), `${speed} Mbps`);
        assert((await page.locator(`#internet-${speed} .plan-contract`).textContent()).includes('3'));
      }
      assert.equal(await page.locator('.masthead .telecom-logo-slot').textContent(), 'KT');
      assert.equal(await page.locator('form').count(), 0);
      assert.equal(await page.locator('.contact-channel a').count(), 0);
      if (width === 1440 || width === 390) {
        await page.screenshot({ path: `.next/redesign-${locale}-${width}.png`, fullPage: true });
        await page.screenshot({ path: `.next/redesign-${locale}-${width}-top.png` });
      }
      console.log('PASS routes, image, links, overflow, placeholder channels:', locale, width);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.language-trigger').click();
  await page.screenshot({ path: '.next/redesign-language-mobile.png' });
  assert(await page.locator('.language-option[lang="uz"]').isVisible());
  await page.locator('.dialog-close').click();
  await page.locator('.shortcut-sim').click();
  assert.equal(await page.evaluate(() => location.hash), '#sim');
  await page.locator('#mobile-a .plan-button').click();
  assert.equal(await page.evaluate(() => location.hash), '#consultation');
  for (const path of ['/zh', '/th', '/ne', '/uz', '/invalid']) assert.equal((await page.request.get(base + path)).status(), 404);
  assert.deepEqual(errors, []);

  const blocked = await browser.newContext();
  await blocked.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException('Blocked', 'SecurityError'); };
    Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'SecurityError'); };
  });
  const bp = await blocked.newPage();
  await bp.goto(base + '/en');
  await bp.locator('dialog[open]').waitFor();
  await bp.locator('.language-option[lang="en"]').click();
  assert.equal(await bp.locator('dialog[open]').count(), 0);
  console.log('PASS mobile dialog, plan shortcuts, consultation CTA, unsupported locales, JS errors, blocked-storage fallback');
} finally {
  await browser.close();
}
