from pathlib import Path

css_path = Path('2026/modern-battle.css')
css = css_path.read_text(encoding='utf-8')
marker = '/* BATTLE UI SKILL BAR PREMIUM PASS 2026 */'
if marker in css:
    raise SystemExit(0)

block = r'''

/* BATTLE UI SKILL BAR PREMIUM PASS 2026 */
#battleView .battle-skill-bar {
  display: grid !important;
  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  gap: .65rem !important;
  overflow: visible !important;
  padding: .18rem 0 .35rem !important;
}

#battleView .battle-skill {
  position: relative;
  min-width: 0 !important;
  min-height: 132px !important;
  display: grid !important;
  grid-template-rows: auto 1fr;
  align-items: stretch !important;
  overflow: hidden;
  border: 1px solid rgba(129,140,248,.28) !important;
  border-radius: 1rem !important;
  background:
    radial-gradient(170px 90px at 14% -8%, rgba(99,102,241,.18), transparent 72%),
    linear-gradient(160deg, rgba(26,30,67,.94), rgba(12,18,39,.98)) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.035), 0 12px 28px rgba(2,6,23,.2) !important;
  transition: transform .16s ease, border-color .16s ease, box-shadow .16s ease, filter .16s ease;
}

#battleView .battle-skill:has(button:not(:disabled)) {
  border-color: rgba(129,140,248,.48) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.045), 0 0 0 1px rgba(99,102,241,.05), 0 14px 32px rgba(49,46,129,.18) !important;
}

#battleView .battle-skill:has(button:not(:disabled)):hover {
  transform: translateY(-2px);
  border-color: rgba(167,139,250,.72) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.055), 0 0 0 1px rgba(129,140,248,.08), 0 18px 34px rgba(49,46,129,.24) !important;
}

#battleView .battle-skill button,
#battleView .skill-cast-btn {
  position: relative;
  width: 100%;
  min-width: 0;
  min-height: 80px !important;
  padding: .78rem .82rem .62rem !important;
  display: grid !important;
  grid-template-columns: 48px minmax(0,1fr) auto;
  grid-template-rows: auto minmax(22px,auto);
  column-gap: .68rem;
  row-gap: .18rem;
  align-items: center;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  color: #eef2ff !important;
  box-shadow: none !important;
  cursor: pointer;
}

#battleView .battle-skill button:disabled { cursor: default; opacity: 1 !important; }

#battleView .battle-skill-icon {
  position: static !important;
  grid-column: 1;
  grid-row: 1 / 3;
  align-self: center;
  width: 48px !important;
  height: 48px !important;
  padding: .38rem;
  display: grid;
  place-items: center;
  border: 1px solid rgba(165,180,252,.2);
  border-radius: .82rem;
  background: radial-gradient(circle at 50% 35%, rgba(165,180,252,.15), transparent 70%), rgba(15,23,42,.52);
  opacity: .98 !important;
  filter: drop-shadow(0 8px 16px rgba(2,6,23,.34)) !important;
  transform: none !important;
}

#battleView .battle-skill-icon svg,
#battleView .battle-skill-icon img { width: 100%; height: 100%; object-fit: contain; }

#battleView .battle-skill-name {
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
  color: #f8fafc !important;
  font-size: .94rem !important;
  font-weight: 900 !important;
  line-height: 1.1;
  letter-spacing: -.015em !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#battleView .battle-skill-hotkey {
  grid-column: 3;
  grid-row: 1;
  justify-self: end;
  align-self: start;
  margin: 0 !important;
  padding: .23rem .44rem !important;
  border: 1px solid rgba(148,163,184,.2) !important;
  border-radius: .52rem !important;
  background: rgba(15,23,42,.62) !important;
  color: #aebbd0 !important;
  font-size: .62rem !important;
  font-weight: 800 !important;
  line-height: 1;
}

#battleView .battle-skill-combo {
  grid-column: 2 / 4;
  grid-row: 2;
  min-width: 0;
  margin: .08rem 0 0 !important;
  display: flex;
  align-items: center;
  gap: .25rem;
  flex-wrap: wrap;
}

#battleView .battle-skill-combo-key {
  min-width: 0;
  min-height: 25px;
  padding: .2rem .42rem !important;
  display: inline-grid;
  place-items: center;
  border: 1px solid rgba(96,165,250,.22) !important;
  border-radius: .48rem !important;
  background: rgba(30,64,175,.16) !important;
  color: #c7d2fe !important;
  font-size: .64rem !important;
  font-weight: 850 !important;
  line-height: 1;
}

#battleView .battle-skill-desc {
  min-height: 44px;
  margin: 0 !important;
  padding: .54rem .82rem .68rem !important;
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(148,163,184,.1);
  background: rgba(2,6,23,.16);
  color: #cbd5e1 !important;
  font-size: .72rem !important;
  font-weight: 690 !important;
  line-height: 1.32 !important;
  overflow: visible !important;
}

#battleView .battle-skill::after {
  content: '';
  position: absolute;
  right: .78rem;
  bottom: .62rem;
  pointer-events: none;
  font-size: .56rem;
  font-weight: 900;
  letter-spacing: .065em;
}
#battleView .battle-skill:has(button:not(:disabled))::after { content: 'BEREIT'; color: #a7f3d0; }
#battleView .battle-skill.skill-locked::after { content: 'COOLDOWN'; color: #c4b5fd; }
#battleView .battle-skill.used::after { content: 'BENUTZT'; color: #94a3b8; }

#battleView .battle-skill.skill-locked,
#battleView .battle-skill.used {
  border-color: rgba(100,116,139,.16) !important;
  background: linear-gradient(160deg, rgba(24,30,48,.82), rgba(10,16,30,.94)) !important;
  filter: saturate(.72);
}
#battleView .battle-skill.skill-locked .battle-skill-icon,
#battleView .battle-skill.used .battle-skill-icon {
  opacity: .48 !important;
  filter: grayscale(.22) drop-shadow(0 6px 12px rgba(2,6,23,.24)) !important;
}
#battleView .battle-skill.skill-locked .battle-skill-name,
#battleView .battle-skill.used .battle-skill-name { color: #cbd5e1 !important; }

#battleView .battle-skill button:focus-visible {
  outline: 2px solid rgba(167,139,250,.9);
  outline-offset: -3px;
  border-radius: .9rem !important;
}

#battleView .battle-foot { margin-top: .1rem; padding-top: .16rem; }

@media (max-width: 1050px) {
  #battleView .battle-skill-bar { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }
}
@media (max-width: 620px) {
  #battleView .battle-skill-bar { grid-template-columns: 1fr !important; gap: .5rem !important; }
  #battleView .battle-skill { min-height: 118px !important; }
  #battleView .battle-skill button,
  #battleView .skill-cast-btn {
    min-height: 74px !important;
    grid-template-columns: 44px minmax(0,1fr) auto;
    column-gap: .56rem;
    padding: .68rem .7rem .52rem !important;
  }
  #battleView .battle-skill-icon { width: 44px !important; height: 44px !important; }
  #battleView .battle-skill-desc { min-height: 40px; padding: .48rem .7rem .58rem !important; }
}
'''
css_path.write_text(css.rstrip() + block + '\n', encoding='utf-8')
