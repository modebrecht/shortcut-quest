" --- BATTLE PAUSE HELPER --- "

(() => {
  if (window.__battlePauseControl) return; // already installed
  const originalDelay = window.delay;
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  window.__battlePauseControl = {
    paused: false,
    async waitWhilePaused() {
      while (this.paused) await sleep(80);
    },
    pause() {
      this.paused = true;
      console.info("[Battle] paused");
    },
    resume() {
      this.paused = false;
      console.info("[Battle] resumed");
    },
    toggle() {
      this.paused ? this.resume() : this.pause();
    },
    state() {
      return {
        inProgress: window.battleInProgress,
        paused: this.paused
      };
    }
  };

  window.delay = async function patchedDelay(ms) {
    await window.__battlePauseControl.waitWhilePaused();
    return originalDelay(ms);
  };

  console.info("Battle pause helper ready. Use __battlePauseControl.pause(), resume(), toggle(), state().");
})();

__battlePauseControl.pause();


" --- DELETE LOCAL PROGRESS --- "
localStorage.removeItem("shortcutRitter_v1");
location.reload();

" --- DEBUG MODE ---"
window.CONSTANTS_DEBUG = true;

" --- ADD COINS --- "
const amount = 1000; // or any number
state.coins += amount;
updateUI();
saveState();