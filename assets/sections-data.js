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
      title: "4. Coming Soon",
      description: "Hier entsteht ein neues Kapitel. Bald gibt es mehr Übungen.",
      tasks: []
    },
    {
      id: "5",
      tabLabel: "Abschnitt 5",
      title: "5. Coming Soon",
      description: "Dieser Bereich ist in Vorbereitung. Schau bald wieder vorbei.",
      tasks: []
    },
    {
      id: "6",
      tabLabel: "Abschnitt 6",
      title: "6. Coming Soon",
      description: "Noch in Arbeit. Hier warten bald neue Challenges.",
      tasks: []
    },
    {
      id: "7",
      tabLabel: "Abschnitt 7",
      title: "7. Story Modus",
      description: "Hier entsteht das nächste Szenario.",
      tasks: []
    },
    {
      id: "8",
      tabLabel: "Abschnitt 8",
      title: "8. Drag und Drop – Basics",
      description: "Ziehe die Grundkürzel auf die passende Beschreibung.",
      tasks: [
        {
          type: "dnd",
          tokens: ["Ctrl+C", "Ctrl+V", "Ctrl+X", "Ctrl+F", "Ctrl+S", "Ctrl+Z", "Ctrl+A", "Ctrl+N"],
          targets: [
            { label: "Markiertes kopieren", answer: "Ctrl+C" },
            { label: "Markiertes einfügen", answer: "Ctrl+V" },
            { label: "Markiertes ausschneiden", answer: "Ctrl+X" },
            { label: "Inhalt durchsuchen", answer: "Ctrl+F" },
            { label: "Datei speichern", answer: "Ctrl+S" },
            { label: "Aktion rückgängig", answer: "Ctrl+Z" },
            { label: "Alles markieren", answer: "Ctrl+A" },
            { label: "Neues Dokument", answer: "Ctrl+N" }
          ]
        }
      ]
    },
    {
      id: "9",
      tabLabel: "Abschnitt 9",
      title: "9. Drag und Drop – Aufbau",
      description: "Zweite Runde Drag und Drop mit weiteren Kürzeln.",
      tasks: [
        {
          type: "dnd",
          tokens: ["Ctrl+Y", "Ctrl+Shift+Z", "Ctrl+P", "Ctrl+O", "Ctrl+Shift+S", "Ctrl+W", "Ctrl+Shift+N", "Ctrl+B"],
          targets: [
            { label: "Aktion wiederholen", answer: "Ctrl+Y" },
            { label: "Aktion wiederherstellen (Variante)", answer: "Ctrl+Shift+Z" },
            { label: "Drucken", answer: "Ctrl+P" },
            { label: "Dokument öffnen", answer: "Ctrl+O" },
            { label: "Speichern unter", answer: "Ctrl+Shift+S" },
            { label: "Aktuelles Fenster schließen", answer: "Ctrl+W" },
            { label: "Privates Fenster öffnen", answer: "Ctrl+Shift+N" },
            { label: "Text fett formatieren", answer: "Ctrl+B" }
          ]
        }
      ]
    },
    {
      id: "10",
      tabLabel: "Abschnitt 10",
      title: "10. Fast Paced Learning",
      description: "Reagiere innerhalb von 8 Sekunden auf die angezeigte Kombination.",
      fastPaced: {
        rounds: 8,
        timeLimitSeconds: 8,
        optionsPerRound: 4,
        combos: [
          { label: "Kopieren", combo: "Ctrl+C" },
          { label: "Einfügen", combo: "Ctrl+V" },
          { label: "Ausschneiden", combo: "Ctrl+X" },
          { label: "Alles markieren", combo: "Ctrl+A" },
          { label: "Dokument speichern", combo: "Ctrl+S" },
          { label: "Rückgängig", combo: "Ctrl+Z" },
          { label: "Wiederholen", combo: "Ctrl+Y" },
          { label: "Neuer Tab", combo: "Ctrl+N" },
          { label: "Suche öffnen", combo: "Ctrl+F" },
          { label: "Drucken", combo: "Ctrl+P" },
          { label: "Speichern unter", combo: "Ctrl+Shift+S" },
          { label: "Dokument öffnen", combo: "Ctrl+O" }
        ]
      },
      tasks: [],
      hideActions: true
    },
    {
      id: "11",
      tabLabel: "Abschnitt 11",
      title: "11. Lückentext – Bühne",
      description: "Szenen rund um Sofias Präsentation.",
      narrative: {
        autoCheck: false,
        entries: [
          {
            scene: "Sofia bereitet ihre Präsentation vor und will die Änderungen sofort sichern.",
            prompt: "Sofia drückt ____ + ____ um ihr Dokument zu sichern.",
            missingSlots: 2,
            options: [
              { label: "Ctrl", value: "Ctrl" },
              { label: "Alt", value: "Alt" },
              { label: "Shift", value: "Shift" },
              { label: "S", value: "S" },
              { label: "P", value: "P" },
              { label: "T", value: "T" }
            ],
            answers: ["Ctrl", "S"]
          },
          {
            scene: "Sofia ist an der Reihe mit Präsentieren und möchte die anderen nicht warten lassen.",
            prompt: "Sie drückt ____ um die Präsentation sofort zu starten.",
            missingSlots: 1,
            options: [
              { label: "F5", value: "F5" },
              { label: "Shift+F5", value: "Shift+F5" },
              { label: "Ctrl", value: "Ctrl" },
              { label: "Alt", value: "Alt" }
            ],
            answers: ["F5"]
          },
          {
            scene: "Die Pause klingelt, Sofia schließt das PowerPoint blitzschnell.",
            prompt: "Sie beendet das Programm mit ____ + ____.",
            missingSlots: 2,
            options: [
              { label: "Alt", value: "Alt" },
              { label: "F4", value: "F4" },
              { label: "Tab", value: "Tab" },
              { label: "Esc", value: "Esc" },
              { label: "Shift", value: "Shift" }
            ],
            answers: ["Alt", "F4"]
          }
        ]
      },
      tasks: []
    },
    {
      id: "12",
      tabLabel: "Abschnitt 12",
      title: "12. Lückentext – Fokus",
      description: "Schneller Wechsel und sofortige Kontrolle.",
      narrative: {
        autoCheck: false,
        entries: [
          {
            scene: "Nach dem Meeting sperrt Sofia ihren Rechner, bevor sie den Raum verlässt.",
            prompt: "Sie sichert den Bildschirm mit ____ + ____.",
            missingSlots: 2,
            options: [
              { label: "Win", value: "Win" },
              { label: "L", value: "L" },
              { label: "K", value: "K" },
              { label: "Alt", value: "Alt" },
              { label: "P", value: "P" }
            ],
            answers: ["Win", "L"]
          },
          {
            scene: "Im Büro muss Jonas rasch zwischen Chat und Terminal wechseln.",
            prompt: "Er drückt ____ + ____ um die Anwendung zu wechseln.",
            missingSlots: 2,
            options: [
              { label: "Alt", value: "Alt" },
              { label: "Tab", value: "Tab" },
              { label: "Ctrl", value: "Ctrl" },
              { label: "Esc", value: "Esc" },
              { label: "Win", value: "Win" }
            ],
            answers: ["Alt", "Tab"]
          },
          {
            scene: "Sein Browser ist mit Tabs überfüllt, also öffnet er schnell ein privates Fenster.",
            prompt: "Jonas startet den privaten Modus mit ____ + ____ + ____.",
            missingSlots: 3,
            options: [
              { label: "Ctrl", value: "Ctrl" },
              { label: "Shift", value: "Shift" },
              { label: "N", value: "N" },
              { label: "T", value: "T" },
              { label: "P", value: "P" }
            ],
            answers: ["Ctrl", "Shift", "N"]
          }
        ]
      },
      tasks: []
    },
    {
      id: "13",
      tabLabel: "Abschnitt 13",
      title: "13. Lückentext – Produktivität",
      description: "Beherrsche Emojis, Tools und Mikrofonsteuerung.",
      narrative: {
        autoCheck: false,
        entries: [
          {
            scene: "Kurz vor dem Kundencall merkt Jonas, dass der Bildschirm zu hell ist.",
            prompt: "Er dunkelt schnell ab mit ____ + ____.",
            missingSlots: 2,
            options: [
              { label: "Win", value: "Win" },
              { label: ".", value: "." },
              { label: ",", value: "," },
              { label: "Alt", value: "Alt" }
            ],
            answers: ["Win", "."]
          },
          {
            scene: "Seine Kollegin bittet ihn, die Bildschirm-Tastatur kurz einzublenden.",
            prompt: "Er öffnet sie mit ____ + ____ + ____.",
            missingSlots: 3,
            options: [
              { label: "Win", value: "Win" },
              { label: "Ctrl", value: "Ctrl" },
              { label: "O", value: "O" },
              { label: "Shift", value: "Shift" },
              { label: "K", value: "K" }
            ],
            answers: ["Win", "Ctrl", "O"]
          },
          {
            scene: "Während des Daily-Standups muss Jonas sein Mikro sofort muten.",
            prompt: "Er nutzt ____ + ____ + ____ um das Mikro zu steuern.",
            missingSlots: 3,
            options: [
              { label: "Ctrl", value: "Ctrl" },
              { label: "Shift", value: "Shift" },
              { label: "M", value: "M" },
              { label: "Alt", value: "Alt" },
              { label: "V", value: "V" }
            ],
            answers: ["Ctrl", "Shift", "M"]
          }
        ]
      },
      tasks: []
    },
    {
      id: "14",
      tabLabel: "Abschnitt 14",
      title: "14. Lückentext – Kontrolle",
      description: "Fenster arrangieren und Tools sofort öffnen.",
      narrative: {
        autoCheck: false,
        entries: [
          {
            scene: "Nach Feierabend sichert Jonas seinen Rechner im Vorbeigehen.",
            prompt: "Der Bildschirm wird gesperrt mit ____ + ____.",
            missingSlots: 2,
            options: [
              { label: "Win", value: "Win" },
              { label: "L", value: "L" },
              { label: "Ctrl", value: "Ctrl" },
              { label: "S", value: "S" },
              { label: "Q", value: "Q" }
            ],
            answers: ["Win", "L"]
          },
          {
            scene: "Er möchte zwei Fenster nebeneinander platzieren, um Zahlen zu vergleichen.",
            prompt: "Jonas dockt das aktuelle Fenster mit ____ + ____ an die linke Seite.",
            missingSlots: 2,
            options: [
              { label: "Win", value: "Win" },
              { label: "Left", value: "Left" },
              { label: "Right", value: "Right" },
              { label: "Up", value: "Up" }
            ],
            answers: ["Win", "Left"]
          },
          {
            scene: "Eine App hängt komplett, also ruft er den Task-Manager auf.",
            prompt: "Er öffnet ihn mit ____ + ____ + ____.",
            missingSlots: 3,
            options: [
              { label: "Ctrl", value: "Ctrl" },
              { label: "Shift", value: "Shift" },
              { label: "Esc", value: "Esc" },
              { label: "Alt", value: "Alt" }
            ],
            answers: ["Ctrl", "Shift", "Esc"]
          }
        ]
      },
      tasks: []
    },
    {
      id: "21",
      tabLabel: "Abschnitt 21",
      title: "21. Combo Builder",
      description: "Baue komplette Tastenkombinationen aus einzelnen Tastenbausteinen.",
      comboBuilder: {
        title: "Combo Builder",
        instructions: "Wähle für jede Aufgabe die richtigen Tasten in der richtigen Reihenfolge. Jede Auswahl repräsentiert einen Teil der Combo.",
        defaultOptions: ["Ctrl", "Shift", "Win", "Esc", "D", "S"],
        combos: [
          {
            title: "Task-Manager-Notfall",
            prompt: "Eine App reagiert nicht mehr – welche Combo öffnet sofort den Task-Manager?",
            answers: ["Ctrl", "Shift", "Esc"]
          },
          {
            title: "Screenshot-Sniper",
            prompt: "Du willst nur einen Ausschnitt des Bildschirms speichern.",
            answers: ["Win", "Shift", "S"]
          },
          {
            title: "Sofort sperren",
            prompt: "Schütze den Arbeitsplatz schnell – welche Combo sperrt den Bildschirm?",
            answers: ["Win", "L"]
          }
        ]
      },
      tasks: []
    },
    {
      id: "22",
      tabLabel: "Abschnitt 22",
      title: "22. Combo Builder – Fokus",
      description: "Weitere Kombos in kleineren Häppchen trainieren.",
      comboBuilder: {
        title: "Combo Builder",
        instructions: "Wähle für jede Aufgabe die richtigen Tasten in der richtigen Reihenfolge. Jede Auswahl repräsentiert einen Teil der Combo.",
        defaultOptions: ["Ctrl", "Shift", "Win", ".", "Z", "N"],
        combos: [
          {
            title: "Emoji Express",
            prompt: "Öffne das Emoji-Panel, um Reaktionen einzufügen.",
            answers: ["Win", "."]
          },
          {
            title: "Snap Layout Studio",
            prompt: "Starte die Windows-Snap-Layouts, um Fenster perfekt auszurichten.",
            answers: ["Win", "Z"]
          },
          {
            title: "Privacy Booster",
            prompt: "Schalte im Browser sofort in ein privates Fenster.",
            answers: ["Ctrl", "Shift", "N"]
          }
        ]
      },
      tasks: []
    }

  ];

  global.LEARN_SECTION_BLUEPRINTS = sections;
})(typeof window !== "undefined" ? window : globalThis);
