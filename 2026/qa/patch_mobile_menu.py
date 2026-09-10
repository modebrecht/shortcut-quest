from pathlib import Path

css_path = Path('2026/modern-ui.css')
css = css_path.read_text(encoding='utf-8')

old = '''header .mobile-nav-toggle {
  display: inline-flex;
  align-items: center;
  gap: .38rem;
  font-size: 0 !important;
}
'''
new = '''header .mobile-nav-toggle {
  display: none;
  align-items: center;
  gap: .38rem;
  font-size: 0 !important;
  position: relative;
  z-index: 40;
  cursor: pointer;
  pointer-events: auto;
  touch-action: manipulation;
}

@media (max-width: 720px) {
  header .mobile-nav-toggle {
    display: inline-flex;
  }

  header .top-nav:not(.open) {
    display: none;
  }

  header .top-nav.open {
    display: grid;
  }
}
'''
if old not in css:
    raise SystemExit('mobile menu css anchor not found')
css_path.write_text(css.replace(old, new, 1), encoding='utf-8')

smoke_path = Path('2026/qa/browser-smoke.mjs')
smoke = smoke_path.read_text(encoding='utf-8')
old_smoke = '''  assert.ok(await page.locator('#mobileNavToggle').isVisible(), 'Mobile navigation toggle should be visible');
  assert.equal(await page.locator('#learnSections select:visible').count(), 0, 'No dropdown should be visible on mobile while a non-Combo section is active');
'''
new_smoke = '''  const mobileMenu = page.locator('#mobileNavToggle');
  assert.ok(await mobileMenu.isVisible(), 'Mobile navigation toggle should be visible');
  assert.equal(await mobileMenu.getAttribute('aria-expanded'), 'false', 'Mobile menu should start closed');
  await mobileMenu.click();
  assert.equal(await mobileMenu.getAttribute('aria-expanded'), 'true', 'Mobile menu button should open the navigation');
  assert.ok(await page.locator('#topNav').evaluate(el => el.classList.contains('open')), 'Mobile navigation should receive the open state');
  assert.ok(await page.locator('#topNav .nav-toggle').first().isVisible(), 'Mobile navigation choices should be visible after opening');
  await mobileMenu.click();
  assert.equal(await mobileMenu.getAttribute('aria-expanded'), 'false', 'Mobile menu button should close the navigation again');
  assert.equal(await page.locator('#learnSections select:visible').count(), 0, 'No dropdown should be visible on mobile while a non-Combo section is active');
'''
if old_smoke not in smoke:
    raise SystemExit('mobile smoke anchor not found')
smoke_path.write_text(smoke.replace(old_smoke, new_smoke, 1), encoding='utf-8')
