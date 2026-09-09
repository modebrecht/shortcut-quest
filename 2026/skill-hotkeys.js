(function attachSkillHotkeys(global) {
  // TK2 2026 runs beside the legacy root edition. The inherited runtime still
  // asks localStorage for shortcutRitter_v1, so namespace that key only on
  // this page before the inline game runtime starts.
  const LEGACY_STORAGE_KEY = "shortcutRitter_v1";
  const STORAGE_2026_KEY = "shortcutRitter_2026_v1";
  const BATTLE_COUNT_2026 = 11;
  const SECTION_COUNT_2026 = 30;

  function narrativeEntry(scene, prompt, options, answers) {
    return {
      scene,
      prompt,
      missingSlots: answers.length,
      options: options.map(value => ({ label: value, value })),
      answers
    };
  }

  function applyDidacticOverrides() {
    const sections = Array.isArray(global.LEARN_SECTION_BLUEPRINTS) ? global.LEARN_SECTION_BLUEPRINTS : [];
    const byId = id => sections.find(section => String(section && section.id) === String(id));

    // Section 12: make the document chain an authentic cross-program workflow
    // instead of copying and pasting back into the same document.
    const s12 = byId(12);
    if (s12) {
      s12.title = "12. Workflow Chain – Dokument";
      s12.description = "Ein realistischer Dokument-Workflow: Inhalt übernehmen, bereinigen, prüfen und sichern.";
      s12.comboBuilder = {
        title: "Workflow Chain",
        instructions: "Setze die Arbeitsschritte als vollständige Shortcut-Kette zusammen.",
        defaultOptions: ["Ctrl+O", "Ctrl+A", "Ctrl+C", "Ctrl+N", "Ctrl+Shift+V", "Ctrl+S", "Ctrl+F", "Ctrl+H", "Ctrl+P"],
        combos: [
          {
            title: "Saubere Kopie erstellen",
            prompt: "Datei öffnen → alles markieren → kopieren → neues Dokument → ohne Formatierung einfügen → speichern.",
            answers: ["Ctrl+O", "Ctrl+A", "Ctrl+C", "Ctrl+N", "Ctrl+Shift+V", "Ctrl+S"]
          },
          {
            title: "Prüfen & ausgeben",
            prompt: "Begriff suchen → suchen & ersetzen → speichern → Druckdialog öffnen.",
            answers: ["Ctrl+F", "Ctrl+H", "Ctrl+S", "Ctrl+P"]
          }
        ]
      };
      s12.tasks = [];
    }

    // Section 16: replace another browser repetition with a distinct system
    // recovery scenario so students transfer A5 shortcuts into a real problem.
    const s16 = byId(16);
    if (s16) {
      s16.title = "16. Szenario – System unter Druck";
      s16.description = "Ein Programm hängt, du musst reagieren und deinen Arbeitsplatz sauber verlassen.";
      s16.narrative = {
        autoCheck: false,
        entries: [
          narrativeEntry(
            "Ein Programm reagiert nicht mehr.",
            "Du öffnest den Task-Manager direkt mit ____ + ____ + ____.",
            ["Ctrl", "Shift", "Esc", "Alt", "Tab"],
            ["Ctrl", "Shift", "Esc"]
          ),
          narrativeEntry(
            "Du willst kurz zu einem anderen geöffneten Programm wechseln.",
            "Du nutzt ____ + ____.",
            ["Alt", "Tab", "Ctrl", "Shift"],
            ["Alt", "Tab"]
          ),
          narrativeEntry(
            "Das aktive Problemfenster soll geschlossen werden.",
            "Du nutzt ____ + ____.",
            ["Alt", "F4", "Ctrl", "W"],
            ["Alt", "F4"]
          ),
          narrativeEntry(
            "Danach brauchst du eine Datei aus dem Explorer.",
            "Du nutzt ____ + ____.",
            ["Win", "E", "D", "L"],
            ["Win", "E"]
          ),
          narrativeEntry(
            "Du verlässt den Arbeitsplatz.",
            "Du sperrst den PC mit ____ + ____.",
            ["Win", "L", "Ctrl", "D"],
            ["Win", "L"]
          )
        ]
      };
      s16.tasks = [];
    }

    // Section 30 is typed recall. Do not require students to somehow type the
    // visual arrow glyphs used by Win+Arrow shortcuts into a text field.
    const s30 = byId(30);
    if (s30 && Array.isArray(s30.tasks)) {
      const leftArrow = s30.tasks.find(task => task && task.answer === "Win+←");
      if (leftArrow) {
        leftArrow.prompt = "Screenshot-Ausschnitt";
        leftArrow.answer = "Win+Shift+S";
      }
      const upArrow = s30.tasks.find(task => task && task.answer === "Win+↑");
      if (upArrow) {
        upArrow.prompt = "Aktives Fenster schliessen";
        upArrow.answer = "Alt+F4";
      }
    }
  }

  applyDidacticOverrides();

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

  function normalize2026State(serialized) {
    try {
      const state = JSON.parse(serialized);
      if (!state || typeof state !== "object") return { serialized, state: null };

      // Battle 1 is available immediately. Each three first-time section clears
      // permit one additional battle rank. The player must also have cleared the
      // preceding battle, so learning and RPG progression advance together.
      const learningCap = Math.min(BATTLE_COUNT_2026, 1 + Math.floor(completedSectionCount(state) / 3));
      const battleCap = sequentialBattleProgress(state);
      state.battleUnlocked = Math.max(1, Math.min(learningCap, battleCap));
      state.edition = "tk2-2026";
      return { serialized: JSON.stringify(state), state };
    } catch (_) {
      return { serialized, state: null };
    }
  }

  function render2026Progress(state) {
    if (typeof document === "undefined") return;
    const completed = Math.min(SECTION_COUNT_2026, completedSectionCount(state));
    let badge = document.getElementById("a8ProgressBadge");
    const editionBadge = document.getElementById("tk2EditionBadge");
    const title = document.querySelector("header .title");
    if (!badge && (editionBadge || title)) {
      badge = document.createElement("span");
      badge.id = "a8ProgressBadge";
      badge.style.cssText = "font-size:.72rem;font-weight:800;padding:.25rem .55rem;border-radius:999px;background:rgba(34,197,94,.10);border:1px solid rgba(34,197,94,.28);color:#bbf7d0;white-space:nowrap";
      (editionBadge || title).insertAdjacentElement("afterend", badge);
    }
    if (!badge) return;
    badge.textContent = completed >= SECTION_COUNT_2026 ? "A8 abgeschlossen ✓" : `${completed} / ${SECTION_COUNT_2026}`;
    badge.title = completed >= SECTION_COUNT_2026
      ? "Alle 30 A8-Abschnitte gemeistert"
      : `${completed} von ${SECTION_COUNT_2026} A8-Abschnitten gemeistert`;
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
      if (this === global.localStorage && mapped === STORAGE_2026_KEY) {
        const normalized = normalize2026State(String(value));
        const result = rawSet.call(this, mapped, normalized.serialized);
        if (normalized.state) queueMicrotask(() => render2026Progress(normalized.state));
        return result;
      }
      return rawSet.call(this, mapped, value);
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

    const stored = rawGet.call(global.localStorage, STORAGE_2026_KEY);
    if (stored) {
      const normalized = normalize2026State(stored);
      if (normalized.serialized !== stored) rawSet.call(global.localStorage, STORAGE_2026_KEY, normalized.serialized);
      global.__shortcutQuest2026InitialState = normalized.state;
    }
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

    // Students naturally type both "Ctrl+C" and "Ctrl + C". Normalize spacing
    // before the inherited strict grader runs, without weakening the answer itself.
    document.addEventListener("click", event => {
      const check = event.target && event.target.closest ? event.target.closest(".check-section") : null;
      if (!check) return;
      const section = check.closest(".section");
      if (!section) return;
      section.querySelectorAll('input[data-answer]').forEach(input => {
        input.value = String(input.value || "").trim().replace(/\s*\+\s*/g, "+");
      });
    }, true);

    render2026Progress(global.__shortcutQuest2026InitialState || {});
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
