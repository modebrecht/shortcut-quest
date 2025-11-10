(function attachSkillHotkeys(global) {
  const data = [
    { label: "Arbeitsbereich markieren", keys: ["Control", "Alt", "A"] },
    { label: "Teamchat öffnen", keys: ["Control", "Alt", "C"] },
    { label: "Dashboard anzeigen", keys: ["Control", "Alt", "D"] },
    { label: "Explorer einblenden", keys: ["Control", "Alt", "E"] },
    { label: "Suche fokussieren", keys: ["Control", "Alt", "F"] },
    { label: "Git-Panel öffnen", keys: ["Control", "Alt", "G"] },
    { label: "History prüfen", keys: ["Control", "Alt", "H"] },
    { label: "Journal anzeigen", keys: ["Control", "Alt", "J"] },
    { label: "Shortcut-Liste", keys: ["Control", "Alt", "K"] },
    { label: "Logbuch öffnen", keys: ["Control", "Alt", "L"] },
    { label: "Markdown-Vorschau", keys: ["Control", "Alt", "M"] },
    { label: "Navigator laden", keys: ["Control", "Alt", "N"] },
    { label: "Objekt suchen", keys: ["Control", "Alt", "O"] },
    { label: "Quick-Befehle", keys: ["Control", "Alt", "Q"] },
    { label: "Neu laden", keys: ["Control", "Alt", "R"] },
    { label: "Schnellspeichern", keys: ["Control", "Alt", "S"] },
    { label: "Terminal starten", keys: ["Control", "Alt", "T"] },
    { label: "Übersicht öffnen", keys: ["Control", "Alt", "U"] },
    { label: "Zwischenablage prüfen", keys: ["Control", "Alt", "V"] },
    { label: "Workspace wechseln", keys: ["Control", "Alt", "W"] },
    { label: "Extra ausschneiden", keys: ["Control", "Alt", "X"] },
    { label: "Wiederholen Plus", keys: ["Control", "Alt", "Y"] },
    { label: "Zoom-Reset", keys: ["Control", "Alt", "0"] },
    { label: "Branch wechseln", keys: ["Control", "Alt", "B"] },
    { label: "Tab schließen", keys: ["Control", "Alt", "Shift", "X"] },
    { label: "Lesezeichen merken", keys: ["Control", "Alt", "Shift", "B"] },
    { label: "Debug starten", keys: ["Control", "Alt", "Shift", "D"] },
    { label: "Format anwenden", keys: ["Control", "Alt", "Shift", "F"] },
    { label: "Kommentar einfügen", keys: ["Control", "Alt", "Shift", "M"] },
    { label: "Notizmodus", keys: ["Control", "Alt", "Shift", "N"] }
  ];

  global.SKILL_HOTKEY_BLUEPRINTS = data;
})(typeof window !== "undefined" ? window : globalThis);
