// Shortcut Quest 2026 — TK2 A8 curated learning path
// 30 sections. Memory is intentionally excluded because TK2 A7 already uses Memory.
(function attachSectionBlueprints(global) {
  const sections = [
    {
      id: "1", tabLabel: "Abschnitt 1", title: "1. Warm-up – Grundlagen", description: "Starte mit den wichtigsten allgemeinen Tastenkürzeln.",
      tasks: [
        { type: "input", prompt: "Kopieren", answer: "Ctrl+C" },
        { type: "input", prompt: "Einfügen", answer: "Ctrl+V" },
        { type: "input", prompt: "Ausschneiden", answer: "Ctrl+X" },
        { type: "input", prompt: "Rückgängig", answer: "Ctrl+Z" },
        { type: "input", prompt: "Speichern", answer: "Ctrl+S" }
      ]
    },
    {
      id: "2", tabLabel: "Abschnitt 2", title: "2. Browser & Tabs", description: "Rufe wichtige Browser-Kürzel aus dem Gedächtnis ab.",
      tasks: [
        { type: "input", prompt: "Neuen Tab öffnen", answer: "Ctrl+T" },
        { type: "input", prompt: "Aktuellen Tab schliessen", answer: "Ctrl+W" },
        { type: "input", prompt: "Adresszeile fokussieren", answer: "Ctrl+L" },
        { type: "input", prompt: "Auf der Seite suchen", answer: "Ctrl+F" }
      ]
    },
    {
      id: "3", tabLabel: "Abschnitt 3", title: "3. Windows Basics", description: "Wähle das passende Windows-Kürzel.",
      tasks: [
        { type: "select", prompt: "Desktop anzeigen", answer: "Win+D", options: ["Win+D","Win+E","Win+V","Alt+Tab"] },
        { type: "select", prompt: "Explorer öffnen", answer: "Win+E", options: ["Win+L","Win+E","Win+D","Win+V"] },
        { type: "select", prompt: "PC sperren", answer: "Win+L", options: ["Win+L","Alt+F4","Win+E","Win+D"] },
        { type: "select", prompt: "Zwischenablage-Verlauf öffnen", answer: "Win+V", options: ["Ctrl+V","Win+V","Win+D","Win+E"] }
      ]
    },
    {
      id: "4", tabLabel: "Abschnitt 4", title: "4. AltGr-Sprint", description: "Ordne Sonderzeichen der passenden Tastenkombination zu.",
      tasks: [
        { type: "select", prompt: "@", answer: "AltGr+2", options: ["AltGr+2","AltGr+3","AltGr+7","AltGr+8"] },
        { type: "select", prompt: "#", answer: "AltGr+3", options: ["AltGr+2","AltGr+3","AltGr+7","AltGr+0"] },
        { type: "select", prompt: "|", answer: "AltGr+7", options: ["AltGr+7","AltGr+8","AltGr+9","AltGr+0"] },
        { type: "select", prompt: "[", answer: "AltGr+8", options: ["AltGr+7","AltGr+8","AltGr+9","AltGr+0"] },
        { type: "select", prompt: "]", answer: "AltGr+9", options: ["AltGr+7","AltGr+8","AltGr+9","AltGr+0"] }
      ]
    },
    {
      id: "5", tabLabel: "Abschnitt 5", title: "5. Mixed Recall", description: "Keine Themenblöcke mehr: tippe gemischte Kürzel selbst ein.",
      tasks: [
        { type: "input", prompt: "Alles markieren", answer: "Ctrl+A" },
        { type: "input", prompt: "Druckdialog öffnen", answer: "Ctrl+P" },
        { type: "input", prompt: "Zwischen Fenstern wechseln", answer: "Alt+Tab" },
        { type: "input", prompt: "Screenshot-Ausschnitt", answer: "Win+Shift+S" },
        { type: "input", prompt: "Fenster schliessen", answer: "Alt+F4" }
      ]
    },
    {
      id: "6", tabLabel: "Abschnitt 6", title: "6. Drag & Drop – Grundlagen", description: "Ziehe die Grundkürzel auf die passende Aktion.",
      tasks: [{ type: "dnd", tokens: ["Ctrl+C","Ctrl+V","Ctrl+X","Ctrl+Z","Ctrl+S","Ctrl+A"], targets: [
        { label: "Kopieren", answer: "Ctrl+C" }, { label: "Einfügen", answer: "Ctrl+V" }, { label: "Ausschneiden", answer: "Ctrl+X" },
        { label: "Rückgängig", answer: "Ctrl+Z" }, { label: "Speichern", answer: "Ctrl+S" }, { label: "Alles markieren", answer: "Ctrl+A" }
      ]}]
    },
    {
      id: "7", tabLabel: "Abschnitt 7", title: "7. Drag & Drop – Browser", description: "Ordne Browser- und Programm-Kürzel zu.",
      tasks: [{ type: "dnd", tokens: ["Ctrl+T","Ctrl+W","Ctrl+L","Ctrl+F","Ctrl+P","Alt+F4"], targets: [
        { label: "Neuer Tab", answer: "Ctrl+T" }, { label: "Tab schliessen", answer: "Ctrl+W" }, { label: "Adresszeile", answer: "Ctrl+L" },
        { label: "Suchen", answer: "Ctrl+F" }, { label: "Drucken", answer: "Ctrl+P" }, { label: "Fenster schliessen", answer: "Alt+F4" }
      ]}]
    },
    {
      id: "8", tabLabel: "Abschnitt 8", title: "8. Drag & Drop – Windows", description: "Ordne Windows-Kürzel ihren Aktionen zu.",
      tasks: [{ type: "dnd", tokens: ["Win+D","Win+E","Win+L","Win+V","Win+Shift+S","Alt+Tab"], targets: [
        { label: "Desktop anzeigen", answer: "Win+D" }, { label: "Explorer öffnen", answer: "Win+E" }, { label: "PC sperren", answer: "Win+L" },
        { label: "Zwischenablage-Verlauf", answer: "Win+V" }, { label: "Screenshot-Ausschnitt", answer: "Win+Shift+S" }, { label: "Fenster wechseln", answer: "Alt+Tab" }
      ]}]
    },
    {
      id: "9", tabLabel: "Abschnitt 9", title: "9. Combo Builder – Allgemein", description: "Baue die Kombinationen aus einzelnen Tastenbausteinen.",
      comboBuilder: { title: "Combo Builder", instructions: "Wähle die richtigen Tasten in der richtigen Reihenfolge.", defaultOptions: ["Ctrl","Shift","C","V","Z","S","T","W","L"], combos: [
        { title: "Kopieren", prompt: "Baue das Kürzel zum Kopieren.", answers: ["Ctrl","C"] },
        { title: "Einfügen", prompt: "Baue das Kürzel zum Einfügen.", answers: ["Ctrl","V"] },
        { title: "Neuer Tab", prompt: "Baue das Kürzel für einen neuen Tab.", answers: ["Ctrl","T"] },
        { title: "Tab schliessen", prompt: "Baue das Kürzel zum Schliessen des Tabs.", answers: ["Ctrl","W"] }
      ]}, tasks: []
    },
    {
      id: "10", tabLabel: "Abschnitt 10", title: "10. Combo Builder – Windows", description: "Baue Windows-Kombinationen aus Tastenbausteinen.",
      comboBuilder: { title: "Windows Builder", instructions: "Setze die komplette Tastenkombination zusammen.", defaultOptions: ["Win","Shift","D","E","L","V","S","Alt","Tab","F4"], combos: [
        { title: "Desktop", prompt: "Desktop anzeigen.", answers: ["Win","D"] },
        { title: "Explorer", prompt: "Explorer öffnen.", answers: ["Win","E"] },
        { title: "Sperren", prompt: "PC sperren.", answers: ["Win","L"] },
        { title: "Screenshot", prompt: "Screenshot-Ausschnitt erstellen.", answers: ["Win","Shift","S"] }
      ]}, tasks: []
    },
    {
      id: "11", tabLabel: "Abschnitt 11", title: "11. Workflow Chain – Recherche", description: "Löse einen Browser-Arbeitsablauf in der richtigen Reihenfolge.",
      comboBuilder: { title: "Workflow Chain", instructions: "Wähle ganze Tastenkürzel in der richtigen Reihenfolge.", defaultOptions: ["Ctrl+T","Ctrl+L","Ctrl+F","Ctrl+W","Ctrl+P","Alt+Tab"], combos: [
        { title: "Recherche starten", prompt: "Neuen Tab öffnen -> Adresszeile fokussieren -> auf der Seite suchen -> Tab schliessen.", answers: ["Ctrl+T","Ctrl+L","Ctrl+F","Ctrl+W"] }
      ]}, tasks: []
    },
    {
      id: "12", tabLabel: "Abschnitt 12", title: "12. Workflow Chain – Dokument", description: "Plane einen kurzen Bearbeitungsablauf mit mehreren Kürzeln.",
      comboBuilder: { title: "Workflow Chain", instructions: "Setze die Arbeitsschritte als Shortcut-Kette zusammen.", defaultOptions: ["Ctrl+A","Ctrl+C","Ctrl+V","Ctrl+S","Ctrl+Z","Ctrl+P"], combos: [
        { title: "Text übernehmen", prompt: "Alles markieren -> kopieren -> einfügen -> speichern.", answers: ["Ctrl+A","Ctrl+C","Ctrl+V","Ctrl+S"] },
        { title: "Fehler korrigieren", prompt: "Letzten Schritt rückgängig machen -> speichern.", answers: ["Ctrl+Z","Ctrl+S"] }
      ]}, tasks: []
    },
    {
      id: "13", tabLabel: "Abschnitt 13", title: "13. Workflow Chain – Windows", description: "Ordne mehrere Systemaktionen zu einem sinnvollen Ablauf.",
      comboBuilder: { title: "Workflow Chain", instructions: "Wähle die kompletten Kürzel in der richtigen Reihenfolge.", defaultOptions: ["Win+E","Alt+Tab","Win+Shift+S","Win+V","Win+D","Win+L"], combos: [
        { title: "Arbeitsplatz", prompt: "Explorer öffnen -> Anwendung wechseln -> Screenshot-Ausschnitt -> PC sperren.", answers: ["Win+E","Alt+Tab","Win+Shift+S","Win+L"] }
      ]}, tasks: []
    },
    {
      id: "14", tabLabel: "Abschnitt 14", title: "14. Szenario – Schulauftrag", description: "Wähle Kürzel in einem typischen Dokument-Arbeitsablauf.",
      narrative: { autoCheck: false, entries: [
        { scene: "Du hast einen Absatz fertig geschrieben und willst sofort sichern.", prompt: "Du speicherst mit ____ + ____.", missingSlots: 2, options: [{label:"Ctrl",value:"Ctrl"},{label:"S",value:"S"},{label:"P",value:"P"},{label:"Z",value:"Z"}], answers: ["Ctrl","S"] },
        { scene: "Du willst den ganzen Text auswählen.", prompt: "Du nutzt ____ + ____.", missingSlots: 2, options: [{label:"Ctrl",value:"Ctrl"},{label:"A",value:"A"},{label:"C",value:"C"},{label:"F",value:"F"}], answers: ["Ctrl","A"] },
        { scene: "Du hast etwas versehentlich gelöscht.", prompt: "Du machst den Schritt rückgängig mit ____ + ____.", missingSlots: 2, options: [{label:"Ctrl",value:"Ctrl"},{label:"Z",value:"Z"},{label:"Y",value:"Y"},{label:"X",value:"X"}], answers: ["Ctrl","Z"] }
      ]}, tasks: []
    },
    {
      id: "15", tabLabel: "Abschnitt 15", title: "15. Szenario – Präsentation", description: "Arbeite während einer Präsentationsvorbereitung effizient.",
      narrative: { autoCheck: false, entries: [
        { scene: "Du brauchst einen Screenshot-Ausschnitt für deine Präsentation.", prompt: "Nutze ____ + ____ + ____.", missingSlots: 3, options: [{label:"Win",value:"Win"},{label:"Shift",value:"Shift"},{label:"S",value:"S"},{label:"Ctrl",value:"Ctrl"}], answers: ["Win","Shift","S"] },
        { scene: "Du wechselst kurz vom Browser zurück zur Präsentation.", prompt: "Nutze ____ + ____.", missingSlots: 2, options: [{label:"Alt",value:"Alt"},{label:"Tab",value:"Tab"},{label:"Win",value:"Win"},{label:"Esc",value:"Esc"}], answers: ["Alt","Tab"] },
        { scene: "Am Ende schliesst du das aktive Fenster.", prompt: "Nutze ____ + ____.", missingSlots: 2, options: [{label:"Alt",value:"Alt"},{label:"F4",value:"F4"},{label:"Ctrl",value:"Ctrl"},{label:"W",value:"W"}], answers: ["Alt","F4"] }
      ]}, tasks: []
    },
    {
      id: "16", tabLabel: "Abschnitt 16", title: "16. Szenario – System", description: "Reagiere auf typische Windows-Situationen.",
      narrative: { autoCheck: false, entries: [
        { scene: "Du willst schnell zum Desktop.", prompt: "Nutze ____ + ____.", missingSlots: 2, options: [{label:"Win",value:"Win"},{label:"D",value:"D"},{label:"E",value:"E"},{label:"L",value:"L"}], answers: ["Win","D"] },
        { scene: "Du brauchst eine ältere Kopie aus dem Zwischenablage-Verlauf.", prompt: "Nutze ____ + ____.", missingSlots: 2, options: [{label:"Win",value:"Win"},{label:"V",value:"V"},{label:"D",value:"D"},{label:"C",value:"C"}], answers: ["Win","V"] },
        { scene: "Du verlässt den Arbeitsplatz und sperrst den PC.", prompt: "Nutze ____ + ____.", missingSlots: 2, options: [{label:"Win",value:"Win"},{label:"L",value:"L"},{label:"E",value:"E"},{label:"V",value:"V"}], answers: ["Win","L"] }
      ]}, tasks: []
    },
    {
      id: "17", tabLabel: "Abschnitt 17", title: "17. Shortcut Shuffle I", description: "Gemischte Zuordnung ohne Themenblock.",
      tasks: [
        { type: "select", prompt: "Neuer Tab", answer: "Ctrl+T", options: ["Ctrl+T","Ctrl+W","Ctrl+L","Ctrl+F"] },
        { type: "select", prompt: "Explorer", answer: "Win+E", options: ["Win+D","Win+E","Win+L","Win+V"] },
        { type: "select", prompt: "Rückgängig", answer: "Ctrl+Z", options: ["Ctrl+Y","Ctrl+Z","Ctrl+X","Ctrl+S"] },
        { type: "select", prompt: "Fenster wechseln", answer: "Alt+Tab", options: ["Win+D","Alt+Tab","Alt+F4","Ctrl+Tab"] }
      ]
    },
    {
      id: "18", tabLabel: "Abschnitt 18", title: "18. Shortcut Shuffle II", description: "Schwierigere gemischte Zuordnungen.",
      tasks: [
        { type: "select", prompt: "Tab schliessen", answer: "Ctrl+W", options: ["Ctrl+T","Ctrl+W","Alt+F4","Ctrl+F"] },
        { type: "select", prompt: "Fenster schliessen", answer: "Alt+F4", options: ["Ctrl+W","Alt+F4","Alt+Tab","Win+D"] },
        { type: "select", prompt: "Screenshot-Ausschnitt", answer: "Win+Shift+S", options: ["Ctrl+S","Win+Shift+S","Win+S","Ctrl+P"] },
        { type: "select", prompt: "Adresszeile", answer: "Ctrl+L", options: ["Ctrl+F","Ctrl+L","Win+L","Ctrl+T"] }
      ]
    },
    {
      id: "19", tabLabel: "Abschnitt 19", title: "19. Navigation Puzzle", description: "Ordne Navigation und Fenstersteuerung sauber zu.",
      tasks: [{ type: "dnd", tokens: ["Alt+Tab","Win+D","Win+E","Ctrl+L","Ctrl+T","Ctrl+W"], targets: [
        { label: "Anwendung wechseln", answer: "Alt+Tab" }, { label: "Desktop anzeigen", answer: "Win+D" }, { label: "Explorer öffnen", answer: "Win+E" },
        { label: "Browser-Adresszeile", answer: "Ctrl+L" }, { label: "Neuer Tab", answer: "Ctrl+T" }, { label: "Tab schliessen", answer: "Ctrl+W" }
      ]}]
    },
    {
      id: "20", tabLabel: "Abschnitt 20", title: "20. System Quick Access", description: "Wähle direkte Systemzugriffe ohne Umweg über Menüs.",
      tasks: [
        { type: "select", prompt: "Explorer öffnen", answer: "Win+E", options: ["Win+E","Win+D","Win+V","Win+L"] },
        { type: "select", prompt: "PC sperren", answer: "Win+L", options: ["Win+L","Win+E","Alt+F4","Win+D"] },
        { type: "select", prompt: "Zwischenablage-Verlauf", answer: "Win+V", options: ["Ctrl+V","Win+V","Win+E","Win+D"] },
        { type: "select", prompt: "Screenshot-Ausschnitt", answer: "Win+Shift+S", options: ["Ctrl+S","Win+Shift+S","Win+D","Alt+Tab"] }
      ]
    },
    {
      id: "21", tabLabel: "Abschnitt 21", title: "21. No-Hint Recall", description: "Jetzt ohne Auswahl: tippe gemischte Kürzel selbst.",
      tasks: [
        { type: "input", prompt: "Adresszeile fokussieren", answer: "Ctrl+L" },
        { type: "input", prompt: "Zwischenablage-Verlauf", answer: "Win+V" },
        { type: "input", prompt: "Alles markieren", answer: "Ctrl+A" },
        { type: "input", prompt: "Screenshot-Ausschnitt", answer: "Win+Shift+S" },
        { type: "input", prompt: "Fenster wechseln", answer: "Alt+Tab" }
      ]
    },
    {
      id: "22", tabLabel: "Abschnitt 22", title: "22. Fast-Paced Basics", description: "Reagiere schnell auf allgemeine Kürzel.",
      fastPaced: { rounds: 8, timeLimitSeconds: 8, optionsPerRound: 4, combos: [
        { label: "Kopieren", combo: "Ctrl+C" }, { label: "Einfügen", combo: "Ctrl+V" }, { label: "Ausschneiden", combo: "Ctrl+X" },
        { label: "Speichern", combo: "Ctrl+S" }, { label: "Rückgängig", combo: "Ctrl+Z" }, { label: "Alles markieren", combo: "Ctrl+A" }, { label: "Suchen", combo: "Ctrl+F" }
      ]}, tasks: [], hideActions: true
    },
    {
      id: "23", tabLabel: "Abschnitt 23", title: "23. Fast-Paced Browser", description: "Browser und Programme unter Zeitdruck.",
      fastPaced: { rounds: 8, timeLimitSeconds: 7, optionsPerRound: 4, combos: [
        { label: "Neuer Tab", combo: "Ctrl+T" }, { label: "Tab schliessen", combo: "Ctrl+W" }, { label: "Adresszeile", combo: "Ctrl+L" },
        { label: "Suchen", combo: "Ctrl+F" }, { label: "Drucken", combo: "Ctrl+P" }, { label: "Fenster schliessen", combo: "Alt+F4" }
      ]}, tasks: [], hideActions: true
    },
    {
      id: "24", tabLabel: "Abschnitt 24", title: "24. Fast-Paced Windows", description: "Windows-Kürzel unter Zeitdruck.",
      fastPaced: { rounds: 8, timeLimitSeconds: 7, optionsPerRound: 4, combos: [
        { label: "Desktop", combo: "Win+D" }, { label: "Explorer", combo: "Win+E" }, { label: "Sperren", combo: "Win+L" },
        { label: "Zwischenablage", combo: "Win+V" }, { label: "Screenshot", combo: "Win+Shift+S" }, { label: "Fenster wechseln", combo: "Alt+Tab" }
      ]}, tasks: [], hideActions: true
    },
    {
      id: "25", tabLabel: "Abschnitt 25", title: "25. Verwechslungsgefahr", description: "Entscheide zwischen bewusst ähnlichen Kürzeln.",
      tasks: [
        { type: "select", prompt: "Nur den Browser-Tab schliessen", answer: "Ctrl+W", options: ["Ctrl+W","Alt+F4","Ctrl+T","Ctrl+L"] },
        { type: "select", prompt: "Das aktive Fenster schliessen", answer: "Alt+F4", options: ["Ctrl+W","Alt+F4","Alt+Tab","Win+D"] },
        { type: "select", prompt: "Adresszeile fokussieren", answer: "Ctrl+L", options: ["Ctrl+L","Win+L","Ctrl+F","Ctrl+T"] },
        { type: "select", prompt: "PC sperren", answer: "Win+L", options: ["Ctrl+L","Win+L","Win+D","Win+E"] },
        { type: "select", prompt: "Einfügen", answer: "Ctrl+V", options: ["Ctrl+V","Win+V","Ctrl+C","Ctrl+X"] },
        { type: "select", prompt: "Zwischenablage-Verlauf", answer: "Win+V", options: ["Ctrl+V","Win+V","Win+D","Win+E"] }
      ]
    },
    {
      id: "26", tabLabel: "Abschnitt 26", title: "26. Advanced Combo Builder", description: "Baue längere und leichter verwechselbare Kombinationen.",
      comboBuilder: { title: "Advanced Builder", instructions: "Baue die vollständige Kombination.", defaultOptions: ["Ctrl","Win","Shift","Alt","S","V","L","Tab","F4"], combos: [
        { title: "Screenshot", prompt: "Screenshot-Ausschnitt.", answers: ["Win","Shift","S"] },
        { title: "Fenster wechseln", prompt: "Zwischen aktiven Anwendungen wechseln.", answers: ["Alt","Tab"] },
        { title: "PC sperren", prompt: "Arbeitsplatz sperren.", answers: ["Win","L"] },
        { title: "Zwischenablage", prompt: "Zwischenablage-Verlauf öffnen.", answers: ["Win","V"] },
        { title: "Fenster schliessen", prompt: "Aktives Fenster schliessen.", answers: ["Alt","F4"] }
      ]}, tasks: []
    },
    {
      id: "27", tabLabel: "Abschnitt 27", title: "27. Workflow Chain Gauntlet", description: "Löse mehrere Arbeitsabläufe mit vollständigen Shortcut-Ketten.",
      comboBuilder: { title: "Workflow Chain Gauntlet", instructions: "Wähle komplette Tastenkürzel in der richtigen Reihenfolge.", defaultOptions: ["Ctrl+T","Ctrl+L","Ctrl+F","Ctrl+W","Ctrl+A","Ctrl+C","Ctrl+V","Ctrl+S","Win+E","Alt+Tab","Win+Shift+S","Win+L"], combos: [
        { title: "Browser", prompt: "Neuer Tab -> Adresszeile -> suchen -> Tab schliessen.", answers: ["Ctrl+T","Ctrl+L","Ctrl+F","Ctrl+W"] },
        { title: "Dokument", prompt: "Alles markieren -> kopieren -> einfügen -> speichern.", answers: ["Ctrl+A","Ctrl+C","Ctrl+V","Ctrl+S"] },
        { title: "Windows", prompt: "Explorer -> Anwendung wechseln -> Screenshot -> sperren.", answers: ["Win+E","Alt+Tab","Win+Shift+S","Win+L"] }
      ]}, tasks: []
    },
    {
      id: "28", tabLabel: "Abschnitt 28", title: "28. Real-World Gauntlet", description: "Mehrere Alltagssituationen direkt hintereinander.",
      narrative: { autoCheck: false, entries: [
        { scene: "Beim Recherchieren brauchst du sofort einen neuen Tab.", prompt: "Nutze ____ + ____.", missingSlots: 2, options: [{label:"Ctrl",value:"Ctrl"},{label:"T",value:"T"},{label:"W",value:"W"},{label:"L",value:"L"}], answers: ["Ctrl","T"] },
        { scene: "Du willst einen Begriff auf der Seite finden.", prompt: "Nutze ____ + ____.", missingSlots: 2, options: [{label:"Ctrl",value:"Ctrl"},{label:"F",value:"F"},{label:"L",value:"L"},{label:"P",value:"P"}], answers: ["Ctrl","F"] },
        { scene: "Du brauchst einen Screenshot-Ausschnitt.", prompt: "Nutze ____ + ____ + ____.", missingSlots: 3, options: [{label:"Win",value:"Win"},{label:"Shift",value:"Shift"},{label:"S",value:"S"},{label:"Ctrl",value:"Ctrl"}], answers: ["Win","Shift","S"] },
        { scene: "Du wechselst zurück zum Dokument.", prompt: "Nutze ____ + ____.", missingSlots: 2, options: [{label:"Alt",value:"Alt"},{label:"Tab",value:"Tab"},{label:"Win",value:"Win"},{label:"F4",value:"F4"}], answers: ["Alt","Tab"] },
        { scene: "Fertig: du speicherst.", prompt: "Nutze ____ + ____.", missingSlots: 2, options: [{label:"Ctrl",value:"Ctrl"},{label:"S",value:"S"},{label:"P",value:"P"},{label:"Z",value:"Z"}], answers: ["Ctrl","S"] }
      ]}, tasks: []
    },
    {
      id: "29", tabLabel: "Abschnitt 29", title: "29. Mastery Sprint", description: "Eine schnelle gemischte Runde kurz vor dem Finale.",
      fastPaced: { rounds: 12, timeLimitSeconds: 6, optionsPerRound: 5, combos: [
        { label: "Kopieren", combo: "Ctrl+C" }, { label: "Einfügen", combo: "Ctrl+V" }, { label: "Rückgängig", combo: "Ctrl+Z" },
        { label: "Speichern", combo: "Ctrl+S" }, { label: "Neuer Tab", combo: "Ctrl+T" }, { label: "Tab schliessen", combo: "Ctrl+W" },
        { label: "Adresszeile", combo: "Ctrl+L" }, { label: "Desktop", combo: "Win+D" }, { label: "Explorer", combo: "Win+E" },
        { label: "Sperren", combo: "Win+L" }, { label: "Zwischenablage", combo: "Win+V" }, { label: "Screenshot", combo: "Win+Shift+S" },
        { label: "Fenster wechseln", combo: "Alt+Tab" }, { label: "Fenster schliessen", combo: "Alt+F4" }
      ]}, tasks: [], hideActions: true
    },
    {
      id: "30", tabLabel: "Abschnitt 30", title: "30. Final Mastery", description: "Der letzte gemischte Check vor dem finalen Battle.",
      tasks: [
        { type: "input", prompt: "Kopieren", answer: "Ctrl+C" },
        { type: "input", prompt: "Neuer Tab", answer: "Ctrl+T" },
        { type: "input", prompt: "Adresszeile", answer: "Ctrl+L" },
        { type: "input", prompt: "Explorer öffnen", answer: "Win+E" },
        { type: "input", prompt: "PC sperren", answer: "Win+L" },
        { type: "input", prompt: "Screenshot-Ausschnitt", answer: "Win+Shift+S" },
        { type: "input", prompt: "Zwischen Fenstern wechseln", answer: "Alt+Tab" },
        { type: "input", prompt: "Aktives Fenster schliessen", answer: "Alt+F4" }
      ]
    }
  ];

  global.LEARN_SECTION_BLUEPRINTS = sections;
})(typeof window !== "undefined" ? window : globalThis);
