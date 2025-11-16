(function attachSkillHotkeys(global) {
  const data = [
    // 1. Grundlegende Tastenkombinationen sicher anwenden
    { label: "Kopieren (CTRL+C)",              keys: ["Control", "C"] },
    { label: "Ausschneiden (CTRL+X)",          keys: ["Control", "X"] },
    { label: "Einfügen (CTRL+V)",              keys: ["Control", "V"] },
    { label: "Speichern (CTRL+S)",             keys: ["Control", "S"] },
    { label: "Rückgängig (CTRL+Z)",            keys: ["Control", "Z"] },
    { label: "Wiederholen (CTRL+Y)",           keys: ["Control", "Y"] },
    { label: "Alles markieren (CTRL+A)",       keys: ["Control", "A"] },
    { label: "Drucken (CTRL+P)",               keys: ["Control", "P"] },
    { label: "Suchen (CTRL+F)",                keys: ["Control", "F"] },
    { label: "Datei öffnen (CTRL+O)",          keys: ["Control", "O"] },
    // 2. Navigation & Bedienung des Systems optimieren
    { label: "Zum Dokumentanfang (CTRL+Home)", keys: ["Control", "Home"] },
    { label: "Zum Dokumentende (CTRL+Ende)",   keys: ["Control", "End"] }
  ];

  global.SKILL_HOTKEY_BLUEPRINTS = data;
})(typeof window !== "undefined" ? window : globalThis);
