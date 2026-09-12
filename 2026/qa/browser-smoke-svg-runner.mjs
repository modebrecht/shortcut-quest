import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const sourceUrl = new URL('./browser-smoke.mjs', import.meta.url);
const runtimeUrl = new URL('./.browser-smoke-svg-runtime.mjs', import.meta.url);
const sourcePath = fileURLToPath(sourceUrl);
const runtimePath = fileURLToPath(runtimeUrl);

let source = fs.readFileSync(sourcePath, 'utf8');

const oldBlock = `  const arenaAsset = await page.evaluate(() => new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = 'assets/arena-premium.jpg';
  }));
  assert.ok(arenaAsset && arenaAsset.width >= 700 && arenaAsset.height >= 300, 'Premium arena image asset must load at useful resolution');
  const previewArenaBackground = await page.locator('#battleStagePreview').evaluate(el => getComputedStyle(el).backgroundImage);
  assert.match(previewArenaBackground, /arena-premium\\.jpg/i, 'Arena preview must use the premium generated arena asset');
  assert.equal(/battle-bg-forest/i.test(previewArenaBackground), false, 'Arena preview must never use the forest background');`;

const newBlock = `  const arenaAssetResponse = await page.request.get(new URL('assets/arena-scene.svg', page.url()).href);
  assert.equal(arenaAssetResponse.ok(), true, 'Vector arena asset must load');
  const arenaSvg = await arenaAssetResponse.text();
  assert.ok(arenaSvg.length > 6000, 'Vector arena asset must contain a substantial illustrated scene');
  assert.match(arenaSvg, /Shortcut Quest battle arena/i, 'Vector arena must expose its accessible scene title');
  await page.addScriptTag({ url: new URL('arena-dev-fix.js', page.url()).href });
  await page.waitForFunction(() => document.getElementById('battleStagePreview')?.classList.contains('arena-svg-composed'));
  const previewArenaBackground = await page.locator('#battleStagePreview').evaluate(el => getComputedStyle(el).backgroundImage);
  assert.match(previewArenaBackground, /arena-scene\\.svg/i, 'Arena preview must use the vector arena scene');
  assert.equal(/battle-bg-forest/i.test(previewArenaBackground), false, 'Arena preview must never use the forest background');`;

const gotoAnchor = `try {\n  await page.goto(baseUrl, { waitUntil: 'networkidle' });`;
const routedGoto = `try {\n  await page.route('**/assets/arena-premium.jpg', async route => {\n    const svgResponse = await page.request.get(new URL('assets/arena-scene.svg', baseUrl).href);\n    await route.fulfill({ response: svgResponse });\n  });\n  await page.goto(baseUrl, { waitUntil: 'networkidle' });`;

if (!source.includes(oldBlock)) {
  throw new Error('browser-smoke arena assertion block changed; update browser-smoke-svg-runner.mjs instead of silently weakening the smoke test');
}
if (!source.includes(gotoAnchor)) {
  throw new Error('browser-smoke startup block changed; update browser-smoke-svg-runner.mjs instead of silently hiding console failures');
}

source = source.replace(gotoAnchor, routedGoto);
source = source.replace(oldBlock, newBlock);
fs.writeFileSync(runtimePath, source, 'utf8');

try {
  await import(runtimeUrl.href + `?run=${Date.now()}`);
} finally {
  fs.rmSync(runtimePath, { force: true });
}
