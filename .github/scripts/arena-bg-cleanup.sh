#!/usr/bin/env bash
set -euo pipefail

cat >> 2026/modern-battle.css <<'EOF'

/* ONE ARENA POLISH — ROUND 4: background cleanup */
/* The one-arena composition now carries the visual hierarchy itself. Keep the room quiet. */
#battleView .battle-stage-preview {
  background-color: #07131f !important;
  background-image:
    radial-gradient(ellipse at 50% -8%, rgba(70,122,168,.16) 0%, rgba(24,58,88,.08) 34%, transparent 58%),
    radial-gradient(circle at 8.5% 64%, rgba(255,201,91,.72) 0 2px, rgba(245,143,25,.20) 3px 9px, rgba(245,143,25,.055) 10px 38px, transparent 66px),
    radial-gradient(circle at 91.5% 64%, rgba(255,201,91,.72) 0 2px, rgba(245,143,25,.20) 3px 9px, rgba(245,143,25,.055) 10px 38px, transparent 66px),
    repeating-linear-gradient(0deg, rgba(128,151,171,.038) 0 1px, transparent 1px 54px),
    linear-gradient(180deg, #0b2236 0%, #0a1c2d 40%, #081522 67%, #070d14 100%) !important;
}

/* Remove the old decorative side pillars: they read as UI bars behind the fighters. */
#battleView .battle-stage-haze::before,
#battleView .battle-stage-haze::after {
  content: none !important;
  display: none !important;
}

#battleView .battle-stage-haze {
  background:
    radial-gradient(ellipse at 50% 20%, rgba(88,142,187,.075), transparent 48%),
    linear-gradient(180deg, transparent 0 54%, rgba(2,6,12,.10) 72%, rgba(2,6,12,.24) 100%);
}

/* Replace the oversized side crescents with a restrained room vignette + floor horizon. */
#battleView .battle-stage-preview::before {
  z-index: 1;
  background:
    linear-gradient(90deg, rgba(1,5,10,.26) 0%, transparent 10% 90%, rgba(1,5,10,.26) 100%),
    linear-gradient(180deg, transparent 0 57%, rgba(2,7,13,.08) 58%, rgba(2,7,13,.30) 100%);
}

#battleView .battle-stage-preview::after {
  left: 19%;
  right: 19%;
  bottom: 4.5%;
  height: 25%;
  border-color: rgba(218,169,70,.22);
  background:
    radial-gradient(ellipse at center, rgba(251,191,36,.075) 0 7%, rgba(53,48,35,.035) 30%, rgba(2,6,23,.22) 72%),
    repeating-radial-gradient(ellipse at center, transparent 0 26px, rgba(170,136,69,.07) 27px 28px, transparent 29px 46px);
  box-shadow:
    0 0 0 10px rgba(251,191,36,.010),
    0 18px 44px rgba(0,0,0,.22),
    inset 0 0 38px rgba(245,158,11,.035);
}

@media (max-width: 720px) {
  #battleView .battle-stage-preview {
    background-image:
      radial-gradient(ellipse at 50% -8%, rgba(70,122,168,.14) 0%, rgba(24,58,88,.06) 34%, transparent 58%),
      radial-gradient(circle at 5% 66%, rgba(255,201,91,.55) 0 2px, rgba(245,143,25,.12) 3px 8px, transparent 42px),
      radial-gradient(circle at 95% 66%, rgba(255,201,91,.55) 0 2px, rgba(245,143,25,.12) 3px 8px, transparent 42px),
      repeating-linear-gradient(0deg, rgba(128,151,171,.032) 0 1px, transparent 1px 48px),
      linear-gradient(180deg, #0b2236 0%, #0a1c2d 40%, #081522 67%, #070d14 100%) !important;
  }
  #battleView .battle-stage-preview::after {
    left: 14%;
    right: 14%;
    height: 22%;
  }
}
EOF
