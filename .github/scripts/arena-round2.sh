#!/usr/bin/env bash
set -euo pipefail
cat >> 2026/modern-battle.css <<'EOF'

/* ONE ARENA POLISH — ROUND 2: scene depth + lighting */
#battleView .battle-stage-preview {
  background-color: #06111d !important;
  background-image:
    radial-gradient(circle at 9% 63%, rgba(255,202,91,.92) 0 2px, rgba(245,143,25,.42) 3px 8px, rgba(245,143,25,.12) 9px 34px, transparent 66px),
    radial-gradient(circle at 91% 63%, rgba(255,202,91,.92) 0 2px, rgba(245,143,25,.42) 3px 8px, rgba(245,143,25,.12) 9px 34px, transparent 66px),
    radial-gradient(ellipse at 50% 18%, rgba(52,103,151,.18), transparent 52%),
    radial-gradient(ellipse at 50% 102%, rgba(210,157,57,.13) 0 7%, rgba(210,157,57,.035) 28%, transparent 54%),
    linear-gradient(90deg,
      rgba(2,7,14,.88) 0 4%,
      rgba(18,34,49,.90) 4% 8%,
      rgba(4,12,22,.94) 8% 11%,
      transparent 11% 89%,
      rgba(4,12,22,.94) 89% 92%,
      rgba(18,34,49,.90) 92% 96%,
      rgba(2,7,14,.88) 96% 100%),
    repeating-linear-gradient(0deg, rgba(121,144,164,.055) 0 1px, transparent 1px 42px),
    repeating-linear-gradient(90deg, rgba(110,130,150,.035) 0 1px, transparent 1px 96px),
    linear-gradient(180deg, #0a2136 0%, #091a2b 35%, #081521 67%, #080d14 100%) !important;
}

#battleView .battle-stage-haze {
  z-index: 1;
  background:
    radial-gradient(ellipse at 50% 24%, rgba(76,132,184,.12), transparent 50%),
    linear-gradient(180deg, rgba(0,0,0,.02), rgba(0,0,0,.18));
}

#battleView .battle-stage-haze::before,
#battleView .battle-stage-haze::after {
  content: '';
  position: absolute;
  top: 8%;
  bottom: 19%;
  width: clamp(54px, 6vw, 88px);
  border: 1px solid rgba(111,133,153,.10);
  border-top-color: rgba(151,170,188,.14);
  border-radius: .35rem .35rem 0 0;
  background:
    linear-gradient(90deg, rgba(2,7,14,.90), rgba(26,43,58,.62) 38%, rgba(8,18,29,.94) 72%),
    repeating-linear-gradient(0deg, transparent 0 32px, rgba(137,154,169,.08) 33px 34px);
  box-shadow:
    inset 10px 0 20px rgba(0,0,0,.32),
    inset -8px 0 16px rgba(0,0,0,.18),
    0 18px 30px rgba(0,0,0,.28);
  opacity: .78;
}

#battleView .battle-stage-haze::before { left: 5.5%; }
#battleView .battle-stage-haze::after { right: 5.5%; transform: scaleX(-1); }

#battleView .battle-stage-preview::before {
  z-index: 1;
  background:
    radial-gradient(ellipse at 18% 58%, transparent 0 14%, rgba(1,5,10,.58) 15% 22%, transparent 23%),
    radial-gradient(ellipse at 82% 58%, transparent 0 14%, rgba(1,5,10,.58) 15% 22%, transparent 23%),
    linear-gradient(180deg, rgba(34,62,86,.08), transparent 43%, rgba(0,0,0,.15));
}

#battleView .battle-stage-preview::after {
  left: 18%;
  right: 18%;
  bottom: 3.5%;
  height: 29%;
  border-color: rgba(221,171,65,.32);
  background:
    radial-gradient(ellipse at center, rgba(251,191,36,.11), rgba(25,34,43,.07) 34%, rgba(2,6,23,.31) 70%),
    repeating-radial-gradient(ellipse at center, transparent 0 22px, rgba(170,136,69,.10) 23px 24px, transparent 25px 39px);
  box-shadow:
    0 0 0 14px rgba(251,191,36,.014),
    0 20px 55px rgba(0,0,0,.28),
    inset 0 0 46px rgba(245,158,11,.06);
}

#battleView .battle-side.hero .battle-portrait-icon img,
#battleView .battle-side.enemy .battle-portrait-icon img {
  filter:
    drop-shadow(0 24px 24px rgba(0,0,0,.58))
    drop-shadow(0 3px 5px rgba(0,0,0,.28));
}

#battleView .battle-stage-preview .battle-crest-label {
  background:
    radial-gradient(circle at 50% 40%, rgba(100,77,24,.34), rgba(10,17,27,.96) 67%);
  box-shadow:
    0 0 42px rgba(245,158,11,.16),
    0 14px 34px rgba(0,0,0,.28),
    inset 0 0 24px rgba(245,158,11,.07);
}

@media (max-width: 720px) {
  #battleView .battle-stage-haze::before,
  #battleView .battle-stage-haze::after {
    width: 42px;
    opacity: .58;
  }
  #battleView .battle-stage-haze::before { left: 3%; }
  #battleView .battle-stage-haze::after { right: 3%; }
}
EOF
