(function attachSkillHotkeys(global) {
  // TK2 2026 runs beside the legacy root edition. The root runtime still
  // asks localStorage for shortcutRitter_v1, so namespace that key only on
  // this page before the inline game runtime starts.
  const LEGACY_STORAGE_KEY = "shortcutRitter_v1";
  const STORAGE_2026_KEY = "shortcutRitter_2026_v1";

  if (typeof Storage !== "undefined" && !global.__shortcutQuest2026StoragePatched) {
    const rawGet = Storage.prototype.getItem;
    const rawSet = Storage.prototype.setItem;
    const rawRemove = Storage.prototype.removeItem;
    const mapKey = (store, key) => (store === global.localStorage && key === LEGACY_STORAGE_KEY ? STORAGE_2026_KEY : key);

    Storage.prototype.getItem = function(key) {
      return rawGet.call(this, mapKey(this, key));
    };
    Storage.prototype.setItem = function(key, value) {
      return rawSet.call(this, mapKey(this, key), value);
    };
    Storage.prototype.removeItem = function(key) {
      return rawRemove.call(this, mapKey(this, key));
    };

    // Start the curated course with Phase 1 open. Every first clear unlocks
    // one more section through the existing progression logic.
    if (rawGet.call(global.localStorage, STORAGE_2026_KEY) === null) {
      rawSet.call(global.localStorage, STORAGE_2026_KEY, JSON.stringify({
        edition: "tk2-2026",
        sectionsUnlocked: 5
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
