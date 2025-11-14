(function attachSkillHotkeys(global) {
  const data = [
    // 1. Grundlegende Tastenkombinationen sicher anwenden
    { label: "Kopieren (STRG+C)",              keys: ["Control", "C"] },
    { label: "Ausschneiden (STRG+X)",          keys: ["Control", "X"] },
    { label: "Einfügen (STRG+V)",              keys: ["Control", "V"] },
    { label: "Speichern (STRG+S)",             keys: ["Control", "S"] },
    { label: "Rückgängig (STRG+Z)",            keys: ["Control", "Z"] },
    { label: "Wiederholen (STRG+Y)",           keys: ["Control", "Y"] },
    { label: "Alles markieren (STRG+A)",       keys: ["Control", "A"] },
    { label: "Drucken (STRG+P)",               keys: ["Control", "P"] },
    { label: "Suchen (STRG+F)",                keys: ["Control", "F"] },
    { label: "Neue Datei/Fenster (STRG+N)",    keys: ["Control", "N"] },
    { label: "Datei öffnen (STRG+O)",          keys: ["Control", "O"] },
    { label: "Startmenü öffnen (STRG+ESC)",    keys: ["Control", "Escape"] },

    // 2. Navigation & Bedienung des Systems optimieren
    { label: "Zum Dokumentanfang (STRG+Home)", keys: ["Control", "Home"] },
    { label: "Zum Dokumentende (STRG+Ende)",   keys: ["Control", "End"] },
    { label: "Programme wechseln (ALT+TAB)",   keys: ["Alt", "Tab"] },

    // 3. Systemfunktionen direkt über die Tastatur öffnen
    { label: "Task-Manager (STRG+SHIFT+ESC)",  keys: ["Control", "Shift", "Escape"] }
  ];

  global.SKILL_HOTKEY_BLUEPRINTS = data;
})(typeof window !== "undefined" ? window : globalThis);