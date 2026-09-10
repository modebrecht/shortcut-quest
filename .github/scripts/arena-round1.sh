#!/usr/bin/env bash
set -euo pipefail
cat >> 2026/modern-battle.css <<'EOF'

/* ONE ARENA POLISH — ROUND 1: geometry + hierarchy */
#battleView .battle-stage-preview {
  min-height: 486px;
  margin-top: .35rem;
}

#battleView .battle-side {
  top: 126px;
  width: min(250px, 24%);
  height: 410px;
  display: grid;
  grid-template-rows: auto minmax(0,1fr) auto;
  align-items: stretch;
}

#battleView .battle-side.hero { left: clamp(34px, 5vw, 78px); }
#battleView .battle-side.enemy { right: clamp(34px, 5vw, 78px); }

#battleView .battle-side-head {
  align-self: start;
  padding: .42rem .58rem;
  background: rgba(4,12,24,.74);
  border-color: rgba(148,163,184,.12);
  box-shadow: 0 10px 26px rgba(2,6,23,.18);
}

#battleView .battle-side.enemy .battle-side-head {
  justify-self: end;
}

#battleView .battle-portrait,
#battleView .battle-portrait.hero,
#battleView .battle-portrait.enemy {
  width: 100%;
  height: 100%;
  min-height: 0;
  margin: 0;
  align-self: stretch;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
}

#battleView .battle-portrait-icon {
  display: block;
  width: 100%;
  height: 100%;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  overflow: visible;
}

#battleView .battle-portrait-icon img {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center bottom;
}

#battleView .battle-side.hero .battle-portrait-icon img {
  transform: scale(.88);
  transform-origin: 50% 100%;
}

#battleView .battle-side.enemy .battle-portrait-icon img {
  transform: scale(.93);
  transform-origin: 50% 100%;
}

#battleView .battle-statline {
  align-self: end;
  margin: 0 !important;
  transform: translateY(-10px);
  background: rgba(4,12,24,.78);
  border-color: rgba(148,163,184,.12);
  box-shadow: 0 10px 24px rgba(2,6,23,.18);
}

#battleView .battle-side.hero .battle-statline { justify-self: start; }
#battleView .battle-side.enemy .battle-statline { justify-self: end; }

#battleView .battle-gear { display: none !important; }

#battleView .battle-center-actions { margin-top: .85rem; }
#battleView .battle-buttons { gap: .66rem !important; }

#battleView .battle-stage-preview .battle-crest-label {
  top: 48%;
  width: 82px;
  height: 82px;
}

@media (max-width: 980px) {
  #battleView .battle-stage-preview { min-height: 430px; }
  #battleView .battle-side { top: 120px; width: 29%; height: 360px; }
  #battleView .battle-side.hero { left: 24px; }
  #battleView .battle-side.enemy { right: 24px; }
}

@media (max-width: 720px) {
  #battleView .battle-stage-preview { min-height: 360px; }
  #battleView .battle-side { top: 105px; width: 42%; height: 300px; }
  #battleView .battle-side.hero { left: 8px; }
  #battleView .battle-side.enemy { right: 8px; }
  #battleView .battle-side-head { padding: .3rem .38rem; }
  #battleView .battle-statline { transform: translateY(-5px); }
}

@media (max-width: 460px) {
  #battleView .battle-stage-preview { min-height: 326px; }
  #battleView .battle-side { top: 100px; width: 43%; height: 266px; }
  #battleView .battle-side.hero { left: 4px; }
  #battleView .battle-side.enemy { right: 4px; }
}
EOF
