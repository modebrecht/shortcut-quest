(() => {
  const STORAGE_KEY = "shortcutQuestColorPrefs";
  const root = document.documentElement;

  const defaults = {
    good: normalizeHex(readCssVariable("--good")) || "#22c55e",
    bad: normalizeHex(readCssVariable("--bad")) || "#f87171"
  };

  function getReportStatusColors() {
    const styles = getComputedStyle(root);
    const goodColor = styles.getPropertyValue("--good").trim() || "#22c55e";
    const badColor = styles.getPropertyValue("--bad").trim() || "#f87171";
    return [goodColor, badColor];
  }

  function updateReportStatusColors(goodColor, badColor) {
    const [fallbackGood, fallbackBad] = getReportStatusColors();
    const resolvedGood = goodColor || fallbackGood;
    const resolvedBad = badColor || fallbackBad;
    if (!Array.isArray(window.activeReportCharts)) return;
    window.activeReportCharts.forEach(chart => {
      if (!chart || !chart.w || !chart.w.config) return;
      const series = Array.isArray(chart.w.config.series) ? chart.w.config.series : [];
      const hasStatusSeries =
        series.length === 2 &&
        series.every(entry => entry && (entry.name === "Richtig" || entry.name === "Falsch"));
      if (!hasStatusSeries) return;
      chart.updateOptions({ colors: [resolvedGood, resolvedBad] }, false, true);
    });
  }

  window.getReportStatusColors = getReportStatusColors;
  window.updateReportStatusColors = updateReportStatusColors;

  function normalizeHex(value) {
    if (typeof value !== "string") return "";
    const trimmed = value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
      return trimmed.toLowerCase();
    }
    if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
      return (
        "#" +
        trimmed[1] + trimmed[1] +
        trimmed[2] + trimmed[2] +
        trimmed[3] + trimmed[3]
      ).toLowerCase();
    }
    return "";
  }

  function hexToRgba(hex, alpha) {
    const normalized = normalizeHex(hex);
    if (!normalized) return "";
    const r = parseInt(normalized.slice(1, 3), 16);
    const g = parseInt(normalized.slice(3, 5), 16);
    const b = parseInt(normalized.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function readCssVariable(token) {
    const styles = getComputedStyle(root);
    return (styles.getPropertyValue(token) || "").trim();
  }

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function savePrefs(colors) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
    } catch {
      /* ignore write issues */
    }
  }

  function applyPalette(colors, options = {}) {
    const good = normalizeHex(colors.good) || defaults.good;
    const bad = normalizeHex(colors.bad) || defaults.bad;
    root.style.setProperty("--good", good);
    root.style.setProperty("--good-soft", hexToRgba(good, 0.15));
    root.style.setProperty("--bad", bad);
    root.style.setProperty("--bad-soft", hexToRgba(bad, 0.18));
    if (!options.skipSave) {
      savePrefs({ good, bad });
    }
    if (!options.silent && typeof window.updateReportStatusColors === "function") {
      window.updateReportStatusColors(good, bad);
    }
  }

  function init() {
    const chooser = document.getElementById("colorChooser");
    if (!chooser) return;
    const toggle = document.getElementById("colorChooserToggle");
    const closeBtn = document.getElementById("colorChooserClose");
    const goodInput = document.getElementById("colorChooserCorrect");
    const badInput = document.getElementById("colorChooserIncorrect");
    if (!toggle || !goodInput || !badInput) return;

    const stored = loadPrefs();
    const current = {
      good: normalizeHex(stored.good) || defaults.good,
      bad: normalizeHex(stored.bad) || defaults.bad
    };

    goodInput.value = current.good;
    badInput.value = current.bad;
    applyPalette(current, { silent: true, skipSave: true });

    const setOpen = (open) => {
      chooser.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };

    toggle.addEventListener("click", () => {
      const next = !chooser.classList.contains("open");
      setOpen(next);
    });

    closeBtn?.addEventListener("click", () => setOpen(false));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && chooser.classList.contains("open")) {
        setOpen(false);
      }
    });

    const handleInput = (type, value, input) => {
      const normalized = normalizeHex(value);
      if (!normalized) return;
      current[type] = normalized;
      input.value = normalized;
      applyPalette(current);
    };

    goodInput.addEventListener("input", (event) => {
      handleInput("good", event.target.value, goodInput);
    });

    badInput.addEventListener("input", (event) => {
      handleInput("bad", event.target.value, badInput);
    });
  }

  window.addEventListener("DOMContentLoaded", init);
})();
