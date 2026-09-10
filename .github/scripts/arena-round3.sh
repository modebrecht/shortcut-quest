#!/usr/bin/env bash
set -euo pipefail
cat >> 2026/modern-battle.css <<'EOF'

/* ONE ARENA POLISH — ROUND 3: HUD calm + encounter polish */
#battleView .battle-center-head {
  padding-top: 0;
}

#battleView .battle-center-titleline h2 {
  font-size: 1.52rem;
}

#battleView .battle-center-head p {
  margin-top: .2rem;
  color: #8297b0;
}

#battleView .battle-side-head {
  border-radius: .72rem;
  backdrop-filter: blur(10px);
}

#battleView .battle-side.hero .battle-side-head {
  justify-self: start;
  min-width: 170px;
}

#battleView .battle-side.enemy .battle-side-head {
  width: min(230px,100%);
  display: grid;
  grid-template-columns: minmax(0,1fr) auto;
  gap: .45rem;
  align-items: center;
}

#battleView .battle-side.enemy .battle-side-head > div:first-child {
  min-width: 0;
  text-align: left;
}

#battleView .battle-side.enemy .battle-side-head > div:last-child {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: .22rem;
}

#battleView .battle-side-label {
  white-space: nowrap;
  color: #8196ae;
}

#battleView .battle-side-head h3 {
  color: #f7f9fc;
  font-size: 1rem;
  line-height: 1.08;
}

#battleView .battle-side-tier,
#battleView .battle-trait {
  white-space: nowrap;
  font-size: .58rem;
  padding: .18rem .38rem;
}

#battleView .battle-statline {
  gap: .28rem;
  padding: .24rem .3rem;
  border-radius: .65rem;
}

#battleView .battle-stat-badge {
  padding: .28rem .46rem;
  font-size: .68rem;
}

#battleView .battle-stage-preview .battle-crest-label {
  width: 74px;
  height: 74px;
  border-color: rgba(251,191,36,.62);
  font-size: 1.08rem;
}

#battleView .battle-center-actions {
  gap: .58rem;
  margin-top: 1rem;
}

#battleView .battle-btn.battle-featured {
  min-height: 120px !important;
  padding: .64rem .7rem !important;
  border-radius: .94rem !important;
}

#battleView .battle-btn.battle-featured .battle-btn-top {
  grid-template-columns: 56px minmax(0,1fr) 18px;
}

#battleView .battle-btn.battle-featured .battle-btn-art {
  width: 56px;
  height: 56px;
}

#battleView .battle-btn.battle-featured.selected {
  box-shadow:
    0 0 0 1px rgba(251,191,36,.24),
    0 12px 30px rgba(245,158,11,.11),
    inset 0 1px 0 rgba(255,255,255,.05) !important;
}

#battleView .battle-btn.battle-compact {
  min-height: 25px !important;
  opacity: .38;
}

#battleView .battle-btn.battle-compact:hover:not(:disabled),
#battleView .battle-btn.battle-compact.selected {
  opacity: .82;
}

#battleView .battle-meta-strip {
  min-height: 42px;
  margin-top: .08rem;
  background: rgba(5,14,26,.72);
}

#battleView .battle-meta-strip > span {
  font-size: .61rem;
  color: #8195ad;
}

#battleView .battle-start-btn {
  min-height: 58px;
  margin-top: .2rem;
  font-size: .94rem;
}

@media (max-width: 720px) {
  #battleView .battle-center-titleline h2 { font-size: 1.3rem; }
  #battleView .battle-center-head p { font-size: .7rem; }
  #battleView .battle-side.hero .battle-side-head { min-width: 0; }
  #battleView .battle-side.enemy .battle-side-head {
    width: 100%;
    grid-template-columns: minmax(0,1fr);
    gap: .15rem;
  }
  #battleView .battle-side.enemy .battle-side-head > div:last-child {
    flex-direction: row;
    justify-content: flex-end;
  }
  #battleView .battle-side-label { font-size: .5rem; }
  #battleView .battle-side-head h3 { font-size: .76rem; }
  #battleView .battle-side-tier,
  #battleView .battle-trait { font-size: .5rem; }
  #battleView .battle-stat-badge { font-size: .54rem; padding: .2rem .28rem; }
  #battleView .battle-stage-preview .battle-crest-label { width: 58px; height: 58px; font-size: .92rem; }
}

@media (max-width: 460px) {
  #battleView .battle-center-head p { display: none; }
  #battleView .battle-side-label { display: none; }
  #battleView .battle-side-head { background: rgba(4,12,24,.64); }
  #battleView .battle-btn.battle-featured { min-height: 78px !important; }
  #battleView .battle-meta-strip { margin-top: .02rem; }
}
EOF
