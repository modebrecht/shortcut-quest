// Blueprint für die Lern-Abschnitte auf der Startseite.
// Die Struktur ist bewusst simpel gehalten, damit später weitere
// Abschnitte nur hier erweitert werden müssen.
(function attachSectionBlueprints(global) {
  const sections = [
    {
      id: "1",
      tabLabel: "Abschnitt 1",
      title: "1. Selber tippen",
      description: "Schreibe jedes Tastenkürzel exakt in das Feld.",
      tasks: [
        {
          type: "input",
          prompt: "1. Drucken",
          answer: "Ctrl+P",
          hint: "Ctrl+P"
        },
        {
          type: "input",
          prompt: "2. Neuer Tab",
          answer: "Ctrl+N",
          hint: "Ctrl+N"
        },
        {
          type: "input",
          prompt: "3. Fenster schließen",
          answer: "Ctrl+W",
          hint: "Ctrl+W"
        },
        {
          type: "input",
          prompt: "4. Speichern unter",
          answer: "Ctrl+Shift+S",
          hint: "Ctrl+Shift+S"
        },
        {
          type: "input",
          prompt: "5. Alles markieren",
          answer: "Ctrl+A",
          hint: "Ctrl+A"
        },
        {
          type: "input",
          prompt: "6. Suche öffnen",
          answer: "Ctrl+F",
          hint: "Ctrl+F"
        },
        {
          type: "input",
          prompt: "7. Wiederholen",
          answer: "Ctrl+Y",
          hint: "Ctrl+Y"
        },
        {
          type: "input",
          prompt: "8. Fett formatieren",
          answer: "Ctrl+B",
          hint: "Ctrl+B"
        }
      ]
    },
    {
      id: "2",
      tabLabel: "Abschnitt 2",
      title: "2. Grundlagen",
      description: "Wähle das passende Tastenkürzel für die Aktion.",
      tasks: [
        {
          type: "select",
          prompt: "9. Kopieren",
          answer: "Ctrl+C",
          options: ["Ctrl+X", "Ctrl+C", "Ctrl+V"]
        },
        {
          type: "select",
          prompt: "10. Einfügen",
          answer: "Ctrl+V",
          options: ["Ctrl+S", "Ctrl+V", "Ctrl+Z"]
        },
        {
          type: "select",
          prompt: "11. Ausschneiden",
          answer: "Ctrl+X",
          options: ["Ctrl+X", "Ctrl+C", "Ctrl+V"]
        },
        {
          type: "select",
          prompt: "12. Alles markieren",
          answer: "Ctrl+A",
          options: ["Ctrl+P", "Ctrl+A", "Ctrl+F"]
        },
        {
          type: "select",
          prompt: "13. Speichern",
          answer: "Ctrl+S",
          options: ["Ctrl+S", "Ctrl+O", "Ctrl+Shift+S"]
        },
        {
          type: "select",
          prompt: "14. Neues Dokument",
          answer: "Ctrl+N",
          options: ["Ctrl+O", "Ctrl+N", "Ctrl+P"]
        },
        {
          type: "select",
          prompt: "15. Drucken",
          answer: "Ctrl+P",
          options: ["Ctrl+P", "Ctrl+Shift+P", "Ctrl+F"]
        },
        {
          type: "select",
          prompt: "16. Rückgängig",
          answer: "Ctrl+Z",
          options: ["Ctrl+Z", "Ctrl+Y", "Ctrl+Shift+Z"]
        }
      ]
    },
    {
      id: "3",
      tabLabel: "Abschnitt 3",
      title: "3. Windows Navigation",
      description: "Gib Tastenkombinationen mit der Win-Taste ein.",
      tasks: [
        { type: "input", prompt: "17. Desktop anzeigen", answer: "Win+D", hint: "Win+D" },
        { type: "input", prompt: "18. Einstellungen öffnen", answer: "Win+I", hint: "Win+I" },
        { type: "input", prompt: "19. Explorer starten", answer: "Win+E", hint: "Win+E" },
        { type: "input", prompt: "20. Task-Ansicht", answer: "Win+Tab", hint: "Win+Tab" },
        { type: "input", prompt: "21. Fenster fix nach links", answer: "Win+Left", hint: "Win+Left" },
        { type: "input", prompt: "22. Fenster fix nach rechts", answer: "Win+Right", hint: "Win+Right" },
        { type: "input", prompt: "23. Schnellmenü", answer: "Win+X", hint: "Win+X" },
        { type: "input", prompt: "24. Ausführen öffnen", answer: "Win+R", hint: "Win+R" }
      ]
    },
    {
      id: "4",
      tabLabel: "Abschnitt 4",
      title: "4. Drag und Drop",
      description: "Ziehe jedes Tastenkürzel auf die passende Beschreibung.",
      tasks: [
        {
          type: "dnd",
          tokens: ["Ctrl+C", "Ctrl+V", "Ctrl+X", "Ctrl+F", "Ctrl+S"],
          targets: [
            { label: "Markiertes kopieren", answer: "Ctrl+C" },
            { label: "Markiertes einfügen", answer: "Ctrl+V" },
            { label: "Markiertes ausschneiden", answer: "Ctrl+X" },
            { label: "Inhalt durchsuchen", answer: "Ctrl+F" },
            { label: "Datei speichern", answer: "Ctrl+S" }
          ]
        }
      ]
    }
  ];

  global.LEARN_SECTION_BLUEPRINTS = sections;
})(typeof window !== "undefined" ? window : globalThis);
