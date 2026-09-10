from pathlib import Path

p = Path('2026/modern-battle.css')
css = p.read_text(encoding='utf-8')
marker = '/* AAA ARENA REBUILD 2026-09-11 */'
if marker in css:
    raise SystemExit('AAA arena rebuild already present')

block = r'''

/* AAA ARENA REBUILD 2026-09-11 */
/* Scene rebuilt from CSS layers only. No stretched background image, no generated/new art. */
#battleView .battle-stage-preview,
#battleView .battle-arena {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background-color: #07101a !important;
  background-image:
    radial-gradient(ellipse at 50% 8%, rgba(61,108,151,.24) 0%, rgba(28,59,88,.10) 32%, transparent 58%),
    radial-gradient(circle at 13% 54%, rgba(255,183,74,.22) 0 2%, rgba(237,128,27,.09) 7%, transparent 17%),
    radial-gradient(circle at 87% 54%, rgba(255,183,74,.22) 0 2%, rgba(237,128,27,.09) 7%, transparent 17%),
    linear-gradient(180deg, #0b2032 0%, #0a1a29 36%, #081522 63%, #080d14 100%) !important;
  background-size: auto !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  border: 1px solid rgba(167,126,57,.25);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.05),
    inset 0 -120px 150px rgba(0,0,0,.46),
    0 28px 58px rgba(1,5,12,.30);
}

/* Rear wall: architectural depth without a bitmap. */
#battleView .battle-stage-preview::before,
#battleView .battle-arena::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 1;
  background:
    linear-gradient(90deg,
      rgba(2,7,13,.72) 0 3%,
      rgba(26,43,58,.38) 3% 4.5%,
      transparent 4.5% 95.5%,
      rgba(26,43,58,.38) 95.5% 97%,
      rgba(2,7,13,.72) 97% 100%),
    repeating-linear-gradient(0deg,
      rgba(141,161,178,.055) 0 1px,
      transparent 1px 42px),
    repeating-linear-gradient(90deg,
      rgba(128,148,167,.038) 0 1px,
      transparent 1px 120px),
    linear-gradient(180deg,
      rgba(24,48,69,.18) 0%,
      rgba(8,20,32,.08) 52%,
      rgba(2,7,13,.22) 100%);
}

/* Floor plane: a separate perspective layer, never stretched from an image. */
#battleView .battle-stage-preview::after,
#battleView .battle-arena::after {
  content: '';
  position: absolute;
  z-index: 1;
  left: 8%;
  right: 8%;
  bottom: -12%;
  height: 48%;
  pointer-events: none;
  border-radius: 50% 50% 8% 8% / 26% 26% 12% 12%;
  border-top: 1px solid rgba(218,166,66,.25);
  background:
    radial-gradient(ellipse at 50% 6%, rgba(247,190,77,.12), transparent 28%),
    repeating-radial-gradient(ellipse at 50% 0%, transparent 0 34px, rgba(204,159,72,.085) 35px 36px, transparent 37px 61px),
    linear-gradient(180deg, rgba(20,27,34,.22), rgba(3,7,11,.72));
  box-shadow:
    0 -18px 54px rgba(213,158,55,.035),
    inset 0 26px 50px rgba(255,190,71,.025),
    inset 0 -52px 72px rgba(0,0,0,.52);
  transform: perspective(640px) rotateX(58deg);
  transform-origin: 50% 100%;
}

/* Atmospheric middle plane: low-contrast arches and central depth, not giant dark blobs. */
#battleView .battle-stage-haze {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 1;
  background:
    radial-gradient(ellipse at 50% 34%, rgba(55,94,129,.12) 0%, transparent 42%),
    radial-gradient(ellipse at 50% 72%, transparent 0 31%, rgba(1,5,10,.19) 59%, rgba(1,5,10,.36) 100%);
}

#battleView .battle-stage-haze::before,
#battleView .battle-stage-haze::after {
  content: '';
  position: absolute;
  top: 13%;
  bottom: 24%;
  width: 11%;
  min-width: 58px;
  max-width: 130px;
  border: 1px solid rgba(130,149,166,.10);
  border-bottom: 0;
  background:
    linear-gradient(180deg, rgba(32,51,67,.30), rgba(7,16,25,.72)),
    repeating-linear-gradient(0deg, transparent 0 34px, rgba(150,166,178,.055) 35px 36px);
  clip-path: polygon(18% 0, 82% 0, 100% 12%, 86% 100%, 14% 100%, 0 12%);
  box-shadow: inset 12px 0 18px rgba(0,0,0,.24), inset -12px 0 18px rgba(0,0,0,.24);
  opacity: .48;
}
#battleView .battle-stage-haze::before { left: 4.5%; }
#battleView .battle-stage-haze::after { right: 4.5%; transform: scaleX(-1); }

/* Premium fighter grounding: each sprite gets its own soft contact shadow. */
#battleView .battle-side .battle-portrait {
  position: relative;
}
#battleView .battle-side .battle-portrait::after {
  content: '';
  position: absolute;
  z-index: -1;
  left: 15%;
  right: 15%;
  bottom: 3%;
  height: 11%;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(0,0,0,.56), rgba(0,0,0,.18) 54%, transparent 74%);
  filter: blur(5px);
}

#battleView .battle-side.hero .battle-portrait-icon img,
#battleView .battle-side.enemy .battle-portrait-icon img {
  filter:
    drop-shadow(0 20px 18px rgba(0,0,0,.52))
    drop-shadow(0 3px 4px rgba(0,0,0,.30));
}

/* VS belongs to the scene, but should not compete with the fighters. */
#battleView .battle-stage-preview .battle-crest-label {
  top: 47%;
  width: 78px;
  height: 78px;
  border: 1px solid rgba(244,188,54,.72);
  background:
    radial-gradient(circle at 50% 36%, rgba(108,82,22,.30), rgba(9,15,23,.94) 67%);
  box-shadow:
    0 0 34px rgba(245,158,11,.12),
    0 14px 28px rgba(0,0,0,.28),
    inset 0 0 22px rgba(245,158,11,.06);
}

/* Keep the whole composition cinematic and slightly taller on desktop. */
#battleView .battle-stage-preview {
  min-height: 500px;
  border-radius: 1.22rem;
}

@media (max-width: 980px) {
  #battleView .battle-stage-preview { min-height: 440px; }
  #battleView .battle-stage-preview::after,
  #battleView .battle-arena::after {
    left: 5%;
    right: 5%;
    height: 45%;
  }
}

@media (max-width: 720px) {
  #battleView .battle-stage-preview { min-height: 365px; }
  #battleView .battle-stage-haze::before,
  #battleView .battle-stage-haze::after {
    width: 12%;
    min-width: 34px;
    opacity: .30;
  }
  #battleView .battle-stage-preview .battle-crest-label {
    width: 60px;
    height: 60px;
    top: 50%;
  }
}

@media (max-width: 460px) {
  #battleView .battle-stage-preview { min-height: 330px; }
  #battleView .battle-stage-haze::before,
  #battleView .battle-stage-haze::after { opacity: .22; }
}
'''

p.write_text(css.rstrip() + block + '\n', encoding='utf-8')
print('AAA arena CSS appended')
