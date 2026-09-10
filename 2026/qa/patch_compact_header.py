from pathlib import Path

css_path = Path('2026/modern-ui.css')
css = css_path.read_text(encoding='utf-8')
marker = '/* RESPONSIVE COMPACT HEADER ------------------------------------------ */'
block = r'''

/* RESPONSIVE COMPACT HEADER ------------------------------------------ */
/* Full inline navigation is only used when it has enough room. */
@media (min-width: 1181px) {
  header .mobile-nav-toggle {
    display: none !important;
  }

  header .top-nav {
    display: flex !important;
    position: static;
  }
}

@media (max-width: 1180px) {
  header {
    flex-wrap: nowrap;
    min-height: 64px;
    overflow: visible;
  }

  header .header-left {
    flex: 1 1 auto;
    min-width: 0;
    flex-wrap: nowrap;
    gap: .7rem;
  }

  header .title {
    min-width: 0;
    white-space: nowrap;
  }

  header .mobile-nav-toggle {
    display: inline-flex !important;
    position: relative;
    z-index: 32;
    flex: 0 0 auto;
    margin-left: auto;
    cursor: pointer;
    pointer-events: auto;
    touch-action: manipulation;
  }

  header .mobile-nav-toggle[aria-expanded="true"] {
    color: #fff7db;
    border-color: rgba(251, 191, 36, .32);
    background: rgba(245, 158, 11, .14);
  }

  header .top-nav {
    display: none !important;
  }

  header .top-nav.open {
    display: grid !important;
    position: absolute;
    top: calc(100% + .45rem);
    left: .8rem;
    right: .8rem;
    width: auto;
    margin: 0;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: .35rem;
    padding: .45rem;
    border: 1px solid rgba(148, 163, 184, .18);
    border-radius: 1rem;
    background: rgba(7, 16, 31, .98);
    box-shadow: 0 22px 54px rgba(2, 6, 23, .52);
    backdrop-filter: blur(22px) saturate(145%);
    -webkit-backdrop-filter: blur(22px) saturate(145%);
    z-index: 31;
  }

  header .top-nav.open .nav-toggle {
    width: 100%;
    min-height: 44px;
    justify-content: flex-start;
    text-align: left;
    padding-inline: .82rem;
  }

  header .header-right {
    width: auto;
    flex: 0 0 auto;
    margin-left: auto;
    justify-content: flex-end;
    overflow: visible;
  }
}

@media (max-width: 700px) {
  header {
    gap: .42rem;
    padding: .55rem .62rem;
  }

  header .header-left {
    width: auto;
    flex: 1 1 auto;
    gap: .38rem;
  }

  header .title {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: .94rem;
  }

  header .header-right {
    width: auto;
    flex: 0 0 auto;
    margin-left: 0;
    padding: 0;
  }

  header #a8XpTop,
  header #coinTop {
    display: none !important;
  }

  header #a8ProgressBadge {
    min-height: 34px !important;
  }

  header .mobile-nav-toggle {
    min-height: 36px;
    padding-inline: .62rem;
  }

  header .top-nav.open {
    left: .5rem;
    right: .5rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
'''
if marker not in css:
    css += block
css_path.write_text(css, encoding='utf-8')

smoke_path = Path('2026/qa/browser-smoke.mjs')
smoke = smoke_path.read_text(encoding='utf-8')
anchor = '''  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  const mobileMenu = page.locator('#mobileNavToggle');
'''
replacement = '''  await page.setViewportSize({ width: 1280, height: 800 });
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('#mobileNavToggle').isVisible(), false, 'Desktop should use inline navigation, not the menu button');
  assert.ok(await page.locator('#topNav .nav-toggle').first().isVisible(), 'Desktop inline navigation should be visible');

  await page.setViewportSize({ width: 1024, height: 768 });
  await page.reload({ waitUntil: 'networkidle' });
  const tabletMenu = page.locator('#mobileNavToggle');
  assert.ok(await tabletMenu.isVisible(), 'Tablet/compact desktop should use the menu button');
  assert.equal(await page.locator('#topNav .nav-toggle').first().isVisible(), false, 'Compact header should keep inline navigation closed initially');
  const tabletHeaderOverflow = await page.evaluate(() => {
    const el = document.querySelector('header');
    return el ? el.scrollWidth - el.clientWidth : 0;
  });
  assert.ok(tabletHeaderOverflow <= 2, `Unexpected tablet header overflow: ${tabletHeaderOverflow}px`);
  await tabletMenu.click();
  assert.equal(await tabletMenu.getAttribute('aria-expanded'), 'true', 'Tablet menu should open');
  assert.ok(await page.locator('#topNav .nav-toggle').first().isVisible(), 'Tablet menu choices should be visible after opening');
  await tabletMenu.click();
  assert.equal(await tabletMenu.getAttribute('aria-expanded'), 'false', 'Tablet menu should close again');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  const mobileMenu = page.locator('#mobileNavToggle');
'''
if anchor not in smoke:
    raise SystemExit('mobile smoke anchor not found')
smoke = smoke.replace(anchor, replacement, 1)
smoke_path.write_text(smoke, encoding='utf-8')
