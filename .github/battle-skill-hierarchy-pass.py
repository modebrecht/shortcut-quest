from pathlib import Path

css_path = Path('2026/modern-battle.css')
css = css_path.read_text(encoding='utf-8')
marker = '/* BATTLE SKILL CONTENT HIERARCHY FIX 2026 */'
if marker not in css:
    css += r'''

/* BATTLE SKILL CONTENT HIERARCHY FIX 2026 */
#battleView .battle-skill {
  display: block !important;
  min-height: 138px !important;
  height: auto !important;
  max-height: none !important;
}

#battleView .battle-skill button,
#battleView .skill-cast-btn {
  min-height: 138px !important;
  height: auto !important;
  max-height: none !important;
  padding: .72rem .78rem .7rem !important;
  display: grid !important;
  grid-template-columns: 46px minmax(0, 1fr) auto !important;
  grid-template-rows: auto auto minmax(0, 1fr) !important;
  column-gap: .62rem !important;
  row-gap: .3rem !important;
  align-items: start !important;
  text-align: left !important;
}

#battleView .battle-skill-icon {
  grid-column: 1 !important;
  grid-row: 1 / 4 !important;
  align-self: center !important;
  width: 46px !important;
  height: 46px !important;
  margin: 0 !important;
}

#battleView .battle-skill-name {
  grid-column: 2 !important;
  grid-row: 1 !important;
  align-self: center !important;
  min-width: 0 !important;
  max-width: none !important;
  min-height: 1.05rem;
  margin: 0 !important;
  color: #f8fafc !important;
  font-size: .9rem !important;
  font-weight: 900 !important;
  line-height: 1.15 !important;
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: clip !important;
  word-break: normal !important;
  overflow-wrap: anywhere;
}

#battleView .battle-skill-hotkey {
  grid-column: 3 !important;
  grid-row: 1 !important;
  align-self: center !important;
  justify-self: end !important;
}

#battleView .battle-skill-combo {
  grid-column: 2 / 4 !important;
  grid-row: 2 !important;
  align-self: start !important;
  justify-self: stretch !important;
  margin: 0 !important;
  min-height: 25px;
}

#battleView .battle-skill-desc {
  position: static !important;
  grid-column: 2 / 4 !important;
  grid-row: 3 !important;
  align-self: start !important;
  min-width: 0 !important;
  min-height: 0 !important;
  height: auto !important;
  max-height: none !important;
  margin: 0 !important;
  padding: .08rem 4.15rem 0 0 !important;
  border: 0 !important;
  background: transparent !important;
  color: #cbd5e1 !important;
  font-size: .69rem !important;
  font-weight: 650 !important;
  line-height: 1.3 !important;
  display: block !important;
  overflow: visible !important;
}

#battleView .battle-skill::after {
  right: .72rem !important;
  bottom: .68rem !important;
  padding: .18rem .36rem;
  border-radius: 999px;
  background: rgba(15,23,42,.56);
}

@media (max-width: 1050px) {
  #battleView .battle-skill,
  #battleView .battle-skill button,
  #battleView .skill-cast-btn {
    min-height: 132px !important;
  }
}

@media (max-width: 620px) {
  #battleView .battle-skill,
  #battleView .battle-skill button,
  #battleView .skill-cast-btn {
    min-height: 124px !important;
  }
  #battleView .battle-skill button,
  #battleView .skill-cast-btn {
    grid-template-columns: 42px minmax(0, 1fr) auto !important;
    padding: .64rem .68rem !important;
    column-gap: .52rem !important;
  }
  #battleView .battle-skill-icon {
    width: 42px !important;
    height: 42px !important;
  }
  #battleView .battle-skill-name { font-size: .86rem !important; }
  #battleView .battle-skill-desc {
    padding-right: 3.9rem !important;
    font-size: .67rem !important;
  }
}
'''
    css_path.write_text(css, encoding='utf-8')

index_path = Path('2026/index.html')
html = index_path.read_text(encoding='utf-8')

if "      heal: '<svg" not in html:
    anchor = "      helm: '<svg"
    if anchor not in html:
        raise SystemExit('ITEM_ART helm anchor not found')
    icons = """      heal: '<svg viewBox=\"0 0 32 32\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"16\" cy=\"16\" r=\"12\" fill=\"rgba(34,197,94,.15)\" stroke=\"#4ade80\" stroke-width=\"1.6\"></circle><path d=\"M14 9h4v5h5v4h-5v5h-4v-5H9v-4h5z\" fill=\"#bbf7d0\"></path></svg>',\n      lightning: '<svg viewBox=\"0 0 32 32\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M18.5 3 8 17h7l-1.5 12L24 14h-7z\" fill=\"#facc15\" stroke=\"#f59e0b\" stroke-width=\"1.4\" stroke-linejoin=\"round\"></path></svg>',\n      target: '<svg viewBox=\"0 0 32 32\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"16\" cy=\"16\" r=\"11\" fill=\"rgba(248,113,113,.08)\" stroke=\"#fb7185\" stroke-width=\"1.7\"></circle><circle cx=\"16\" cy=\"16\" r=\"6\" fill=\"none\" stroke=\"#fda4af\" stroke-width=\"1.5\"></circle><circle cx=\"16\" cy=\"16\" r=\"2.4\" fill=\"#fecdd3\"></circle><path d=\"M16 2v5M16 25v5M2 16h5M25 16h5\" stroke=\"#fb7185\" stroke-width=\"1.5\" stroke-linecap=\"round\"></path></svg>',\n"""
    html = html.replace(anchor, icons + anchor, 1)

index_path.write_text(html, encoding='utf-8')
