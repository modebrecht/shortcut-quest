from pathlib import Path

js_path = Path('2026/skill-hotkeys.js')
js = js_path.read_text(encoding='utf-8')
old_observer = '''      if (maxStage > previousMaxStage) {
        previousMaxStage = maxStage;
        showStage(maxStage, true);
        return;
      }
      showStage(activeStage, false);
'''
new_observer = '''      if (maxStage > previousMaxStage) {
        previousMaxStage = maxStage;
      }
      showStage(activeStage, false);
'''
if old_observer not in js:
    raise SystemExit('stage observer anchor not found')
js_path.write_text(js.replace(old_observer, new_observer, 1), encoding='utf-8')

smoke_path = Path('2026/qa/browser-smoke.mjs')
smoke = smoke_path.read_text(encoding='utf-8')
old_initial = "  assert.equal(await page.locator('.section-tab').count(), 10, 'Expected 10 initially available sections');\n"
new_initial = old_initial + '''  assert.equal(await page.locator('.section-stage-button').count(), 3, '30 sections should be represented as three navigation stages');
  assert.ok(await page.locator('.section-stage-button[data-stage="0"]').evaluate(el => el.classList.contains('active')), 'Stage 1-10 should be active initially');
  assert.equal(await page.locator('.section-stage-button[data-stage="1"]').isDisabled(), true, 'Stage 11-20 should start locked');
  assert.equal(await page.locator('.section-stage-button[data-stage="2"]').isDisabled(), true, 'Stage 21-30 should start locked');
'''
if old_initial not in smoke:
    raise SystemExit('initial smoke anchor not found')
smoke = smoke.replace(old_initial, new_initial, 1)

old_unlock = "  assert.equal(await page.locator('.section-tab').count(), 11, 'Section 11 tab should appear after first clear');\n\n  await page.locator('.section-tab[data-goto=\"10\"]').click();\n"
new_unlock = "  assert.equal(await page.locator('.section-tab').count(), 11, 'Section 11 tab should appear after first clear');\n  assert.equal(await page.locator('.section-stage-button[data-stage=\"1\"]').isDisabled(), false, 'Stage 11-20 should unlock when section 11 becomes available');\n  assert.equal(await page.locator('.section-tab[data-goto=\"11\"]').isVisible(), false, 'Section 11 stays hidden until its stage is opened');\n\n  await page.locator('.section-tab[data-goto=\"10\"]').click();\n"
if old_unlock not in smoke:
    raise SystemExit('unlock smoke anchor not found')
smoke = smoke.replace(old_unlock, new_unlock, 1)

old_section11 = "  await page.locator('.section-tab[data-goto=\"11\"]').click();\n  await solveSimpleSection('11');\n"
new_section11 = "  await page.locator('.section-stage-button[data-stage=\"1\"]').click();\n  assert.equal(await page.locator('.section-tab[data-goto=\"11\"]').isVisible(), true, 'Opening stage 11-20 should reveal section 11');\n  await page.locator('.section-tab[data-goto=\"11\"]').click();\n  await solveSimpleSection('11');\n"
if old_section11 not in smoke:
    raise SystemExit('section 11 smoke anchor not found')
smoke = smoke.replace(old_section11, new_section11, 1)

smoke_path.write_text(smoke, encoding='utf-8')
