(function attachSkillHotkeys(global) {
  // TK2 2026 runs beside the legacy root edition. The inherited runtime still
  // asks localStorage for shortcutRitter_v1, so namespace that key only on
  // this page before the inline game runtime starts.
  const LEGACY_STORAGE_KEY = "shortcutRitter_v1";
  const STORAGE_2026_KEY = "shortcutRitter_2026_v1";
  const BATTLE_COUNT_2026 = 11;

  function completedSectionCount(state) {
    if (!state || !state.sectionClears || typeof state.sectionClears !== "object") return 0;
    return Object.values(state.sectionClears).filter(value => Number(value) > 0).length;
  }

  function sequentialBattleProgress(state) {
    const clears = state && state.battleClears && typeof state.battleClears === "object" ? state.battleClears : {};
    let next = 1;
    while (next < BATTLE_COUNT_2026 && clears[String(next)]) next += 1;
    return next;
  }

  function apply2026BattleGate(serialized) {
    try {
      const state = JSON.parse(serialized);
      if (!state || typeof state !== "object") return serialized;

      // Battle 1 is available immediately. Each three first-time section clears
      // permit one additional battle rank. The player must also have cleared the
      // preceding battle, so learning and RPG progression advance together.
      const learningCap = Math.min(BATTLE_COUNT_2026, 1 + Math.floor(completedSectionCount(state) / 3));
      const battleCap = sequentialBattleProgress(state);
      state.battleUnlocked = Math.max(1, Math.min(learningCap, battleCap));
      state.edition = "tk2-2026";
      return JSON.stringify(state);
    } catch (_) {
      return serialized;
    }
  }

  if (typeof Storage !== "undefined" && !global.__shortcutQuest2026StoragePatched) {
    const rawGet = Storage.prototype.getItem;
    const rawSet = Storage.prototype.setItem;
    const rawRemove = Storage.prototype.removeItem;
    const mapKey = (store, key) => (store === global.localStorage && key === LEGACY_STORAGE_KEY ? STORAGE_2026_KEY : key);

    Storage.prototype.getItem = function(key) {
      return rawGet.call(this, mapKey(this, key));
    };
    Storage.prototype.setItem = function(key, value) {
      const mapped = mapKey(this, key);
      const nextValue = this === global.localStorage && mapped === STORAGE_2026_KEY
        ? apply2026BattleGate(String(value))
        : value;
      return rawSet.call(this, mapped, nextValue);
    };
    Storage.prototype.removeItem = function(key) {
      return rawRemove.call(this, mapKey(this, key));
    };

    // The inherited runtime intentionally exposes the first 10 sections.
    // Each first clear then unlocks one additional section, up to all 30.
    if (rawGet.call(global.localStorage, STORAGE_2026_KEY) === null) {
      rawSet.call(global.localStorage, STORAGE_2026_KEY, JSON.stringify({
        edition: "tk2-2026",
        sectionsUnlocked: 10,
        battleUnlocked: 1
      }));
    }
    global.__shortcutQuest2026StoragePatched = true;
  }

  // Clear visual identity: this is A8, not the archived v1.8 root edition.
  if (typeof document !== "undefined") {
    document.title = "A8 · Shortcut Quest 2026";
    document.documentElement.dataset.edition = "tk2-2026";
    const title = document.querySelector("header .title");
    if (title) {
      title.textContent = "A8 · Shortcut Quest 2026";
      if (!document.getElementById("tk2EditionBadge")) {
        const badge = document.createElement("span");
        badge.id = "tk2EditionBadge";
        badge.textContent = "TK2";
        badge.style.cssText = "font-size:.7rem;font-weight:800;letter-spacing:.06em;padding:.25rem .5rem;border-radius:999px;background:rgba(245,158,11,.16);border:1px solid rgba(245,158,11,.38);color:#fde68a;white-space:nowrap";
        title.insertAdjacentElement("afterend", badge);
      }
    }
    const trainingNav = document.querySelector('[data-view="learn"]');
    if (trainingNav) {
      const labelNode = Array.from(trainingNav.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      if (labelNode) labelNode.textContent = " A8 Training";
    }
  }

  // Battle hotkeys deliberately stay on safe Ctrl-based combinations. Windows
  // system shortcuts such as Win+L must not be used as live battle keypresses.
  const data = [
    { label: "Kopieren (CTRL+C)", keys: ["Control", "C"] },
    { label: "Ausschneiden (CTRL+X)", keys: ["Control", "X"] },
    { label: "Einfügen (CTRL+V)", keys: ["Control", "V"] },
    { label: "Speichern (CTRL+S)", keys: ["Control", "S"] },
    { label: "Rückgängig (CTRL+Z)", keys: ["Control", "Z"] },
    { label: "Wiederholen (CTRL+Y)", keys: ["Control", "Y"] },
    { label: "Alles markieren (CTRL+A)", keys: ["Control", "A"] },
    { label: "Drucken (CTRL+P)", keys: ["Control", "P"] },
    { label: "Suchen (CTRL+F)", keys: ["Control", "F"] },
    { label: "Datei öffnen (CTRL+O)", keys: ["Control", "O"] },
    { label: "Zum Dokumentanfang (CTRL+Home)", keys: ["Control", "Home"] },
    { label: "Zum Dokumentende (CTRL+Ende)", keys: ["Control", "End"] }
  ];

  global.SKILL_HOTKEY_BLUEPRINTS = data;
})(typeof window !== "undefined" ? window : globalThis);
