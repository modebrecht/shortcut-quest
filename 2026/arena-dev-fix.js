(function () {
  'use strict';

  const STYLE_ID = 'a8ArenaDevFixStyles';
  const ARENA_BACKGROUND = "radial-gradient(ellipse at 50% 6%, rgba(72,128,177,.24) 0%, rgba(25,58,87,.10) 34%, transparent 58%), radial-gradient(circle at 8% 68%, rgba(255,210,112,.94) 0 2px, rgba(245,143,28,.44) 3px 8px, rgba(245,143,28,.09) 9px 38px, transparent 72px), radial-gradient(circle at 92% 68%, rgba(255,210,112,.94) 0 2px, rgba(245,143,28,.44) 3px 8px, rgba(245,143,28,.09) 9px 38px, transparent 72px), linear-gradient(90deg, rgba(1,5,11,.58) 0 6%, transparent 15% 85%, rgba(1,5,11,.58) 94% 100%), repeating-linear-gradient(0deg, rgba(142,163,181,.055) 0 1px, transparent 1px 52px), repeating-linear-gradient(90deg, rgba(125,145,165,.035) 0 1px, transparent 1px 120px), linear-gradient(180deg, #102a43 0%, #0b2035 36%, #081725 67%, #070d14 100%)";

  const css = `
    /* Final arena layer: loaded after battle-motion.js in DEV. */
    #battleView .battle-stage-preview,
    #battleView .battle-arena {
      background-color: #07101a !important;
      background-image: ${ARENA_BACKGROUND} !important;
      background-size: auto !important;
      background-position: center !important;
      background-repeat: no-repeat !important;
      filter: none !important;
    }

    #battleView .battle-stage-preview::before,
    #battleView .battle-stage-preview::after,
    #battleView .battle-arena::before,
    #battleView .battle-arena::after {
      content: none !important;
      display: none !important;
      background: none !important;
    }

    #battleView .battle-stage-preview .battle-stage-haze {
      display: none !important;
      opacity: 0 !important;
      background: transparent !important;
      background-image: none !important;
      filter: none !important;
      backdrop-filter: none !important;
      animation: none !important;
    }
    #battleView .battle-stage-preview .battle-stage-haze::before,
    #battleView .battle-stage-preview .battle-stage-haze::after {
      content: none !important;
      display: none !important;
      background: none !important;
    }

    #battleView .battle-side,
    #battleView .battle-side.hero,
    #battleView .battle-side.enemy,
    #battleView .battle-side .battle-portrait,
    #battleView .battle-side .battle-portrait.hero,
    #battleView .battle-side .battle-portrait.enemy,
    #battleView .battle-side .battle-portrait-icon {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      border-color: transparent !important;
      box-shadow: none !important;
    }

    #battleView .battle-side .battle-portrait::before,
    #battleView .battle-side .battle-portrait::after,
    #battleView .battle-side .battle-portrait-icon::before,
    #battleView .battle-side .battle-portrait-icon::after {
      content: none !important;
      display: none !important;
      background: none !important;
    }

    #battleView .battle-side .battle-portrait-icon img,
    #battleView #battleEnemyPreviewIcon,
    #battleView #battleHeroPreviewIcon {
      background: transparent !important;
      background-color: transparent !important;
      box-shadow: none !important;
    }
  `;

  function installStyles() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = css;
      document.head.appendChild(style);
    }
  }

  function enforceArena() {
    installStyles();

    document.querySelectorAll('#battleView .battle-stage-preview, #battleView .battle-arena').forEach(stage => {
      stage.style.setProperty('background-color', '#07101a', 'important');
      stage.style.setProperty('background-image', ARENA_BACKGROUND, 'important');
      stage.style.setProperty('background-size', 'auto', 'important');
      stage.style.setProperty('background-position', 'center', 'important');
      stage.style.setProperty('background-repeat', 'no-repeat', 'important');
      stage.style.setProperty('filter', 'none', 'important');
    });

    const haze = document.querySelector('#battleView .battle-stage-haze');
    if (haze) haze.style.setProperty('display', 'none', 'important');

    document.querySelectorAll('#battleView .battle-side, #battleView .battle-portrait, #battleView .battle-portrait-icon').forEach(el => {
      el.style.setProperty('background', 'transparent', 'important');
      el.style.setProperty('background-color', 'transparent', 'important');
      el.style.setProperty('background-image', 'none', 'important');
      el.style.setProperty('box-shadow', 'none', 'important');
    });
  }

  function init() {
    enforceArena();
    document.addEventListener('click', event => {
      if (event.target.closest('[data-view="battle"], .battle-btn, #battleStartBtn')) {
        requestAnimationFrame(enforceArena);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
