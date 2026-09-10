from pathlib import Path
p=Path('2026/modern-battle.css')
s=p.read_text(encoding='utf-8')
marker='/* SCREENSHOT PASS PROPORTION OVERFLOW FIX */'
if marker in s:
    s=s.split(marker)[0].rstrip()+'\n'
s += r'''

/* SCREENSHOT PASS PROPORTION OVERFLOW FIX */
#battleView .battle-overview {
  grid-template-columns: minmax(0,.82fr) minmax(0,1.38fr) minmax(0,.82fr);
}
#battleView .battle-overview > * {
  min-width: 0;
  max-width: 100%;
}
@media (max-width: 1180px) and (min-width: 981px) {
  #battleView .battle-overview {
    grid-template-columns: minmax(0,.78fr) minmax(0,1.38fr) minmax(0,.78fr);
  }
}
@media (max-width: 980px) {
  #battleView .battle-overview {
    grid-template-columns: repeat(2,minmax(0,1fr));
  }
}
@media (max-width: 720px) {
  #battleView .battle-overview {
    grid-template-columns: minmax(0,1fr);
  }
}
'''
p.write_text(s,encoding='utf-8')
