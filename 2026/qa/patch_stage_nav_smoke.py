from pathlib import Path

path = Path('2026/qa/browser-smoke.mjs')
text = path.read_text(encoding='utf-8')

replacements = {
'''  await page.locator('.section-tab[data-goto="4"]').click();
  await solveSimpleSection('4');
''': '''  await page.locator('.section-stage-button[data-stage="0"]').click();
  await page.locator('.section-tab[data-goto="4"]').click();
  await solveSimpleSection('4');
''',
'''  await page.locator('.nav-toggle[data-view="learn"]').click();
  await solveDndSection('6');
''': '''  await page.locator('.nav-toggle[data-view="learn"]').click();
  await page.locator('.section-stage-button[data-stage="0"]').click();
  await solveDndSection('6');
''',
'''  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.section-tab[data-goto="20"]').click();
''': '''  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.section-stage-button[data-stage="1"]').click();
  await page.locator('.section-tab[data-goto="20"]').click();
''',
'''  for (let i = 1; i <= 30; i += 1) {
    const id = String(i);
    await page.locator(`.section-tab[data-goto="${id}"]`).click();
''': '''  for (let i = 1; i <= 30; i += 1) {
    const id = String(i);
    if (i === 1 || i === 11 || i === 21) {
      await page.locator(`.section-stage-button[data-stage="${Math.floor((i - 1) / 10)}"]`).click();
    }
    await page.locator(`.section-tab[data-goto="${id}"]`).click();
'''
}

for old, new in replacements.items():
    if old not in text:
        raise SystemExit('smoke anchor not found: ' + old.splitlines()[0])
    text = text.replace(old, new, 1)

path.write_text(text, encoding='utf-8')
