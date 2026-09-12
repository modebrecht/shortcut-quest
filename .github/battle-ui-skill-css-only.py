from pathlib import Path

css_path = Path('2026/modern-battle.css')
css = css_path.read_text(encoding='utf-8')
marker = '/* BATTLE UI SKILL CARD FIT FIX 2026 */'
if marker in css:
    raise SystemExit(0)

block = r'''

/* BATTLE UI SKILL CARD FIT FIX 2026 */
#battleView .battle-skill {
  height: auto !important;
  max-height: none !important;
  min-height: 132px !important;
  grid-template-rows: auto auto !important;
  overflow: hidden !important;
  box-sizing: border-box;
}

#battleView .battle-skill button,
#battleView .skill-cast-btn {
  height: auto !important;
  max-height: none !important;
  box-sizing: border-box;
}

#battleView .battle-skill-desc {
  height: auto !important;
  max-height: none !important;
  min-height: 44px !important;
  box-sizing: border-box;
  padding-right: 4.9rem !important;
  overflow: visible !important;
}

@media (max-width: 620px) {
  #battleView .battle-skill {
    height: auto !important;
    max-height: none !important;
    min-height: 118px !important;
  }
  #battleView .battle-skill-desc {
    min-height: 40px !important;
    padding-right: 4.5rem !important;
  }
}
'''
css_path.write_text(css.rstrip() + block + '\n', encoding='utf-8')
