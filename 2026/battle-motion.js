(function () {
  'use strict';

  const root = document.documentElement;
  const style = document.createElement('style');
  style.id = 'a8BattleMotionStyles';
  style.textContent = `
    /* ---------------------------------------------------------------
       A8 BATTLE MOTION POLISH
       Calm anticipation before battle + grounded arena idle poses.
       --------------------------------------------------------------- */

    /* PRE-BATTLE: hero and enemy should feel alive, not like identical floating cards. */
    #battleView .battle-portrait {
      position: relative;
      isolation: isolate;
      overflow: visible;
    }

    #battleView .battle-portrait::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 10%;
      width: 62%;
      height: 14%;
      transform: translateX(-50%);
      border-radius: 50%;
      background: radial-gradient(ellipse, rgba(2,6,23,.48), rgba(2,6,23,0) 70%);
      filter: blur(2px);
      opacity: .72;
      z-index: -1;
    }

    #battleView .battle-portrait.hero .battle-portrait-icon img {
      transform-origin: 50% 88%;
      animation: a8HeroPreviewIdle 4.1s cubic-bezier(.45,0,.55,1) infinite !important;
      will-change: transform;
    }

    #battleView .battle-portrait.enemy .battle-portrait-icon img {
      transform-origin: 50% 88%;
      animation: a8EnemyPreviewIdle 3.25s cubic-bezier(.45,0,.55,1) infinite !important;
      will-change: transform;
    }

    @keyframes a8HeroPreviewIdle {
      0%,100% { transform: translateY(1px) scale(1); }
      42% { transform: translateY(-3px) scale(1.008); }
      58% { transform: translateY(-3.5px) scale(1.01); }
    }

    @keyframes a8EnemyPreviewIdle {
      0%,100% { transform: translateY(1px) rotate(-.35deg) scale(1); }
      46% { transform: translateY(-4px) rotate(.6deg) scale(1.012); }
      62% { transform: translateY(-2.5px) rotate(.15deg) scale(1.006); }
    }

    /* Enemy/rank selection gets one short transition instead of a hard image swap. */
    #battleView .battle-side.enemy.a8-preview-swap {
      animation: a8EnemyCardSwap .42s cubic-bezier(.22,.78,.2,1) both;
    }
    #battleView .battle-side.enemy.a8-preview-swap .battle-portrait-icon img {
      animation: a8EnemyPreviewSwap .42s cubic-bezier(.18,.88,.32,1.12) both !important;
    }
    @keyframes a8EnemyCardSwap {
      0% { border-color: rgba(248,113,113,.15); box-shadow: inset 0 1px 0 rgba(255,255,255,.018); }
      45% { border-color: rgba(248,113,113,.38); box-shadow: 0 10px 30px rgba(127,29,29,.12), inset 0 1px 0 rgba(255,255,255,.03); }
      100% { border-color: rgba(248,113,113,.15); box-shadow: inset 0 1px 0 rgba(255,255,255,.018); }
    }
    @keyframes a8EnemyPreviewSwap {
      0% { opacity:.35; transform: translateY(7px) scale(.94); filter: blur(3px) drop-shadow(0 6px 12px rgba(15,23,42,.6)); }
      62% { opacity:1; transform: translateY(-2px) scale(1.025); filter: blur(0) drop-shadow(0 8px 15px rgba(15,23,42,.62)); }
      100% { opacity:1; transform: translateY(0) scale(1); filter: blur(0) drop-shadow(0 6px 12px rgba(15,23,42,.6)); }
    }

    #battleView .battle-stage-preview .battle-crest-label {
      animation: a8BattleCrestIdle 4.8s ease-in-out infinite;
    }
    #battleView .battle-stage-haze {
      animation: a8BattleStageHaze 6.2s ease-in-out infinite;
    }
    @keyframes a8BattleCrestIdle {
      0%,100% { transform: translate(-50%,-50%) scale(1); box-shadow: 0 0 24px rgba(245,158,11,.10), inset 0 0 22px rgba(245,158,11,.05); }
      50% { transform: translate(-50%,-51%) scale(1.035); box-shadow: 0 0 34px rgba(245,158,11,.18), inset 0 0 26px rgba(245,158,11,.07); }
    }
    @keyframes a8BattleStageHaze {
      0%,100% { opacity:.58; transform: scale(1); }
      50% { opacity:.9; transform: scale(1.035); }
    }

    /* Once the fight starts, the large selection/preview arena gets out of the way.
       Showing two arenas at once made the Battle view read as broken. */
    #battleView .battle-card.a8-battle-active .battle-overview {
      display: none !important;
    }

    #battleView .battle-card.a8-battle-active .battle-sim {
      margin: 0 !important;
    }

    /* ARENA: both characters share one believable floor line. */
    #battleView .battle-arena {
      position: relative;
    }

    #battleView .battle-arena .fighter {
      position: absolute !important;
      margin: 0 !important;
      padding: 0 !important;
      background: transparent !important;
      border: 0 !important;
      overflow: visible !important;
      display: block !important;
      z-index: 2;
    }

    /* Keep a real character-sized wrapper. Previously the sprites were forced to
       350px wide but capped to a 176px-tall wrapper, squashing the knight and leaving
       the weapon layers floating far above his hands. */
    #battleView .battle-arena .fighter.knight {
      left: 21%;
      right: auto;
      bottom: 5.5%;
      width: 190px;
      height: 250px;
    }

    #battleView .battle-arena .fighter.enemy {
      left: auto;
      right: 21%;
      bottom: 5.5%;
      width: 190px;
      height: 235px;
    }

    #battleView .battle-arena .fighter::before {
      display: none !important;
    }

    #battleView .battle-arena .fighter::after {
      content: '' !important;
      display: block !important;
      position: absolute !important;
      left: 50% !important;
      top: auto !important;
      bottom: 0 !important;
      width: 150px !important;
      height: 24px !important;
      transform: translate(-50%, 48%) !important;
      border: 0 !important;
      border-radius: 50% !important;
      background: radial-gradient(ellipse, rgba(2,6,23,.62) 0 20%, rgba(2,6,23,.28) 42%, transparent 72%) !important;
      box-shadow: none !important;
      filter: blur(1.5px);
      opacity: .84;
      z-index: 0;
      pointer-events: none;
    }

    #battleView .battle-arena .fighter-sprite {
      top: auto !important;
      bottom: 0 !important;
      left: 50% !important;
      width: auto !important;
      max-width: none !important;
      max-height: none !important;
      object-fit: contain;
      transform: translateX(-50%) !important;
      transform-origin: 50% 92% !important;
      z-index: 2;
      will-change: transform;
      filter: drop-shadow(0 18px 27px rgba(2,6,23,.68)) !important;
      transition: opacity .3s ease, filter .25s ease !important;
    }

    #battleView .battle-arena .fighter.knight .fighter-sprite {
      height: 245px !important;
    }

    #battleView .battle-arena .fighter.enemy .fighter-sprite {
      height: 225px !important;
    }

    #battleView .battle-arena .fighter.knight:not(.defeated) .fighter-sprite {
      animation: a8ArenaHeroIdle 3.7s ease-in-out infinite !important;
    }

    #battleView .battle-arena .fighter.enemy:not(.defeated) .fighter-sprite {
      animation: a8ArenaEnemyIdle 3.15s ease-in-out infinite !important;
    }

    @keyframes a8ArenaHeroIdle {
      0%,100% { transform: translateX(-50%) translateY(0) scale(1); }
      48% { transform: translateX(-50%) translateY(-2.5px) scale(1.006); }
      60% { transform: translateX(-50%) translateY(-3px) scale(1.008); }
    }

    @keyframes a8ArenaEnemyIdle {
      0%,100% { transform: translateX(-50%) translateY(0) rotate(-.25deg) scale(1); }
      44% { transform: translateX(-50%) translateY(-3.5px) rotate(.45deg) scale(1.008); }
      64% { transform: translateX(-50%) translateY(-2px) rotate(.1deg) scale(1.004); }
    }

    /* Keep defeat compatible with the new bottom-anchored sprite baseline. */
    #battleView .battle-arena .fighter.enemy.defeated .fighter-sprite {
      animation: a8BattleDefeatGrounded .62s cubic-bezier(.4,0,.8,.2) forwards !important;
    }
    @keyframes a8BattleDefeatGrounded {
      0% { transform: translateX(-50%) translateY(0) scale(1); opacity:1; filter:drop-shadow(0 18px 27px rgba(2,6,23,.68)); }
      70% { transform: translateX(-50%) translateY(7px) scale(.72); opacity:.72; filter:drop-shadow(0 8px 12px rgba(2,6,23,.35)); }
      100% { transform: translateX(-50%) translateY(18px) scale(.08); opacity:0; filter:none; }
    }

    /* The knight SVG is 120x170. At 245px tall its hanging hands land roughly
       70px above the wrapper floor. Anchor each sword by its hilt at that point. */
    #battleView .battle-arena .fighter.knight .battle-weapon-slot {
      width: 66px !important;
      height: 78px !important;
      top: auto !important;
      bottom: 7px !important;
      z-index: 3;
    }

    #battleView .battle-arena .fighter.knight .battle-weapon-slot.weapon-left {
      left: 24px !important;
      right: auto !important;
    }
    #battleView .battle-arena .fighter.knight .battle-weapon-slot.weapon-right {
      left: auto !important;
      right: 22px !important;
    }

    #battleView .battle-arena .fighter.knight .battle-weapon-slot img,
    #battleView .battle-arena .fighter.knight .battle-weapon-slot svg {
      width: 118% !important;
      height: 118% !important;
      object-fit: contain !important;
      object-position: center top !important;
    }

    /* Existing attack motion moves the wrappers horizontally; grounded left/right anchors remain stable. */
    #battleView .battle-arena .fighter.attacking-left,
    #battleView .battle-arena .fighter.attacking-right,
    #battleView .battle-arena .fighter.hit {
      z-index: 4;
    }

    @media (max-width: 720px) {
      #battleView .battle-arena .fighter.knight {
        left: 17%;
        bottom: 4.5%;
        width: 150px;
        height: 205px;
      }
      #battleView .battle-arena .fighter.enemy {
        right: 17%;
        bottom: 4.5%;
        width: 150px;
        height: 195px;
      }
      #battleView .battle-arena .fighter.knight .fighter-sprite {
        height: 200px !important;
      }
      #battleView .battle-arena .fighter.enemy .fighter-sprite {
        height: 185px !important;
      }
      #battleView .battle-arena .fighter::after {
        width: 122px !important;
        height: 20px !important;
      }
      #battleView .battle-arena .fighter.knight .battle-weapon-slot {
        width: 56px !important;
        height: 68px !important;
        bottom: 5px !important;
      }
      #battleView .battle-arena .fighter.knight .battle-weapon-slot.weapon-left {
        left: 17px !important;
      }
      #battleView .battle-arena .fighter.knight .battle-weapon-slot.weapon-right {
        right: 15px !important;
      }
    }

    @media (max-width: 460px) {
      #battleView .battle-arena .fighter.knight { left: 15%; bottom: 4%; width: 128px; height: 182px; }
      #battleView .battle-arena .fighter.enemy { right: 15%; bottom: 4%; width: 128px; height: 172px; }
      #battleView .battle-arena .fighter.knight .fighter-sprite { height: 176px !important; }
      #battleView .battle-arena .fighter.enemy .fighter-sprite { height: 164px !important; }
      #battleView .battle-arena .fighter.knight .battle-weapon-slot { width: 48px !important; height: 60px !important; bottom: 4px !important; }
      #battleView .battle-arena .fighter.knight .battle-weapon-slot.weapon-left { left:14px !important; }
      #battleView .battle-arena .fighter.knight .battle-weapon-slot.weapon-right { right:12px !important; }
    }

    /* Animation setting from premium-motion.js must also silence this layer. */
    html.a8-motion-off #battleView .battle-portrait-icon img,
    html.a8-motion-off #battleView .battle-stage-preview .battle-crest-label,
    html.a8-motion-off #battleView .battle-stage-haze,
    html.a8-motion-off #battleView .battle-arena .fighter-sprite,
    html.a8-motion-off #battleView .battle-side.enemy.a8-preview-swap {
      animation: none !important;
    }
  `;

  function installStyles() {
    if (!document.getElementById(style.id)) document.head.appendChild(style);
  }

  function replayPreviewSwap() {
    if (root.classList.contains('a8-motion-off')) return;
    const side = document.querySelector('#battleView .battle-side.enemy');
    if (!side) return;
    side.classList.remove('a8-preview-swap');
    void side.offsetWidth;
    side.classList.add('a8-preview-swap');
    setTimeout(() => side.classList.remove('a8-preview-swap'), 520);
  }

  function installPreviewMotion() {
    const preview = document.getElementById('battleEnemyPreviewIcon');
    if (!preview) return;
    let previousSrc = preview.getAttribute('src') || '';
    const observer = new MutationObserver(() => {
      const src = preview.getAttribute('src') || '';
      if (!src || src === previousSrc) return;
      previousSrc = src;
      replayPreviewSwap();
    });
    observer.observe(preview, { attributes: true, attributeFilter: ['src'] });
  }

  function syncKnightMotionAsset() {
    const sprite = document.getElementById('battleKnightSprite');
    if (!sprite) return;
    const disabled = root.classList.contains('a8-motion-off');
    const wanted = disabled ? 'assets/knight_idle_fin.svg' : 'assets/knight_idle_blink.svg';
    if (!String(sprite.getAttribute('src') || '').endsWith(wanted.split('/').pop())) {
      sprite.setAttribute('src', wanted);
    }
  }

  function installMotionSettingSync() {
    syncKnightMotionAsset();
    const observer = new MutationObserver(syncKnightMotionAsset);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
  }

  function syncBattleMode() {
    const simulation = document.getElementById('battleSimulation');
    const card = simulation && simulation.closest('.battle-card');
    if (!simulation || !card) return;
    card.classList.toggle('a8-battle-active', !simulation.classList.contains('hidden'));
  }

  function installBattleModeSync() {
    const simulation = document.getElementById('battleSimulation');
    if (!simulation) return;
    syncBattleMode();
    const observer = new MutationObserver(syncBattleMode);
    observer.observe(simulation, { attributes: true, attributeFilter: ['class'] });
  }

  function init() {
    installStyles();
    installPreviewMotion();
    installMotionSettingSync();
    installBattleModeSync();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();