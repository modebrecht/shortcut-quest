from pathlib import Path

p = Path('2026/modern-battle.css')
s = p.read_text(encoding='utf-8')
marker = '/* ACTIVE BATTLE FOCUS */'
if marker in s:
    raise SystemExit('battle focus rule already present')
block = r'''

/* ACTIVE BATTLE FOCUS */
#battleView #battleSimulation:not(.hidden) + .battle-overview {
  display: none;
}
'''
p.write_text(s.rstrip() + block + '\n', encoding='utf-8')
