// Blueprint für die Lern-Abschnitte auf der Startseite.
// Die Struktur ist bewusst simpel gehalten, damit später weitere
// Abschnitte nur hier erweitert werden müssen.
(function attachSectionBlueprints(global) {
  const sections = [
    {
      id: "1",
      tabLabel: "Abschnitt 1",
      title: "1. Selber tippen",
      description: "Löse die ersten vier Kürzel, um dein Muscle Memory aufzuwärmen.",
      tasks: [
        {
          type: "input",
          prompt: "Drucken",
          answer: "Ctrl+P",
          hint: "Ctrl+P"
        },
        {
          type: "input",
          prompt: "Neuer Tab",
          answer: "Ctrl+N",
          hint: "Ctrl+N"
        },
        {
          type: "input",
          prompt: "Fenster schließen",
          answer: "Ctrl+W",
          hint: "Ctrl+W"
        },
        {
          type: "input",
          prompt: "Screenshot-Ausschnitt",
          answer: "Win+Shift+S",
          hint: "Win+Shift+S"
        }
      ]
    },
    {
      id: "2",
      tabLabel: "Abschnitt 2",
      title: "2. Grundlagen – Basics",
      description: "Wähle das passende Tastenkürzel für die Aktion.",
      tasks: [
        {
          type: "select",
          prompt: "Kopieren",
          answer: "Ctrl+C",
          options: ["Ctrl+X", "Ctrl+C", "Ctrl+V", "Ctrl+Shift+C", "Ctrl+Alt+C"]
        },
        {
          type: "select",
          prompt: "Einfügen",
          answer: "Ctrl+V",
          options: ["Ctrl+S", "Ctrl+V", "Ctrl+Z", "Ctrl+Shift+V", "Ctrl+Alt+V"]
        },
        {
          type: "select",
          prompt: "Ausschneiden",
          answer: "Ctrl+X",
          options: ["Ctrl+X", "Ctrl+C", "Ctrl+V", "Ctrl+Shift+X", "Ctrl+Alt+X"]
        },
        {
          type: "select",
          prompt: "Alles markieren",
          answer: "Ctrl+A",
          options: ["Ctrl+P", "Ctrl+A", "Ctrl+F", "Ctrl+Shift+A", "Ctrl+Alt+A"]
        }
      ]
    },
    {
      id: "3",
      tabLabel: "Abschnitt 3",
      title: "3. Shortcut Memory",
      description: "Es gibt 6 Paare. Finde immer die passende Beschreibung zur Tastenkombination.",
      memoryGame: {
        title: "3. Shortcut Memory",
        pairs: [
          { id: "copy", cards: ["Kopieren", "Ctrl+C"] },
          { id: "paste", cards: ["Einfügen", "Ctrl+V"] },
          { id: "cut", cards: ["Ausschneiden", "Ctrl+X"] },
          { id: "undo", cards: ["Rückgängig", "Ctrl+Z"] },
          { id: "save", cards: ["Speichern", "Ctrl+S"] },
          { id: "selectall", cards: ["Alles markieren", "Ctrl+A"] }
        ]
      },
      tasks: []
    },
    {
      id: "4",
      tabLabel: "Abschnitt 4",
      title: "4. Grundlagen – Aufbau",
      description: "Noch vier weitere Klassiker für sichere Copy-&-Save-Skills.",
      tasks: [
        {
          type: "select",
          prompt: "Speichern",
          answer: "Ctrl+S",
          options: ["Ctrl+S", "Ctrl+O", "Win+Shift+S", "Ctrl+Alt+S", "Ctrl+P"]
        },
        {
          type: "select",
          prompt: "Neues Dokument",
          answer: "Ctrl+N",
          options: ["Ctrl+O", "Ctrl+N", "Ctrl+P", "Ctrl+Shift+N", "Ctrl+Alt+N"]
        },
        {
          type: "select",
          prompt: "Drucken",
          answer: "Ctrl+P",
          options: ["Ctrl+P", "Ctrl+Shift+P", "Ctrl+F", "Ctrl+Alt+P", "Ctrl+Shift+F"]
        },
        {
          type: "select",
          prompt: "Rückgängig",
          answer: "Ctrl+Z",
          options: ["Ctrl+Z", "Ctrl+Y", "Ctrl+Shift+Z", "Ctrl+Alt+Z", "Ctrl+Shift+Y"]
        }
      ]
    },
    {
      id: "5",
      tabLabel: "Abschnitt 5",
      title: "5. Selber tippen – Teil 2",
      description: "Die zweite Hälfte deiner Tipparbeit: sichere dir die restlichen wichtigen Kürzel.",
      tasks: [
        {
          type: "select",
          prompt: "Alles markieren",
          answer: "Ctrl+A",
          options: ["Ctrl+A", "Ctrl+C", "Ctrl+V", "Ctrl+S", "Ctrl+P"]
        },
        {
          type: "select",
          prompt: "Suche öffnen",
          answer: "Ctrl+F",
          options: ["Ctrl+F", "Ctrl+H", "Ctrl+G", "Ctrl+Space", "Ctrl+Shift+F"]
        },
        {
          type: "select",
          prompt: "Wiederholen",
          answer: "Ctrl+Y",
          options: ["Ctrl+Y", "Ctrl+Z", "Ctrl+Shift+Z", "Ctrl+R", "Ctrl+Q"]
        },
        {
          type: "select",
          prompt: "Fett formatieren",
          answer: "Ctrl+B",
          options: ["Ctrl+B", "Ctrl+I", "Ctrl+U", "Ctrl+Shift+B", "Ctrl+T"]
        }
      ]
    },
    {
      id: "6",
      tabLabel: "Abschnitt 6",
      title: "6. Quick Wins",
      description: "Ein Überraschungs-Mix aus Kombinationen, die im Alltag immer wieder helfen.",
      tasks: [
        {
          type: "input",
          prompt: "Browser-Tab wechseln",
          answer: "Ctrl+Tab",
          hint: "Ctrl+Tab"
        },
        {
          type: "input",
          prompt: "Zwischen aktiven Fenstern wechseln",
          answer: "Alt+Tab",
          hint: "Alt+Tab"
        },
        {
          type: "select",
          prompt: "Task-Manager öffnen",
          answer: "Ctrl+Shift+Esc",
          options: ["Ctrl+Alt+Del", "Ctrl+Shift+Esc", "Alt+F4", "Win+T"]
        },
        {
          type: "select",
          prompt: "Desktop anzeigen",
          answer: "Win+D",
          options: ["Win+M", "Win+D", "Alt+F4", "Ctrl+Alt+Del"]
        }
      ]
    },
    {
      id: "7",
      tabLabel: "Abschnitt 7",
      title: "7. Shortcut Memory – Windows",
      description: "Merke dir Windows-Kombinationen. 6 Paare mit Win-Tasten warten auf dich. Finde immer Aktion und Kombi.",
      memoryGame: {
        title: "Windows Memory",
        pairs: [
          { id: "desktop", cards: ["Desktop anzeigen", "Win+D"] },
          { id: "lock", cards: ["PC sperren", "Win+L"] },
          { id: "clipboard", cards: ["Zwischenablage-Verlauf", "Win+V"] },
          { id: "emoji", cards: ["Emoji-Panel", "Win+."] },
          { id: "explorer", cards: ["Explorer öffnen", "Win+E"] },
          { id: "snip", cards: ["Screenshot-Ausschnitt", "Win+Shift+S"] }
        ]
      },
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
          tokens: ["Ctrl+Y", "Ctrl+Z", "Ctrl+P", "Ctrl+O", "Win+Shift+S", "Ctrl+W", "Ctrl+B"],
          targets: [
            { label: "Aktion wiederholen", answer: "Ctrl+Y" },
            { label: "Aktion rückgängig", answer: "Ctrl+Z" },
            { label: "Druckdialog öffnen", answer: "Ctrl+P" },
            { label: "Dokument öffnen", answer: "Ctrl+O" },
            { label: "Screenshot Ausschnitt erstellen", answer: "Win+Shift+S" },
            { label: "Tab schliessen", answer: "Ctrl+W" },
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
          { label: "Neues Dokument", combo: "Ctrl+N" },
          { label: "Suche öffnen", combo: "Ctrl+F" },
          { label: "Drucken", combo: "Ctrl+P" },
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
            scene: "Sein Browser ist mit Tabs überfüllt. Welche Kombination empfiehlst du ihm, um Tabs schnell zu schliessen?",
            prompt: "Jonas nutzt ____ + ____ um den aktuellen Tab zu schließen.",
            missingSlots: 2,
            options: [
              { label: "Ctrl", value: "Ctrl" },
              { label: "Alt", value: "Alt" },
              { label: "Shift", value: "Shift" },
              { label: "W", value: "W" },
              { label: "F4", value: "F4" }
            ],
            answers: ["Ctrl", "W"]
          }
        ]
      },
      tasks: []
    },
    {
      id: "13",
      tabLabel: "Abschnitt 13",
      title: "13. Windows Navigation – Basics",
      description: "Wähle passgenau die richtigen Win-Kürzel.",
      tasks: [
        {
          type: "select",
          prompt: "Desktop anzeigen",
          answer: "Win+D",
          options: ["Win+Shift+D", "Win+D", "Win+M", "Win+Home", "Win+Ctrl+D"]
        },
        {
          type: "select",
          prompt: "Einstellungen öffnen",
          answer: "Win+I",
          options: ["Win+I", "Win+Pause", "Win+J", "Win+Ctrl+I", "Win+R"]
        },
        {
          type: "select",
          prompt: "Explorer starten",
          answer: "Win+E",
          options: ["Win+R", "Win+C", "Win+E", "Win+Shift+E", "Win+Ctrl+E"]
        },
        {
          type: "select",
          prompt: "Task-Ansicht öffnen",
          answer: "Win+Tab",
          options: ["Win+Tab", "Win+Ctrl+Alt+Tab", "Alt+Tab", "Win+Shift+Tab", "Win+Ctrl+Tab"]
        }
        ,
        {
          type: "select",
          prompt: "Zwischen Fenstern wechseln",
          answer: "Alt+Tab",
          options: ["Alt+Tab", "Win+Tab", "Ctrl+Tab", "Ctrl+Alt+Del", "Win+Shift+Tab"]
        }
      ]
    },
    {
      id: "14",
      tabLabel: "Abschnitt 14",
      title: "14. Windows Picks",
      description: "Wähle das passende Windows-Tastenkürzel.",
      tasks: [
        {
          type: "select",
          prompt: "Zwischenablage-Verlauf öffnen",
          answer: "Win+V",
          options: ["Win+Shift+V", "Win+Alt+V", "Win+V", "Win+C", "Win+B"]
        },
        {
          type: "select",
          prompt: "Emoji-Panel anzeigen",
          answer: "Win+.",
          options: ["Win+,", "Win+Ctrl+.", "Win+.", "Win+Shift+;", "Win+E"]
        },
        {
          type: "select",
          prompt: "Explorer öffnen",
          answer: "Win+E",
          options: ["Win+Shift+E", "Win+Alt+E", "Win+E", "Win+C", "Win+Ctrl+E"]
        },
        {
          type: "select",
          prompt: "Desktop anzeigen",
          answer: "Win+D",
          options: ["Win+Ctrl+D", "Win+Shift+D", "Win+Alt+D", "Win+D", "Win+Home"]
        }
      ]
    },
    {
      id: "15",
      tabLabel: "Abschnitt 15",
      title: "15. Windows Navigation – Aufbau",
      description: "Trainiere Snap-Layouts, Schnellmenü und weitere Win-Kürzel.",
      tasks: [
        { type: "input", prompt: "Fenster fix nach links", answer: "Win+PfeiltasteLinks", hint: "Win+PfeiltasteLinks" },
        { type: "input", prompt: "Fenster fix nach rechts", answer: "Win+PfeiltasteRechts", hint: "Win+PfeiltasteRechts" },
        { type: "input", prompt: "Schnellmenü", answer: "Win+X", hint: "Win+X" },
        { type: "input", prompt: "Ausführen öffnen", answer: "Win+R", hint: "Win+R" }
      ]
    },
    {
      id: "16",
      tabLabel: "Abschnitt 16",
      title: "16. Lückentext – Produktivität",
      description: "Beherrsche Emojis, Tools und Mikrofonsteuerung.",
      narrative: {
        autoCheck: false,
        entries: [
          {
            scene: "Kurz vor dem Kundencall merkt Jonas, dass der Bildschirm zu hell ist.",
            prompt: "Er öffnet das Schnelleinstellungsfenster mit ____ + ____.",
            missingSlots: 2,
            options: [
              { label: "Win", value: "Win" },
              { label: "A", value: "A" },
              { label: ".", value: "." },
              { label: ",", value: "," }
            ],
            answers: ["Win", "A"]
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
            scene: "Jetzt möchte er den Zwischenablage-Verlauf öffnen, um eine kopierte Idee noch einmal zu sehen.",
            prompt: "Er nutzt ____ + ____ um den Verlauf aufzurufen.",
            missingSlots: 2,
            options: [
              { label: "Win", value: "Win" },
              { label: "V", value: "V" },
              { label: "X", value: "X" },
              { label: "C", value: "C" },
              { label: "A", value: "A" }
            ],
            answers: ["Win", "V"]
          }
        ]
      },
      tasks: []
    },
    {
      id: "17",
      tabLabel: "Abschnitt 17",
      title: "17. Lückentext – Kontrolle",
      description: "Fenster arrangieren und Tools sofort öffnen.",
      narrative: {
        autoCheck: false,
        entries: [
          {
            scene: "Nach Feierabend sichert Jonas seinen Rechner im Vorbeigehen.",
            prompt: "Der Computer wird gesperrt mit ____ + ____.",
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
              { label: "PfeiltasteLinks", value: "PfeiltasteLinks" },
              { label: "PfeiltasteRechts", value: "PfeiltasteRechts" },
              { label: "Up", value: "Up" }
            ],
            answers: ["Win", "PfeiltasteLinks"]
          },
          {
            scene: "Eine App hängt komplett, also ruft er den Task-Manager auf.",
            prompt: "Er öffnet den Task-Manager mit ____ + ____ + ____.",
            missingSlots: 3,
            options: [
              { label: "Ctrl", value: "Ctrl" },
              { label: "Shift", value: "Shift" },
              { label: "Esc", value: "Esc" },
              { label: "Alt", value: "Alt" },
              { label: "Win", value: "Win" }

            ],
            answers: ["Ctrl", "Shift", "Esc"]
          }
        ]
      },
      tasks: []
    },
    {
      id: "18",
      tabLabel: "Abschnitt 18",
      title: "18. Drag und Drop – Windows Basics",
      description: "Ordne die häufigsten Windows-Kombinationen zu ihren Aktionen.",
      tasks: [
        {
          type: "dnd",
          tokens: ["Win+D", "Win+L", "Win+V", "Win+E", "Win+Tab", "Win+X", "Win+R", "Win+A"],
          targets: [
            { label: "Desktop sofort anzeigen", answer: "Win+D" },
            { label: "PC sperren", answer: "Win+L" },
            { label: "Zwischenablage-Verlauf öffnen", answer: "Win+V" },
            { label: "Explorer öffnen", answer: "Win+E" },
            { label: "Task-Ansicht öffnen", answer: "Win+Tab" },
            { label: "Schnellmenü anzeigen", answer: "Win+X" },
            { label: "Ausführen-Dialog starten", answer: "Win+R" },
            { label: "Benachrichtigungscenter öffnen", answer: "Win+A" }
          ]
        }
      ]
    },
    {
      id: "19",
      tabLabel: "Abschnitt 19",
      title: "19. Drag und Drop – Windows Aufbau",
      description: "Die restlichen Win-Kombinationen: Einstellungen, Emoji, Suche, Snap und Tools.",
      tasks: [
        {
          type: "dnd",
          tokens: ["Win+I", "Win+.", "Win+S", "Win+Shift+S", "Win+K", "Win+P", "Win+Space"],
          targets: [
            { label: "Einstellungen öffnen", answer: "Win+I" },
            { label: "Emoji-Panel öffnen", answer: "Win+." },
            { label: "Suche starten", answer: "Win+S" },
            { label: "Screenshot-Ausschnitt aufnehmen", answer: "Win+Shift+S" },
          ]
        },
      ]
    },
    {
      id: "20",
      tabLabel: "Abschnitt 20",
      title: "20. Fast Paced Learning – Windows",
      description: "Reagiere innerhalb von 8 Sekunden auf die angezeigte Kombination.",
      fastPaced: {
        rounds: 8,
        timeLimitSeconds: 8,
        optionsPerRound: 4,
        combos: [
          { label: "Desktop anzeigen", combo: "Win+D" },
          { label: "PC sperren", combo: "Win+L" },
          { label: "Zwischenablage-Verlauf", combo: "Win+V" },
          { label: "Emoji-Panel", combo: "Win+." },
          { label: "Explorer öffnen", combo: "Win+E" },
          { label: "Task-Ansicht", combo: "Win+Tab" },
          { label: "Schnellmenü", combo: "Win+X" },
          { label: "Ausführen-Dialog", combo: "Win+R" },
          { label: "Benachrichtigungen", combo: "Win+A" },
          { label: "Screenshot-Ausschnitt", combo: "Win+Shift+S" },
        ]
      },
      tasks: [],
      hideActions: true
    },
    {
      id: "21",
      tabLabel: "Abschnitt 21",
      title: "21. Drag und Drop – Windows Wiederholung",
      description: "Eine erneute Runde mit den erweiterten Windows-Kombinationen.",
      tasks: [
        {
          type: "dnd",
          tokens: ["Win+PfeiltasteLinks", "Win+PfeiltasteRechts", "Win+PfeiltasteOben", "Win+PfeiltasteUnten"],
          targets: [
            { label: "Fenster nach links andocken", answer: "Win+PfeiltasteLinks" },
            { label: "Fenster nach rechts andocken", answer: "Win+PfeiltasteRechts" },
            { label: "Fenster maximieren", answer: "Win+PfeiltasteOben" },
            { label: "Fenster minimieren", answer: "Win+PfeiltasteUnten" },
          ]
        }
      ]
    },
    {
      id: "22",
      tabLabel: "Abschnitt 22",
      title: "22. Combo Builder",
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
      id: "23",
      tabLabel: "Abschnitt 23",
      title: "23. Combo Builder – Fokus",
      description: "Weitere Kombos in kleineren Häppchen trainieren.",
      comboBuilder: {
        title: "Combo Builder",
        instructions: "Wähle für jede Aufgabe die richtigen Tasten in der richtigen Reihenfolge. Jede Auswahl repräsentiert einen Teil der Combo.",
        defaultOptions: ["Ctrl", "Shift", "Win", ".", "Z", "N", "S"],
        combos: [
          {
            title: "Emoji Express",
            prompt: "Öffne das Emoji-Panel, um Reaktionen einzufügen.",
            answers: ["Win", "."]
          },
          {
            title: "Explorer",
            prompt: "Öffne den Windows Explorer.",
            answers: ["Win", "E"]
          },
          {
            title: "Einstellungen",
            prompt: "Öffne die Windows-Einstellungen.",
            answers: ["Win", "I"]
          },
          {
            title: "Search Helper",
            prompt: "Starte die Windows-Suche.",
            answers: ["Win", "S"]
          }
          ,
          {
            title: "On-Screen Keyboard",
            prompt: "Öffne die Bildschirmtastatur mit ____ + ____ + ____.",
            answers: ["Win", "Ctrl", "O"]
          }
        ]
      },
      tasks: []
    }

  ];

  global.LEARN_SECTION_BLUEPRINTS = sections;
})(typeof window !== "undefined" ? window : globalThis);
