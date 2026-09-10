from pathlib import Path
p = Path('2026/qa/browser-smoke.mjs')
s = p.read_text(encoding='utf-8')
old = "  assert.match((await page.locator('#learnView .nav-card > .small').textContent()) || '', /Richtig = \\+5 XP/);\n"
new = "  assert.match((await page.locator('#learnView > .section-reward-hint').textContent()) || '', /\\+5 XP pro richtige Antwort/);\n"
if old not in s:
    raise SystemExit('old reward-hint smoke anchor not found')
p.write_text(s.replace(old, new, 1), encoding='utf-8')
