from pathlib import Path

# 1) Runtime JS: move XP + Coins into the compact navigation and remove the XP emoji source.
skill_path = Path('2026/skill-hotkeys.js')
skill = skill_path.read_text(encoding='utf-8')

skill = skill.replace('    badge.textContent = `⚡ XP: ${getSharedXP()}`;\n', '    badge.textContent = `XP: ${getSharedXP()}`;\n')

marker = '  function installCompactHeaderStats() {'
if marker not in skill:
    anchor = '    render2026Progress(global.__shortcutQuest2026InitialState || {});\n    const installAfterRuntime = () => queueMicrotask(() => {\n'
    if anchor not in skill:
        raise SystemExit('compact header JS insertion anchor missing')
    fn = '''    render2026Progress(global.__shortcutQuest2026InitialState || {});\n\n  function installCompactHeaderStats() {\n    if (typeof document === "undefined" || global.__shortcutQuestCompactHeaderStatsInstalled) return;\n    const header = document.querySelector("header");\n    const topNav = document.getElementById("topNav");\n    const headerRight = header && header.querySelector(".header-right");\n    if (!header || !topNav || !headerRight) return;\n\n    const compactQuery = typeof global.matchMedia === "function"\n      ? global.matchMedia("(max-width: 1180px)")\n      : null;\n\n    const sync = () => {\n      const compact = compactQuery ? compactQuery.matches : Number(global.innerWidth || 0) <= 1180;\n      if (compact) {\n        if (headerRight.parentElement !== topNav) topNav.appendChild(headerRight);\n      } else if (headerRight.parentElement !== header) {\n        header.appendChild(headerRight);\n      }\n    };\n\n    sync();\n    if (compactQuery) {\n      if (typeof compactQuery.addEventListener === "function") compactQuery.addEventListener("change", sync);\n      else if (typeof compactQuery.addListener === "function") compactQuery.addListener(sync);\n    } else {\n      global.addEventListener("resize", sync);\n    }\n    global.__shortcutQuestCompactHeaderStatsInstalled = true;\n  }\n\n    const installAfterRuntime = () => queueMicrotask(() => {\n'''
    skill = skill.replace(anchor, fn, 1)

call_anchor = '      install2026EconomyOverrides();\n      install2026Interactions();\n      install2026SectionStageNav();\n'
if call_anchor not in skill:
    raise SystemExit('compact header install call anchor missing')
if '      installCompactHeaderStats();\n' not in skill:
    skill = skill.replace(call_anchor, call_anchor + '      installCompactHeaderStats();\n', 1)

skill_path.write_text(skill, encoding='utf-8')

# 2) Header resize breakpoint in legacy runtime must match the compact breakpoint.
index_path = Path('2026/index.html')
raw = index_path.read_bytes()
old = b'if (window.innerWidth > 720) {'
new = b'if (window.innerWidth > 1180) {'
if old in raw:
    raw = raw.replace(old, new, 1)
elif new not in raw:
    raise SystemExit('legacy resize breakpoint anchor missing')
index_path.write_bytes(raw)

# 3) CSS: remove the old first-letter hack and make stats a footer row inside the opened menu.
css_path = Path('2026/modern-ui.css')
css = css_path.read_text(encoding='utf-8')
css = css.replace('''header #a8XpTop::first-letter {\n  font-size: 0;\n}\n\n''', '')

css_marker = '/* COMPACT HEADER STATS LIVE INSIDE MENU ------------------------------ */'
if css_marker not in css:
    css += '''\n\n/* COMPACT HEADER STATS LIVE INSIDE MENU ------------------------------ */\n@media (max-width: 1180px) {\n  /* Before JS relocates the stats, never let them occupy the compact header row. */\n  header > .header-right {\n    display: none !important;\n  }\n\n  /* Once relocated, the stats become the footer row of the opened menu. */\n  header .top-nav .header-right {\n    display: flex !important;\n    grid-column: 1 / -1;\n    width: 100% !important;\n    flex: 0 0 auto;\n    align-items: center;\n    justify-content: flex-start;\n    flex-wrap: wrap;\n    gap: .42rem;\n    margin: .1rem 0 0 !important;\n    padding: .52rem .36rem .08rem !important;\n    border-top: 1px solid rgba(148, 163, 184, .14);\n    overflow: visible;\n  }\n\n  header .top-nav .header-right #a8XpTop,\n  header .top-nav .header-right #coinTop {\n    display: inline-flex !important;\n    width: auto !important;\n    min-height: 32px !important;\n    margin: 0 !important;\n  }\n}\n'''
css_path.write_text(css, encoding='utf-8')

# 4) Browser smoke: guard the exact regression at 1024 px and update emoji-free XP text.
smoke_path = Path('2026/qa/browser-smoke.mjs')
smoke = smoke_path.read_text(encoding='utf-8')
smoke = smoke.replace("assert.equal((await page.locator('#a8XpTop').textContent())?.trim(), '⚡ XP: 60');", "assert.equal((await page.locator('#a8XpTop').textContent())?.trim(), 'XP: 60');")

old_block = '''  const tabletMenu = page.locator('#mobileNavToggle');\n  assert.ok(await tabletMenu.isVisible(), 'Tablet/compact desktop should use the menu button');\n  assert.equal(await page.locator('#topNav .nav-toggle').first().isVisible(), false, 'Compact header should keep inline navigation closed initially');\n  const tabletHeaderOverflow = await page.evaluate(() => {\n'''
new_block = '''  const tabletMenu = page.locator('#mobileNavToggle');\n  assert.ok(await tabletMenu.isVisible(), 'Tablet/compact desktop should use the menu button');\n  assert.equal(await page.locator('#topNav .nav-toggle').first().isVisible(), false, 'Compact header should keep inline navigation closed initially');\n  assert.equal(await page.locator('header > .header-right').count(), 0, 'Compact header stats must be moved out of the top header row');\n  assert.equal(await page.locator('#a8XpTop').isVisible(), false, 'XP must stay hidden while the compact menu is closed');\n  assert.equal(await page.locator('#coinTop').isVisible(), false, 'Coins must stay hidden while the compact menu is closed');\n  const tabletHeaderOverflow = await page.evaluate(() => {\n'''
if old_block not in smoke and new_block not in smoke:
    raise SystemExit('tablet smoke insertion anchor missing')
if old_block in smoke:
    smoke = smoke.replace(old_block, new_block, 1)

old_open = '''  await tabletMenu.click();\n  assert.equal(await tabletMenu.getAttribute('aria-expanded'), 'true', 'Tablet menu should open');\n  assert.ok(await page.locator('#topNav .nav-toggle').first().isVisible(), 'Tablet menu choices should be visible after opening');\n  await tabletMenu.click();\n'''
new_open = '''  await tabletMenu.click();\n  assert.equal(await tabletMenu.getAttribute('aria-expanded'), 'true', 'Tablet menu should open');\n  assert.ok(await page.locator('#topNav .nav-toggle').first().isVisible(), 'Tablet menu choices should be visible after opening');\n  assert.ok(await page.locator('#topNav .header-right #a8XpTop').isVisible(), 'XP should appear inside the opened compact menu');\n  assert.ok(await page.locator('#topNav .header-right #coinTop').isVisible(), 'Coins should appear inside the opened compact menu');\n  await tabletMenu.click();\n'''
if old_open not in smoke and new_open not in smoke:
    raise SystemExit('tablet smoke open-menu anchor missing')
if old_open in smoke:
    smoke = smoke.replace(old_open, new_open, 1)

smoke_path.write_text(smoke, encoding='utf-8')

print('patched compact header stats into menu')
