import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.TK2_BASE_URL || 'http://127.0.0.1:4173/2026/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const pageErrors = [];
const consoleErrors = [];

page.on('pageerror', error => pageErrors.push(String(error && error.stack ? error.stack : error)));
page.on('console', message => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});

async function unlockAllSections() {
  await page.evaluate(() => {
    const current = JSON.parse(localStorage.getItem('shortcutRitter_v1') || '{}');
    current.sectionsUnlocked = 30;
    current.sectionClears = current.sectionClears || {};
    current.sectionSubmissions = current.sectionSubmissions || {};
    localStorage.setItem('shortcutRitter_v1', JSON.stringify(current));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('.section-tab').length === 30);
}

async function activateSection(id) {
  const n = Number(id);
  const stage = Math.floor((n - 1) / 10);
  await page.locator(`.section-stage-button[data-stage="${stage}"]`).click();
  const tab = page.locator(`.section-tab[data-goto="${id}"]`);
  await tab.click();
  const section = page.locator(`.section[data-section="${id}"]`);
  await section.waitFor({ state: 'visible' });
  return section;
}

async function auditAllSections(label) {
  for (let i = 1; i <= 30; i += 1) {
    const id = String(i);
    const section = await activateSection(id);
    const text = (await section.innerText()).trim();

    assert.ok(text.length > 0, `${label} section ${id}: empty section`);
    assert.equal(/\bA[1-8]\b/.test(text), false, `${label} section ${id}: old worksheet label leaked into student UI`);
    assert.equal(/(^|\s)-[A-Za-zÄÖÜäöü]/m.test(text), false, `${label} section ${id}: dangling hyphen in visible copy`);
    assert.equal(/\b(?:undefined|null|NaN)\b/.test(text), false, `${label} section ${id}: broken placeholder/value in visible copy`);
    assert.equal(text.includes('💡'), false, `${label} section ${id}: emoji hint icon should not appear in modern learning UI`);

    const header = section.locator('.card-header');
    const body = section.locator('.card-body');
    assert.equal(await header.count(), 1, `${label} section ${id}: missing card header`);
    assert.equal(await body.count(), 1, `${label} section ${id}: missing card body`);

    const emptyButtons = await section.locator('button:visible').evaluateAll(buttons =>
      buttons.filter(button => !(button.textContent || '').trim() && !button.getAttribute('aria-label') && !button.getAttribute('title')).length
    );
    assert.equal(emptyButtons, 0, `${label} section ${id}: visible unlabeled button`);

    const hasFast = await section.locator('.fast-paced').count() > 0;
    if (hasFast) {
      assert.equal(await section.locator('.fast-paced-start').count(), 1, `${label} section ${id}: Fast-Paced start control missing`);
    } else {
      assert.equal(await section.locator('.check-section').count(), 1, `${label} section ${id}: check control missing`);
      assert.equal(await section.locator('.reset-section').count(), 1, `${label} section ${id}: reset control missing`);
    }

    const sectionOverflow = await section.evaluate(el => el.scrollWidth - el.clientWidth);
    assert.ok(sectionOverflow <= 2, `${label} section ${id}: horizontal section overflow ${sectionOverflow}px`);
    const pageOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert.ok(pageOverflow <= 2, `${label} section ${id}: horizontal page overflow ${pageOverflow}px`);
  }
}

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await unlockAllSections();

  await auditAllSections('desktop');

  const browserCopy = await page.evaluate(() => {
    const sections = Array.isArray(window.LEARN_SECTION_BLUEPRINTS) ? window.LEARN_SECTION_BLUEPRINTS : [];
    const s8 = sections.find(section => String(section?.id) === '8');
    const s23 = sections.find(section => String(section?.id) === '23');
    const dnd = s8?.tasks?.find(task => task?.type === 'dnd');
    const ctrlN8 = dnd?.targets?.find(target => target?.answer === 'Ctrl+N');
    const ctrlN23 = s23?.fastPaced?.combos?.find(entry => entry?.combo === 'Ctrl+N');
    return {
      section8CtrlNLabel: ctrlN8?.label || '',
      section23Description: s23?.description || '',
      section23CtrlNLabel: ctrlN23?.label || ''
    };
  });
  assert.equal(browserCopy.section8CtrlNLabel, 'Neues Browserfenster', 'Section 8 must teach Ctrl+N as a new browser window');
  assert.equal(browserCopy.section23CtrlNLabel, 'Neues Browserfenster', 'Section 23 must teach Ctrl+N as a new browser window');
  assert.match(browserCopy.section23Description, /Browser-Kürzel/i, 'Section 23 description should name Browser-Kürzel cleanly');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('.section-tab').length === 30);
  await auditAllSections('mobile-390');

  if (pageErrors.length) throw new Error(`Page errors:\n${pageErrors.join('\n')}`);
  if (consoleErrors.length) throw new Error(`Console errors:\n${consoleErrors.join('\n')}`);

  console.log('SECTION QUALITY E2E OK: all 30 sections activated on desktop + 390px mobile; copy, controls and overflow clean.');
} finally {
  await browser.close();
}
