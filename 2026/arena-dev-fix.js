(function () {
  'use strict';

  const STYLE_ID = 'a8ArenaDevFixStyles';
  const css = `
    /* Final arena layer: loaded after battle-motion.js in DEV. */
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

    const stage = document.getElementById('battleStagePreview');
    if (stage) {
      stage.style.setProperty(
        'background-image',
        "linear-gradient(180deg, rgba(2,8,18,.05) 0%, rgba(2,8,18,.02) 48%, rgba(2,6,15,.24) 100%), linear-gradient(90deg, rgba(2,6,15,.28), transparent 18%, transparent 82%, rgba(2,6,15,.28)), url('assets/arena-premium.jpg?v=20260911-arena-final')",
        'important'
      );
      stage.style.setProperty('background-size', 'cover', 'important');
      stage.style.setProperty('background-position', 'center 55%', 'important');
      stage.style.setProperty('background-repeat', 'no-repeat', 'important');
    }

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
