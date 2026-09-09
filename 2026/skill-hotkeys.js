(function attachSkillHotkeys(global) {
  // TK2 2026 runs beside the legacy root edition. The inherited runtime still
  // asks localStorage for shortcutRitter_v1, so namespace that key only on
  // this page before the inline game runtime starts.
  const LEGACY_STORAGE_KEY = "shortcutRitter_v1";
  const STORAGE_2026_KEY = "shortcutRitter_2026_v1";
  const BATTLE_COUNT_2026 = 11;
  const SECTION_COUNT_2026 = 30;
  // Economy audit: 55-section legacy = 322 reward units, curated 2026 = 278.
  // 1.16x restores almost exactly the same first-clear purchasing power.
  const REWARD_SCALE_2026 = 1.16;
  const RUNEN_AMULET_KEY_2026 = "runen_amulet";
  const XP_STORAGE_KEY_2026 = "tk_global_xp_v1";
  const HINT_COST_XP_2026 = 30;

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

  function migrateRunenAmuletItems(state) {
    if (!state || !Array.isArray(state.items)) return;
    state.items.forEach(item => {
      if (!item || item.key !== RUNEN_AMULET_KEY_2026) return;
      item.baseDef = 1;
      item.description = "Runenschutz: erhöht DEF um 1 pro Tier.";
    });
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
      migrateRunenAmuletItems(state);
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

  function install2026EconomyOverrides() {
    // Remove the inherited equipment-based coin multiplier entirely. Rewards are
    // scaled once, globally, so the shorter 30-section course keeps the same
    // purchasing power as the former 55-section version.
    if (typeof global.getRunenAmuletCoinBonusPercent === "function") {
      global.getRunenAmuletCoinBonusPercent = () => 0;
    }
    if (typeof global.applyCoinBonus === "function") {
      global.applyCoinBonus = baseAmount => {
        const amount = Number(baseAmount) || 0;
        if (amount <= 0) return amount;
        return Math.max(0, Math.round(amount * REWARD_SCALE_2026));
      };
    }

    // The Runen-Amulett becomes a straightforward defensive necklace instead of
    // an economy multiplier: +1 DEF per tier.
    if (typeof global.updateItemDerivedStats === "function") {
      const legacyUpdateItemDerivedStats = global.updateItemDerivedStats;
      global.updateItemDerivedStats = item => {
        if (item && item.key === RUNEN_AMULET_KEY_2026) {
          item.baseDef = 1;
          item.description = "Runenschutz: erhöht DEF um 1 pro Tier.";
        }
        return legacyUpdateItemDerivedStats(item);
      };
    }
    if (typeof global.collectItemStats === "function") {
      const legacyCollectItemStats = global.collectItemStats;
      global.collectItemStats = item => {
        const stats = legacyCollectItemStats(item);
        if (!item || item.key !== RUNEN_AMULET_KEY_2026) return stats;
        const cleaned = stats.filter(stat => stat && stat.label !== "Münzen");
        if (Number(item.def || 0) > 0 && !cleaned.some(stat => stat && stat.label === "DEF")) {
          cleaned.push({ label: "DEF", value: String(item.def), className: "def" });
        }
        return cleaned;
      };
    }

    if (typeof global.updateUI === "function") global.updateUI();
    global.SHORTCUT_QUEST_2026_ECONOMY = Object.freeze({
      rewardScale: REWARD_SCALE_2026,
      runenAmuletEffect: "+1 DEF per tier",
      equipmentCoinBonus: false
    });
  }

  function getSharedXP() {
    if (typeof global.localStorage === "undefined") return 0;
    const value = parseInt(global.localStorage.getItem(XP_STORAGE_KEY_2026) || "0", 10);
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  }

  function setSharedXP(value) {
    if (typeof global.localStorage === "undefined") return;
    global.localStorage.setItem(XP_STORAGE_KEY_2026, String(Math.max(0, Math.floor(Number(value) || 0))));
    renderSharedXP();
    refreshHintButtons();
  }

  function renderSharedXP() {
    if (typeof document === "undefined") return;
    const headerRight = document.querySelector("header .header-right");
    if (!headerRight) return;
    let badge = document.getElementById("a8XpTop");
    if (!badge) {
      badge = document.createElement("span");
      badge.id = "a8XpTop";
      badge.className = "badge";
      const coinBadge = document.getElementById("coinTop");
      if (coinBadge) headerRight.insertBefore(badge, coinBadge);
      else headerRight.appendChild(badge);
    }
    badge.textContent = `⚡ XP: ${getSharedXP()}`;
    badge.title = "Kurs-XP aus TK2 · Tipps kosten 30 XP";
  }

  function injectChoiceStyles() {
    if (typeof document === "undefined" || document.getElementById("a8ChoiceStyles")) return;
    const style = document.createElement("style");
    style.id = "a8ChoiceStyles";
    style.textContent = `
      #learnSections select.a8-native-select {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        opacity: 0 !important;
        pointer-events: none !important;
        overflow: hidden !important;
        clip: rect(0 0 0 0) !important;
      }
      .a8-choice-ui { display: flex; flex-direction: column; gap: .65rem; width: 100%; margin-top: .55rem; }
      .a8-choice-options { display: grid; grid-template-columns: repeat(auto-fit,minmax(112px,1fr)); gap: .55rem; width: 100%; }
      .a8-choice-option, .a8-combo-bank-option, .a8-combo-slot-button {
        appearance: none; border: 1px solid rgba(148,163,184,.38); border-radius: .85rem;
        background: rgba(15,23,42,.58); color: var(--text); min-height: 44px; padding: .62rem .8rem;
        font: inherit; font-weight: 750; cursor: pointer; transition: transform .12s ease,border-color .12s ease,background .12s ease,opacity .12s ease;
      }
      .a8-choice-option:hover:not(:disabled), .a8-combo-bank-option:hover:not(:disabled), .a8-combo-slot-button:hover:not(:disabled) {
        border-color: var(--accent); background: rgba(245,158,11,.14); transform: translateY(-1px);
      }
      .a8-choice-option.selected, .a8-combo-bank-option.selected, .a8-combo-slot-button.active {
        border-color: rgba(245,158,11,.82); background: rgba(245,158,11,.2); box-shadow: 0 0 0 2px rgba(245,158,11,.12);
      }
      .a8-choice-option.removed { opacity: .22; text-decoration: line-through; pointer-events: none; }
      .a8-choice-option.correct, .a8-combo-slot-button.correct { border-color: var(--good); background: var(--good-soft); color: var(--good); }
      .a8-choice-option.wrong, .a8-combo-slot-button.incorrect { border-color: var(--bad); background: var(--bad-soft); color: var(--bad); }
      .a8-choice-option.correct-answer, .a8-combo-bank-option.correct-answer { border-color: var(--good); box-shadow: 0 0 0 2px rgba(34,197,94,.12); }
      .a8-hint-row { display:flex; align-items:center; flex-wrap:wrap; gap:.55rem; }
      .a8-hint-button {
        border: 1px solid rgba(250,204,21,.4); border-radius: .75rem; background: rgba(250,204,21,.10);
        color: #fde68a; padding: .48rem .72rem; font: inherit; font-size: .84rem; font-weight: 750; cursor: pointer;
      }
      .a8-hint-button:disabled { opacity: .48; cursor: not-allowed; }
      .a8-hint-note { color: var(--muted); font-size: .82rem; }
      .a8-combo-controls { display:flex; flex-direction:column; gap:.7rem; width:100%; margin-top:.7rem; }
      .a8-combo-bank { display:flex; flex-wrap:wrap; gap:.48rem; align-items:center; }
      .a8-combo-bank-option { min-height: 40px; padding:.5rem .7rem; font-size:.88rem; }
      .combo-slot .a8-combo-slot-button { min-width: 88px; }
      .a8-combo-bank-option.hint-removed { opacity:.2; text-decoration:line-through; pointer-events:none; }
      @media (max-width: 620px) {
        .a8-choice-options { grid-template-columns: repeat(2,minmax(0,1fr)); }
        .a8-choice-option { min-width:0; padding:.6rem .45rem; }
        .a8-combo-bank { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); }
        .a8-combo-bank-option { min-width:0; }
      }
    `;
    document.head.appendChild(style);
  }

  function updateHintButton(hint, owner) {
    if (!hint) return;
    const used = hint.dataset.used === "true";
    const locked = Boolean(owner && owner.closest && owner.closest(".section.section-locked"));
    const xp = getSharedXP();
    hint.disabled = used || locked || xp < HINT_COST_XP_2026;
    hint.textContent = used
      ? `💡 Tipp genutzt (-${HINT_COST_XP_2026} XP)`
      : xp < HINT_COST_XP_2026
        ? `💡 Tipp (-${HINT_COST_XP_2026} XP | Zu wenig XP)`
        : `💡 Tipp (-${HINT_COST_XP_2026} XP)`;
  }

  function refreshHintButtons() {
    if (typeof document === "undefined") return;
    document.querySelectorAll("#learnSections .a8-hint-button").forEach(hint => {
      updateHintButton(hint, hint.closest(".a8-choice-ui,.combo-row"));
    });
  }

  function spendHintXP() {
    const current = getSharedXP();
    if (current < HINT_COST_XP_2026) return false;
    setSharedXP(current - HINT_COST_XP_2026);
    if (typeof global.playSound === "function") global.playSound("hint");
    return true;
  }

  function syncSimpleChoice(select, ui) {
    if (!select || !ui) return;
    const value = select.value || "";
    const answer = select.dataset.answer || "";
    const isCorrect = select.classList.contains("correct");
    const isIncorrect = select.classList.contains("incorrect");
    ui.querySelectorAll(".a8-choice-option").forEach(button => {
      const selected = button.dataset.value === value;
      button.classList.toggle("selected", selected);
      button.classList.toggle("correct", selected && isCorrect);
      button.classList.toggle("wrong", selected && isIncorrect);
      button.classList.toggle("correct-answer", isIncorrect && button.dataset.value === answer);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }

  function resetSimpleChoice(select, ui) {
    if (!select || !ui) return;
    ui.querySelectorAll(".a8-choice-option").forEach(button => {
      button.classList.remove("removed","correct","wrong","correct-answer");
      button.disabled = false;
    });
    const hint = ui.querySelector(".a8-hint-button");
    if (hint) hint.dataset.used = "false";
    const note = ui.querySelector(".a8-hint-note");
    if (note) note.textContent = "";
    syncSimpleChoice(select, ui);
    updateHintButton(hint, ui);
  }

  function upgradeSimpleSelect(select) {
    if (!select || select.dataset.a8Buttonized === "true") return;
    select.dataset.a8Buttonized = "true";
    select.classList.add("a8-native-select");
    const options = Array.from(select.options).filter(option => option.value);
    if (!options.length) return;

    const ui = document.createElement("div");
    ui.className = "a8-choice-ui";
    const optionWrap = document.createElement("div");
    optionWrap.className = "a8-choice-options";
    options.forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "a8-choice-option";
      button.dataset.value = option.value;
      button.textContent = option.textContent || option.value;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", event => {
        event.preventDefault();
        if (button.classList.contains("removed")) return;
        select.value = button.dataset.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        syncSimpleChoice(select, ui);
      });
      optionWrap.appendChild(button);
    });

    const hintRow = document.createElement("div");
    hintRow.className = "a8-hint-row";
    const hint = document.createElement("button");
    hint.type = "button";
    hint.className = "a8-hint-button";
    hint.dataset.used = "false";
    const note = document.createElement("span");
    note.className = "a8-hint-note";
    hint.addEventListener("click", event => {
      event.preventDefault();
      if (hint.dataset.used === "true" || hint.disabled) return;
      const answer = select.dataset.answer || "";
      const candidates = Array.from(optionWrap.querySelectorAll(".a8-choice-option")).filter(button =>
        button.dataset.value !== answer && button.dataset.value !== select.value && !button.classList.contains("removed")
      );
      if (!candidates.length) return;
      if (!spendHintXP()) return;
      const removed = candidates[Math.floor(Math.random() * candidates.length)];
      removed.classList.add("removed");
      removed.disabled = true;
      hint.dataset.used = "true";
      note.textContent = "Eine falsche Antwort wurde entfernt.";
      updateHintButton(hint, ui);
    });
    hintRow.appendChild(hint);
    hintRow.appendChild(note);
    ui.appendChild(optionWrap);
    ui.appendChild(hintRow);
    select.parentNode.insertBefore(ui, select);

    new MutationObserver(() => syncSimpleChoice(select, ui)).observe(select, { attributes: true, attributeFilter: ["class"] });
    syncSimpleChoice(select, ui);
    updateHintButton(hint, ui);
  }

  function comboOptionValues(selects) {
    const values = [];
    const seen = new Set();
    selects.forEach(select => {
      Array.from(select.options).forEach(option => {
        if (!option.value || seen.has(option.value)) return;
        seen.add(option.value);
        values.push({ value: option.value, label: option.textContent || option.value });
      });
    });
    return values;
  }

  function upgradeComboRow(row) {
    if (!row || row.dataset.a8Buttonized === "true") return;
    const selects = Array.from(row.querySelectorAll(".combo-slot select"));
    if (!selects.length) return;
    row.dataset.a8Buttonized = "true";
    row.dataset.a8ActiveSlot = "0";
    row.dataset.a8HintSlot = "";
    row.dataset.a8HintRemoved = "";
    const slotButtons = [];

    const controls = document.createElement("div");
    controls.className = "a8-combo-controls";
    const bank = document.createElement("div");
    bank.className = "a8-combo-bank";
    const bankButtons = [];
    comboOptionValues(selects).forEach(meta => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "a8-combo-bank-option";
      button.dataset.value = meta.value;
      button.textContent = meta.label;
      bank.appendChild(button);
      bankButtons.push(button);
    });

    function activeIndex() {
      return Math.max(0, Math.min(selects.length - 1, Number(row.dataset.a8ActiveSlot) || 0));
    }

    function syncCombo() {
      const active = activeIndex();
      selects.forEach((select, index) => {
        const button = slotButtons[index];
        if (!button) return;
        button.textContent = select.value || "Wählen";
        button.classList.toggle("active", index === active);
        button.classList.toggle("correct", select.classList.contains("correct"));
        button.classList.toggle("incorrect", select.classList.contains("incorrect"));
      });
      const current = selects[active];
      const hintSlot = Number(row.dataset.a8HintSlot);
      const removedValue = row.dataset.a8HintRemoved || "";
      bankButtons.forEach(button => {
        const selected = current && current.value === button.dataset.value;
        const removed = row.dataset.a8HintSlot !== "" && hintSlot === active && removedValue === button.dataset.value;
        button.classList.toggle("selected", selected);
        button.classList.toggle("hint-removed", removed);
        button.disabled = removed;
        button.classList.toggle("correct-answer", Boolean(current && current.classList.contains("incorrect") && current.dataset.answer === button.dataset.value));
      });
    }

    selects.forEach((select, index) => {
      select.dataset.a8Buttonized = "true";
      select.classList.add("a8-native-select");
      const slot = select.closest(".combo-slot");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "a8-combo-slot-button";
      button.textContent = select.value || "Wählen";
      button.addEventListener("click", event => {
        event.preventDefault();
        row.dataset.a8ActiveSlot = String(index);
        syncCombo();
      });
      if (slot) slot.insertBefore(button, select);
      slotButtons.push(button);
      new MutationObserver(syncCombo).observe(select, { attributes: true, attributeFilter: ["class"] });
    });

    bankButtons.forEach(button => {
      button.addEventListener("click", event => {
        event.preventDefault();
        const index = activeIndex();
        const select = selects[index];
        if (!select || button.disabled) return;
        select.value = button.dataset.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        if (index < selects.length - 1) row.dataset.a8ActiveSlot = String(index + 1);
        syncCombo();
      });
    });

    const hintRow = document.createElement("div");
    hintRow.className = "a8-hint-row";
    const hint = document.createElement("button");
    hint.type = "button";
    hint.className = "a8-hint-button";
    hint.dataset.used = "false";
    const note = document.createElement("span");
    note.className = "a8-hint-note";
    hint.addEventListener("click", event => {
      event.preventDefault();
      if (hint.disabled || hint.dataset.used === "true") return;
      const index = activeIndex();
      const select = selects[index];
      if (!select) return;
      const answer = select.dataset.answer || "";
      const candidates = bankButtons.filter(button => button.dataset.value !== answer && button.dataset.value !== select.value);
      if (!candidates.length) return;
      if (!spendHintXP()) return;
      const removed = candidates[Math.floor(Math.random() * candidates.length)];
      row.dataset.a8HintSlot = String(index);
      row.dataset.a8HintRemoved = removed.dataset.value;
      hint.dataset.used = "true";
      note.textContent = `Für Slot ${index + 1} wurde eine falsche Antwort entfernt.`;
      updateHintButton(hint, row);
      syncCombo();
    });
    hintRow.appendChild(hint);
    hintRow.appendChild(note);
    controls.appendChild(bank);
    controls.appendChild(hintRow);
    row.appendChild(controls);
    row.__a8SyncCombo = syncCombo;
    row.__a8ResetCombo = () => {
      row.dataset.a8ActiveSlot = "0";
      row.dataset.a8HintSlot = "";
      row.dataset.a8HintRemoved = "";
      hint.dataset.used = "false";
      note.textContent = "";
      updateHintButton(hint, row);
      syncCombo();
    };
    updateHintButton(hint, row);
    syncCombo();
  }

  function upgradeAllSelects() {
    if (typeof document === "undefined") return;
    const host = document.getElementById("learnSections");
    if (!host) return;
    host.querySelectorAll(".combo-row").forEach(upgradeComboRow);
    host.querySelectorAll("select:not([data-a8-buttonized='true'])").forEach(select => {
      if (!select.closest(".combo-row")) upgradeSimpleSelect(select);
    });
  }

  function resetButtonUI(section) {
    if (!section) return;
    section.querySelectorAll("select.a8-native-select").forEach(select => {
      if (select.closest(".combo-row")) return;
      const ui = select.previousElementSibling && select.previousElementSibling.classList.contains("a8-choice-ui")
        ? select.previousElementSibling
        : null;
      if (ui) resetSimpleChoice(select, ui);
    });
    section.querySelectorAll(".combo-row").forEach(row => {
      if (typeof row.__a8ResetCombo === "function") row.__a8ResetCombo();
    });
  }

  function install2026ButtonChoices() {
    if (typeof document === "undefined" || global.__shortcutQuest2026ButtonChoicesInstalled) return;
    global.__shortcutQuest2026ButtonChoicesInstalled = true;
    injectChoiceStyles();
    renderSharedXP();
    upgradeAllSelects();
    refreshHintButtons();

    const host = document.getElementById("learnSections");
    if (host) {
      new MutationObserver(() => queueMicrotask(() => {
        upgradeAllSelects();
        refreshHintButtons();
      })).observe(host, { childList: true, subtree: true });
    }

    document.addEventListener("click", event => {
      const reset = event.target && event.target.closest ? event.target.closest(".reset-section") : null;
      if (reset) {
        const section = reset.closest(".section");
        setTimeout(() => resetButtonUI(section), 0);
      }
      const check = event.target && event.target.closest ? event.target.closest(".check-section") : null;
      if (check) {
        setTimeout(() => {
          upgradeAllSelects();
          refreshHintButtons();
          const section = check.closest(".section");
          if (section) {
            section.querySelectorAll(".combo-row").forEach(row => {
              if (typeof row.__a8SyncCombo === "function") row.__a8SyncCombo();
            });
          }
        }, 0);
      }
    });

    global.addEventListener("storage", event => {
      if (event.key === XP_STORAGE_KEY_2026) {
        renderSharedXP();
        refreshHintButtons();
      }
    });
    global.SHORTCUT_QUEST_2026_HINTS = Object.freeze({
      costXP: HINT_COST_XP_2026,
      storageKey: XP_STORAGE_KEY_2026,
      behavior: "remove-one-wrong-answer"
    });
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
    // The 2026 helper loads before the inherited inline runtime. Install economy
    // and 2026-only UI overrides once the parser has finished.
    const installAfterRuntime = () => queueMicrotask(() => {
      install2026EconomyOverrides();
      install2026ButtonChoices();
    });
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", installAfterRuntime, { once: true });
    } else {
      installAfterRuntime();
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