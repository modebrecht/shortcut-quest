// Blueprint für die Lern-Abschnitte auf der Startseite.
// Die Struktur ist bewusst simpel gehalten, damit später weitere
// Abschnitte nur hier erweitert werden müssen.
(function attachSectionBlueprints(global) {
  const sections = [
    {
      id: "1",
      tabLabel: "Abschnitt 1",
      title: "1. Grundlagen",
      description: "Wähle das passende Tastenkürzel für die Aktion.",
      tasks: [
        {
          type: "select",
          prompt: "1. Kopieren",
          answer: "Ctrl+C",
          options: ["Ctrl+X", "Ctrl+C", "Ctrl+V"]
        },
        {
          type: "select",
          prompt: "2. Einfügen",
          answer: "Ctrl+V",
          options: ["Ctrl+S", "Ctrl+V", "Ctrl+Z"]
        },
        {
          type: "select",
          prompt: "3. Alles markieren",
          answer: "Ctrl+A",
          options: ["Ctrl+P", "Ctrl+A", "Ctrl+F"]
        }
      ]
    },
    {
      id: "2",
      tabLabel: "Abschnitt 2",
      title: "2. Werkzeuge",
      description: "Welches Tastenkürzel passt zur Beschreibung?",
      tasks: [
        {
          type: "select",
          prompt: "4. Dokument speichern",
          answer: "Ctrl+S",
          options: ["Ctrl+S", "Ctrl+O", "Ctrl+Shift+S"]
        },
        {
          type: "select",
          prompt: "5. Rückgängig",
          answer: "Ctrl+Z",
          options: ["Ctrl+Z", "Ctrl+Y", "Ctrl+R"]
        },
        {
          type: "select",
          prompt: "6. Im Text suchen",
          answer: "Ctrl+F",
          options: ["Ctrl+F", "Ctrl+P", "Ctrl+Shift+F"]
        }
      ]
    },
    {
      id: "3",
      tabLabel: "Abschnitt 3",
      title: "3. Selber tippen",
      description: "Schreibe das Tastenkürzel exakt in das Feld.",
      tasks: [
        {
          type: "input",
          prompt: "7. Drucken",
          answer: "Ctrl+P",
          placeholder: "z. B. Ctrl+P"
        },
        {
          type: "input",
          prompt: "8. Wiederholen",
          answer: "Ctrl+Y",
          placeholder: "z. B. Ctrl+Y"
        },
        {
          type: "input",
          prompt: "9. Neuer Tab",
          answer: "Ctrl+N",
          placeholder: "z. B. Ctrl+N"
        }
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
