import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { readFile } from 'node:fs/promises';

// Uses an existing Playwright installation; no application dependency is needed.
// node tests/homepage.browser.mjs <absolute-path-to-playwright/index.mjs>
const { chromium } = await import(process.argv[2] ? pathToFileURL(process.argv[2]).href : 'playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:3000';
const key = 'samobile.language.v1';
const locales = ['en', 'ko', 'vi', 'zh', 'th', 'ne', 'uz'];
function messagePaths(value, prefix = '') {
  if (value !== null && typeof value === 'object') return Object.entries(value).flatMap(([key, child]) => messagePaths(child, `${prefix}.${key}`)).sort();
  return [prefix];
}
const referenceMessages = JSON.parse(await readFile('messages/en.json', 'utf8'));
for (const locale of locales) {
  const raw = await readFile(`messages/${locale}.json`, 'utf8');
  const messages = JSON.parse(raw);
  assert.deepEqual(messagePaths(messages), messagePaths(referenceMessages), `Incomplete locale: ${locale}`);
  for (const match of raw.matchAll(/sa\s*mobile|\bkt\b/gi)) assert(['KT', 'SAmobile'].includes(match[0]), `${locale}: invalid brand ${match[0]}`);
  assert.doesNotMatch(raw, /Internet\s*\+\s*TV|\bTV\b|SAMOBILE|Samobile|SA Mobile/);
  assert.doesNotMatch(raw, /18[,.]?500|26[,.]?400|34[,.]?900|41[,.]?900|22[,.]?000|33[,.]?000/);
}
console.log('PASS complete locale schemas, invariant brand names, no duplicated prices');
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
  assert.equal(await page.locator('.language-option:disabled').count(), 0);
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

  for (const locale of locales) {
    await page.evaluate(({ key, locale }) => localStorage.setItem(key, locale), { key, locale });
    for (const width of [1440, 1024, 768, 430, 390, 375, 320]) {
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
      const number = value => new Intl.NumberFormat(locale).format(value);
      const prices = { 'mobile-a':18500, 'mobile-b':26400, 'mobile-c':34900, 'mobile-d':41900, 'internet-100':22000, 'internet-500':33000 };
      for (const [id, price] of Object.entries(prices)) {
        assert.equal(await page.locator(`#${id} .plan-price strong`).textContent(), new Intl.NumberFormat(locale, {style:'currency',currency:'KRW',currencyDisplay:'narrowSymbol',maximumFractionDigits:0}).format(price));
        assert.equal(await page.locator(`#${id} .plan-button`).getAttribute('href'), '#consultation');
      }
      for (const [id, data, speed, calls, sms] of [['a',`${number(7)} GB`,1,null,null],['b',`${number(15)} GB`,3,100,100],['c',`${number(11)} GB + ${number(2)} GB`,3,null,null],['d',`${number(5)} GB`,5,null,null]]) {
        assert((await page.locator(`#mobile-${id} .plan-main-spec strong`).textContent()).includes(data));
        const benefits = await page.locator(`#mobile-${id} dd`).allTextContents();
        assert(benefits[0].includes(`${number(speed)} Mbps`));
        const messages = JSON.parse(await (await import('node:fs/promises')).readFile(`messages/${locale}.json`, 'utf8'));
        assert.equal(benefits[1], calls === null ? messages.product.unlimited : `${number(calls)} ${messages.product.minutes}`);
        assert.equal(benefits[2], sms === null ? messages.product.unlimited : `${number(sms)} ${messages.product.messages}`);
        if (id === 'c' || id === 'd') assert((await page.locator(`#mobile-${id} .plan-main-spec strong`).textContent()).includes(messages.product.perDay));
      }
      for (const speed of [100,500]) {
        assert.equal(await page.locator(`#internet-${speed} h3`).textContent(), `${number(speed)} Mbps`);
        assert((await page.locator(`#internet-${speed} .plan-contract`).textContent()).includes(number(3)));
      }
      assert.equal(await page.locator('.telecom-logo').count(), 2);
      for (const logo of await page.locator('.telecom-logo').all()) {
        await logo.evaluate(img => img.decode());
        assert.equal(await logo.getAttribute('src'), '/brands/kt-logo.png');
        assert.equal(await logo.getAttribute('alt'), 'KT');
        assert(await logo.evaluate(img => Math.abs(img.getBoundingClientRect().width / img.getBoundingClientRect().height - img.naturalWidth / img.naturalHeight) < 0.01));
      }
      assert.equal(await page.locator('.service-shortcut').count(), 2);
      assert.equal(await page.locator('a[href="#tv"], #tv, .promotion-bundle, .footer-cobrand-separator, .brand-symbol').count(), 0);
      assert.equal(await page.locator('.brand-group').innerText(), '');
      assert.equal(await page.locator('.agency-wordmark').textContent(), 'SAmobile');
      assert.equal(await page.locator('.agency-wordmark > span').evaluate(el => getComputedStyle(el).color), 'rgb(207, 38, 53)');
      assert.doesNotMatch(await page.locator('body').innerText(), /\bTV\b|Internet\s*\+\s*TV|truy\u1ec1n h\u00ecnh|\ud2f0\ube44/i);
      assert(await page.locator('.footer-cobrand').evaluate(el => {
        const logo = el.querySelector('img').getBoundingClientRect();
        const word = el.querySelector('.agency-wordmark').getBoundingClientRect();
        return logo.height > word.height * 2 && Math.abs(word.bottom - logo.bottom - 8) <= 1 && word.left >= logo.right;
      }));
      assert.doesNotMatch(await page.locator('body').textContent(), /SAMOBILE|Samobile|SA Mobile|SA\uBAA8\uBC14\uC77C|KT\uBAA8\uBC14\uC77C/);
      const footerText = await page.locator('.footer-identity p').textContent();
      assert(footerText.includes('SAmobile') && footerText.includes('KT Corporation'));
      if (width <= 760) {
        await page.locator('.mobile-navigation summary').click();
        assert.equal(await page.locator('.mobile-navigation[open]').count(), 1);
        const menuOverflow = await page.locator('.mobile-navigation').evaluate(el => el.scrollWidth > el.clientWidth);
        assert.equal(menuOverflow, false);
        await page.locator('.mobile-navigation a[href="#internet"]').click();
        assert.equal(await page.locator('.mobile-navigation[open]').count(), 0);
        await page.locator('.mobile-navigation summary').click();
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.mobile-navigation[open]').count(), 0);
        await page.evaluate(() => scrollTo(0,0));
      }
      assert.equal(await page.locator('form').count(), 0);
      assert.equal(await page.locator('.contact-channel a').count(), 0);
      if (width === 1440 || width === 390) {
        await page.screenshot({ path: `.next/redesign-${locale}-${width}.png`, fullPage: true });
        await page.screenshot({ path: `.next/redesign-${locale}-${width}-top.png` });
        await page.locator('.site-footer').screenshot({ path: `.next/branding-footer-${locale}-${width}.png` });
      }
      console.log('PASS routes, image, links, overflow, placeholder channels:', locale, width);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.language-trigger').click();
  await page.screenshot({ path: '.next/redesign-language-mobile.png' });
  assert(await page.locator('.language-option[lang="uz"]').isVisible());
  await page.locator('.dialog-close').click();
  await page.locator('.shortcut-mobile').click();
  assert.equal(await page.evaluate(() => location.hash), '#mobile');
  await page.locator('#mobile-a .plan-button').click();
  assert.equal(await page.evaluate(() => location.hash), '#consultation');
  for (const path of ['/invalid']) assert.equal((await page.request.get(base + path)).status(), 404);
  assert.deepEqual(errors, []);

  // Each locale is both a direct route and an explicit persisted choice.
  for (const locale of locales) {
    await page.locator('.language-trigger').click();
    await page.locator(`.language-option[lang="${locale}"]`).click();
    await page.waitForURL(url => url.pathname === '/' + locale);
    assert.equal(await page.evaluate(k => localStorage.getItem(k), key), locale);
    await page.reload();
    assert.equal(await page.locator('dialog[open]').count(), 0);
    await page.goto(base + (locale === 'en' ? '/ko' : '/en'));
    await page.waitForURL(url => url.pathname === '/' + locale);
  }
  for (const locale of locales) {
    const fresh = await browser.newContext({viewport:{width:320,height:640}});
    const fp = await fresh.newPage();
    await fp.goto(base + '/' + locale);
    await fp.locator('dialog[open]').waitFor();
    assert.equal(await fp.locator('.language-option:disabled').count(), 0);
    assert.equal(await fp.locator('.language-option').count(), 7);
    const bounds = await fp.locator('dialog').boundingBox();
    assert(bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= 320 && bounds.y + bounds.height <= 640);
    await fp.locator('.language-option[lang="uz"]').click();
    await fp.waitForURL('**/uz');
    await fresh.close();
  }
  console.log('PASS all seven direct routes, switching, persistence, first-visit modal on small phones');

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
  assert.deepEqual(errors, []);
  console.log('PASS mobile dialog, plan shortcuts, consultation CTA, invalid locale, JS errors, blocked-storage fallback');
} finally {
  await browser.close();
}
