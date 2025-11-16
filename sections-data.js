// Blueprint für die Lern-Abschnitte auf der Startseite.
// Die Struktur ist bewusst simpel gehalten, damit später weitere
// Abschnitte nur hier erweitert werden müssen.
(function attachSectionBlueprints(global) {
  const sections = [
    {
      id: "1",
      tabLabel: "Abschnitt 1",
      title: "1. Selber tippen",
      description: "Löse die folgenden Aufgaben, um dein Muscle Memory aufzuwärmen.",
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
          options: ["Ctrl+X", "Ctrl+C", "Ctrl+V", "Ctrl+S", "Ctrl+Z"]
        },
        {
          type: "select",
          prompt: "Einfügen",
          answer: "Ctrl+V",
          options: ["Ctrl+C", "Ctrl+V", "Ctrl+X", "Ctrl+Z", "Ctrl+S"]
        },
        {
          type: "select",
          prompt: "Ausschneiden",
          answer: "Ctrl+X",
          options: ["Ctrl+X", "Ctrl+C", "Ctrl+V", "Ctrl+Z", "Ctrl+A"]
        },
        {
          type: "select",
          prompt: "Alles markieren",
          answer: "Ctrl+A",
          options: ["Ctrl+F", "Ctrl+C", "Ctrl+V", "Ctrl+S", "Ctrl+A"]
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
          options: ["Ctrl+S", "Ctrl+O", "Win+Shift+S", "Ctrl+A", "Ctrl+P"]
        },
        {
          type: "select",
          prompt: "Neues Dokument",
          answer: "Ctrl+N",
          options: ["Ctrl+T", "Ctrl+N", "Ctrl+P", "Ctrl+X", "Ctrl+O"]
        },
        {
          type: "select",
          prompt: "Drucken",
          answer: "Ctrl+P",
          options: ["Ctrl+I", "Ctrl+D", "Ctrl+F", "Ctrl+O", "Ctrl+P"]
        },
        {
          type: "select",
          prompt: "Rückgängig",
          answer: "Ctrl+Z",
          options: ["Ctrl+Y", "Ctrl+Z", "Ctrl+B", "Ctrl+X", "Ctrl+S"]
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
          options: ["Ctrl+C", "Ctrl+A", "Ctrl+V", "Ctrl+S", "Ctrl+P"]
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
          options: ["Ctrl+Z", "Ctrl+A", "Ctrl+Y", "Ctrl+R", "Ctrl+Q"]
        },
        {
          type: "select",
          prompt: "Fett formatieren",
          answer: "Ctrl+B",
          options: ["Ctrl+Z", "Ctrl+I", "Ctrl+U", "Ctrl+B", "Ctrl+T"]
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
          type: "select",
          prompt: "Task-Ansicht öffnen",
          answer: "Win+Tab",
          options: ["Win+Tab", "Alt+Tab", "Win+D", "Ctrl+Alt+Tab", "Win+Ctrl+Tab"]
        },
        {
          type: "select",
          prompt: "Zwischen aktiven Fenstern wechseln",
          answer: "Alt+Tab",
          options: ["Alt+Tab", "Win+Tab", "Ctrl+Shift+Esc", "Win+E", "Ctrl+Alt+Del"]
        },
        {
          type: "select",
          prompt: "Task-Manager öffnen",
          answer: "Ctrl+Shift+Esc",
          options: ["Win+D", "Ctrl+Shift+Esc", "Ctrl+T", "Alt+F4", "Win+T", "Win+L"]
        },
        {
          type: "select",
          prompt: "Desktop anzeigen",
          answer: "Win+D",
          options: ["Win+E", "Win+L", "Alt+F4", "Ctrl+Alt+Del", "Win+D", "Win+X"]
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
          options: ["Win+J", "Win+I", "Win+V", "Win+E", "Win+D"]
        },
        {
          type: "select",
          prompt: "Einstellungen öffnen",
          answer: "Win+I",
          options: ["Win+J", "Win+E", "Win+I", "Win+S", "Win+R"]
        },
        {
          type: "select",
          prompt: "Explorer starten",
          answer: "Win+E",
          options: ["Win+R", "Win+C", "Win+P", "Win+K", "Win+E", "Win+X"]
        },
        {
          type: "select",
          prompt: "Task-Ansicht öffnen",
          answer: "Win+Tab",
          options: ["CTRL+Tab", "Alt+Tab", "Win+T", "Win+L", "Win+Tab"]
        }
        ,
        {
          type: "select",
          prompt: "Zwischen Fenstern wechseln",
          answer: "Alt+Tab",
          options: ["Win+Tab", "Alt+Tab", "Ctrl+Alt+Del", "Win+O", "Win+D"]
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
          options: ["Win+X", "Win+E", "Win+V", "Win+C", "Win+B"]
        },
        {
          type: "select",
          prompt: "Emoji-Panel anzeigen",
          answer: "Win+.",
          options: ["Win+,", "Win+E", "Win+.", "Win+D", "Win+F"]
        },
        {
          type: "select",
          prompt: "Explorer öffnen",
          answer: "Win+E",
          options: ["Win+D", "Win+R", "Win+E", "Win+C", "Win+X"]
        },
        {
          type: "select",
          prompt: "Desktop anzeigen",
          answer: "Win+D",
          options: ["Win+E", "Win+R", "Win+P", "Win+D", "CTRL+D"]
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
    },
    {
      id: "24",
      tabLabel: "Abschnitt 24",
      title: "24. CTRL Basics Review",
      description: "Wiederhole die wichtigsten CTRL-Kombinationen im Schnelldurchlauf.",
      tasks: [
        {
          type: "select",
          prompt: "Speichere deine Datei",
          answer: "Ctrl+S",
          options: ["Ctrl+S", "Ctrl+Q", "Ctrl+P", "Ctrl+X", "Ctrl+Y"]
        },
        {
          type: "select",
          prompt: "Wiederhole die letzte Aktion",
          answer: "Ctrl+Y",
          options: ["Ctrl+Y", "Ctrl+Z", "Ctrl+D", "Ctrl+R", "Ctrl+O"]
        },
        {
          type: "select",
          prompt: "Rufe den Druckdialog auf",
          answer: "Ctrl+P",
          options: ["Ctrl+O", "Ctrl+P", "Ctrl+X", "Ctrl+T", "Win+P"]
        },
        {
          type: "select",
          prompt: "Suche im Dokument",
          answer: "Ctrl+F",
          options: ["Win+F", "Ctrl+H", "Ctrl+R", "Ctrl+S", "Ctrl+F"]
        }
      ]
    },
    {
      id: "25",
      tabLabel: "Abschnitt 25",
      title: "25. Navigation-Puzzle",
      description: "Mastere alte und neue Fensternavigation durch Drag & Drop.",
      tasks: [
        {
          type: "dnd",
          tokens: ["Alt+Tab", "Win+Tab", "Ctrl+Esc", "Win+D", "Win+E", "Win+S", "Win+PfeiltasteLinks", "Win+PfeiltasteRechts"],
          targets: [
            { label: "Zwischen Anwendungen wechseln", answer: "Alt+Tab" },
            { label: "Task-Ansicht öffnen", answer: "Win+Tab" },
            { label: "Startmenü schnell öffnen", answer: "Ctrl+Esc" },
            { label: "Desktop zeigen", answer: "Win+D" },
            { label: "Explorer öffnen", answer: "Win+E" },
            { label: "Suche öffnen", answer: "Win+S" },
            { label: "Fenster links andocken", answer: "Win+PfeiltasteLinks" },
            { label: "Fenster rechts andocken", answer: "Win+PfeiltasteRechts" }
          ]
        }
      ]
    },
    {
      id: "26",
      tabLabel: "Abschnitt 26",
      title: "26. System Quick Access",
      description: "Öffne Einstellungen, Sperren und Zwischenablage mit der Win-Taste.",
      tasks: [
        {
          type: "select",
          prompt: "Sperre sofort deinen Rechner",
          answer: "Win+L",
          options: ["Win+L", "Ctrl+L", "Alt+F4", "Win+R", "Win+U"]
        },
        {
          type: "select",
          prompt: "Starte Einstellungen",
          answer: "Win+I",
          options: ["Win+Ctrl+O", "Win+P", "Win+V", "Ctrl+I", "Win+I"]
        },
        {
          type: "select",
          prompt: "Zwischenablage-Verlauf anzeigen",
          answer: "Win+V",
          options: ["Win+D", "Ctrl+V", "Win+V", "Alt+V", "Win+L"]
        }
      ]
    },
    {
      id: "27",
      tabLabel: "Abschnitt 27",
      title: "27. Window Snap Stories",
      description: "Erzählung mit Entscheidungen zu Snap- und Fenstersteuerung.",
      narrative: {
        autoCheck: false,
        entries: [
          {
            scene: "Ein Projekt braucht volle Konzentration, zwei Apps sollen nebeneinander.",
            prompt: "Jonas zieht mit ____ + ____ das Fenster nach links.",
            missingSlots: 2,
            options: [
              { label: "Win", value: "Win" },
              { label: "Ctrl", value: "Ctrl" },
              { label: "PfeiltasteLinks", value: "PfeiltasteLinks" },
              { label: "Alt", value: "Alt" },
              { label: "PfeiltasteRechts", value: "PfeiltasteRechts" }
            ],
            answers: ["Win", "PfeiltasteLinks"]
          },
          {
            scene: "Das andere Fenster schickst du mit ____ + ____ nach rechts.",
            prompt: "Wähle die Kombination:",
            missingSlots: 2,
            options: [
              { label: "Win", value: "Win" },
              { label: "Ctrl", value: "Ctrl" },
              { label: "PfeiltasteRechts", value: "PfeiltasteRechts" },
              { label: "Alt", value: "Alt" },
              { label: "PfeiltasteLinks", value: "PfeiltasteLinks" }
            ],
            answers: ["Win", "PfeiltasteRechts"]
          }
        ]
      },
      tasks: []
    },
    {
      id: "28",
      tabLabel: "Abschnitt 28",
      title: "28. System Combo Builder",
      description: "Baue Settings-, Search- und Lock-Kombos aus Bausteinen.",
      comboBuilder: {
        title: "System Combo Builder",
        instructions: "Setze jeweils die richtige Reihenfolge zusammen.",
        defaultOptions: ["Ctrl", "Shift", "Win", "Alt", "S", "L", "I", "V", "P", "E"],
        combos: [
          { title: "Lock-In-Place", prompt: "Sperre das Gerät sofort.", answers: ["Win", "L"] },
          { title: "Search Recall", prompt: "Starte die Suche wieder.", answers: ["Win", "S"] },
          { title: "Settings", prompt: "Einstellungen öffnen.", answers: ["Win", "I"] },
          { title: "Clip Explorer", prompt: "Zwischenablage-Verlauf.", answers: ["Win", "V"] }
        ]
      },
      tasks: []
    },
    {
      id: "29",
      tabLabel: "Abschnitt 29",
      title: "29. Shortcut Shuffle",
      description: "Eine kreative Mischung aus Drag & Drop und Selects für frische Kombinationen.",
      tasks: [
        {
          type: "dnd",
          tokens: ["Win+.", "Win+Shift+S", "Alt+Tab", "Win+Ctrl+O"],
          targets: [
            { label: "Emoji-Panel für Reaktionen starten", answer: "Win+." },
            { label: "Screenshot-Ausschnitt aufnehmen", answer: "Win+Shift+S" },
            { label: "Zwischen laufenden Programmen wechseln", answer: "Alt+Tab" },
            { label: "Bildschirmtastatur öffnen", answer: "Win+Ctrl+O" }
          ]
        },
        {
          type: "select",
          prompt: "Wähle die Kombination für Systemsuche.",
          answer: "Win+S",
          options: ["Win+S", "Ctrl+S", "Win+P", "Win+Ctrl+S"]
        }
      ]
    },
    {
      id: "30",
      tabLabel: "Abschnitt 30",
      title: "30. Schnellcheck – Systemkürzel",
      description: "Teste die zentralen Windows-Kombinationen im Countdown-Modus.",
      fastPaced: {
        rounds: 6,
        timeLimitSeconds: 6,
        optionsPerRound: 3,
        combos: [
          { label: "PC Sperren", combo: "Win+L" },
          { label: "Einstellungen", combo: "Win+I" },
          { label: "Suche", combo: "Win+S" },
          { label: "Zwischenablage-Verlauf", combo: "Win+V" },
          { label: "Explorer", combo: "Win+E" },
          { label: "Fenster Links ausrichten", combo: "Win+PfeiltasteLinks" }
        ]
      },
      tasks: [],
      hideActions: true
    },
    {
      id: "31",
      tabLabel: "Abschnitt 31",
      title: "31. Selber tippen – Schnellrunde",
      description: "Wiederhole die ersten Kürzel nur mit einem Eingabefeld.",
      tasks: [
        { type: "input", prompt: "Drucken", answer: "Ctrl+P" },
        { type: "input", prompt: "Neuer Tab", answer: "Ctrl+N" },
        { type: "input", prompt: "Fenster schließen", answer: "Ctrl+W" },
        { type: "input", prompt: "Screenshot-Ausschnitt", answer: "Win+Shift+S" }
      ]
    },
    {
      id: "32",
      tabLabel: "Abschnitt 32",
      title: "32. Grundlagen – Input-Check",
      description: "Gib die Kürzel von Grundfunktionen einfach ein.",
      tasks: [
        { type: "input", prompt: "Kopieren", answer: "Ctrl+C" },
        { type: "input", prompt: "Einfügen", answer: "Ctrl+V" },
        { type: "input", prompt: "Ausschneiden", answer: "Ctrl+X" },
        { type: "input", prompt: "Alles markieren", answer: "Ctrl+A" }
      ]
    },
    {
      id: "33",
      tabLabel: "Abschnitt 33",
      title: "33. Windows Memory",
      description: "Finde die Kombinationenpaare für wichtige Windows-Steuerbefehle.",
      memoryGame: {
        title: "Windows Memory",
        instructions: "Verbinde Beschreibung und Shortcut der zehn Windows-Highlights.",
        pairs: [
          { id: "desktop", cards: ["Desktop anzeigen", "Win+D"] },
          { id: "lock", cards: ["PC sperren", "Win+L"] },
          { id: "explorer", cards: ["Explorer öffnen", "Win+E"] },
          { id: "search", cards: ["Suche starten", "Win+S"] },
          { id: "settings", cards: ["Einstellungen öffnen", "Win+I"] },
          { id: "clipboard", cards: ["Zwischenablage-Verlauf", "Win+V"] },
          { id: "screenshot", cards: ["Screenshot-Ausschnitt", "Win+Shift+S"] },
          { id: "keyboard", cards: ["Bildschirmtastatur", "Win+Ctrl+O"] },
          { id: "emoji", cards: ["Emoji-Panel", "Win+."] },
          { id: "task", cards: ["Task-Ansicht", "Win+Tab"] }
        ]
      },
      tasks: []
    },
    {
      id: "34",
      tabLabel: "Abschnitt 34",
      title: "34. Kreativatelier – Szene",
      description: "In Kiras Agentur zählt nur Tempo. Tippe die passenden Kombos in der Szene.",
      narrative: {
        autoCheck: false,
        entries: [
          {
            scene: "Kira skizziert Ideen und kopiert das beste Layout sofort.",
            prompt: "Sie dupliziert die Auswahl mit ____ + ____.",
            missingSlots: 2,
            options: [
              { label: "Ctrl", value: "Ctrl" },
              { label: "C", value: "C" },
              { label: "V", value: "V" },
              { label: "X", value: "X" }
            ],
            answers: ["Ctrl", "C"]
          },
          {
            scene: "Der Kunde ruft rein – der finale Text muss eingefügt werden.",
            prompt: "Kira fügt ihn per ____ + ____ ein.",
            missingSlots: 2,
            options: [
              { label: "Ctrl", value: "Ctrl" },
              { label: "V", value: "V" },
              { label: "F", value: "F" },
              { label: "S", value: "S" }
            ],
            answers: ["Ctrl", "V"]
          },
          {
            scene: "Bevor sie das Studio verlässt, speichert sie alles sauber.",
            prompt: "Der Speichervorgang läuft mit ____ + ____.",
            missingSlots: 2,
            options: [
              { label: "Ctrl", value: "Ctrl" },
              { label: "S", value: "S" },
              { label: "P", value: "P" },
              { label: "Z", value: "Z" }
            ],
            answers: ["Ctrl", "S"]
          }
        ]
      },
      tasks: []
    },
    {
      id: "35",
      tabLabel: "Abschnitt 35",
      title: "35. Desktop-Werkbank",
      description: "Ordne Kombos kreativen Werkzeugen zu.",
      tasks: [
        {
          type: "dnd",
          tokens: ["Ctrl+O", "Ctrl+P", "Ctrl+F", "Ctrl+Esc"],
          targets: [
            { label: "Datei öffnen", answer: "Ctrl+O" },
            { label: "Sofort drucken", answer: "Ctrl+P" },
            { label: "Inhalt durchsuchen", answer: "Ctrl+F" },
            { label: "Startmenü über Tastatur öffnen", answer: "Ctrl+Esc" }
          ]
        }
      ]
    },
    {
      id: "36",
      tabLabel: "Abschnitt 36",
      title: "36. Flowfloor – Szene",
      description: "Jonas jongliert Fenster und braucht deine Hilfe.",
      narrative: {
        autoCheck: false,
        entries: [
          {
            scene: "Sein Mailfenster soll an die linke Bildschirmhälfte schnappen.",
            prompt: "Jonas drückt ____ + ____.",
            missingSlots: 2,
            options: [
              { label: "Win", value: "Win" },
              { label: "PfeiltasteLinks", value: "PfeiltasteLinks" },
              { label: "PfeiltasteRechts", value: "PfeiltasteRechts" },
              { label: "Tab", value: "Tab" }
            ],
            answers: ["Win", "PfeiltasteLinks"]
          },
          {
            scene: "Er braucht sofort die Vogelperspektive auf alle Apps.",
            prompt: "Er nutzt ____ + ____.",
            missingSlots: 2,
            options: [
              { label: "Win", value: "Win" },
              { label: "Tab", value: "Tab" },
              { label: "Alt", value: "Alt" },
              { label: "Esc", value: "Esc" }
            ],
            answers: ["Win", "Tab"]
          },
          {
            scene: "Nach dem Vergleich kehrt er zurück zur vorherigen App.",
            prompt: "Welche Kombination drückt er? ____ + ____",
            missingSlots: 2,
            options: [
              { label: "Alt", value: "Alt" },
              { label: "Tab", value: "Tab" },
              { label: "Ctrl", value: "Ctrl" },
              { label: "P", value: "P" }
            ],
            answers: ["Alt", "Tab"]
          }
        ]
      },
      tasks: []
    },
    {
      id: "37",
      tabLabel: "Abschnitt 37",
      title: "37. System-Mixer",
      description: "Baue Kombos für Einstellungen und Services.",
      comboBuilder: {
        title: "System-Mixer",
        instructions: "Wähle die richtigen Tasten in der passenden Reihenfolge.",
        defaultOptions: ["Win", "Ctrl", "Shift", "L", "R", "I", "V", "."],
        combos: [
          { title: "Bildschirm sperren", prompt: "Sicher den Arbeitsplatz ab.", answers: ["Win", "L"] },
          { title: "Befehlseingabe", prompt: "Starte den Ausführen-Dialog.", answers: ["Win", "R"] },
          { title: "Einstellungen", prompt: "Öffne Settings sofort.", answers: ["Win", "I"] },
          { title: "Emoji-Panel", prompt: "Bring Emojis ins Meeting.", answers: ["Win", "."] }
        ]
      },
      tasks: []
    },
    {
      id: "38",
      tabLabel: "Abschnitt 38",
      title: "38. Operationszentrale – Szene",
      description: "Leite die System-Checks über reine Tastenkürzel.",
      narrative: {
        autoCheck: false,
        entries: [
          {
            scene: "Vor Feierabend sperrt Maya den PC.",
            prompt: "Sie nutzt ____ + ____.",
            missingSlots: 2,
            options: [
              { label: "Win", value: "Win" },
              { label: "L", value: "L" },
              { label: "V", value: "V" },
              { label: "Shift", value: "Shift" }
            ],
            answers: ["Win", "L"]
          },
          {
            scene: "Die Zwischenablage braucht sie als Mini-Archiv.",
            prompt: "Sie öffnet sie per ____ + ____.",
            missingSlots: 2,
            options: [
              { label: "Win", value: "Win" },
              { label: "V", value: "V" },
              { label: "R", value: "R" },
              { label: "Ctrl", value: "Ctrl" }
            ],
            answers: ["Win", "V"]
          },
          {
            scene: "Um Screenshots zu kommentieren, startet sie schnell den Ausschnittmodus.",
            prompt: "Welche Kombi? ____ + ____ + ____",
            missingSlots: 3,
            options: [
              { label: "Win", value: "Win" },
              { label: "Shift", value: "Shift" },
              { label: "S", value: "S" },
              { label: "Ctrl", value: "Ctrl" },
              { label: "O", value: "O" }
            ],
            answers: ["Win", "Shift", "S"]
          }
        ]
      },
      tasks: []
    },
    {
      id: "39",
      tabLabel: "Abschnitt 39",
      title: "39. Kreativlabor – Window Mix",
      description: "Ein Mix aus Szene und kurzer Zuordnungsaufgabe rund um Fensternavigation.",
      narrative: {
        autoCheck: false,
        entries: [
          {
            scene: "Lukas will zwei Browserfenster nebeneinander legen.",
            prompt: "Er dockt das erste Fenster an die rechte Seite mit ____ + ____.",
            missingSlots: 2,
            options: [
              { label: "Win", value: "Win" },
              { label: "PfeiltasteRechts", value: "PfeiltasteRechts" },
              { label: "PfeiltasteLinks", value: "PfeiltasteLinks" },
              { label: "Alt", value: "Alt" }
            ],
            answers: ["Win", "PfeiltasteRechts"]
          },
          {
            scene: "Zum Vergleich wechselt er kurz in ein anderes Programm.",
            prompt: "Welche Kombi nutzt er? ____ + ____",
            missingSlots: 2,
            options: [
              { label: "Alt", value: "Alt" },
              { label: "Tab", value: "Tab" },
              { label: "Win", value: "Win" },
              { label: "Ctrl", value: "Ctrl" }
            ],
            answers: ["Alt", "Tab"]
          }
        ]
      },
      tasks: [
        {
          type: "dnd",
          tokens: ["Win+Tab", "Win+D", "Ctrl+Esc"],
          targets: [
            { label: "Task-Ansicht öffnen", answer: "Win+Tab" },
            { label: "Desktop sofort zeigen", answer: "Win+D" },
            { label: "Startmenü per Tastatur", answer: "Ctrl+Esc" }
          ]
        }
      ]
    },
    {
      id: "40",
      tabLabel: "Abschnitt 40",
      title: "40. System-Sprint",
      description: "Fast-Paced-Drill rund um Suche, Sperre und Tools.",
      fastPaced: {
        rounds: 7,
        timeLimitSeconds: 7,
        optionsPerRound: 4,
        combos: [
          { label: "Startmenü öffnen", combo: "Ctrl+Esc" },
          { label: "Zum Dokumentanfang springen", combo: "Ctrl+Home" },
          { label: "Zum Ende springen", combo: "Ctrl+End" },
          { label: "Ausführen-Dialog", combo: "Win+R" },
          { label: "Emoji-Panel", combo: "Win+." },
          { label: "Screenshot-Ausschnitt", combo: "Win+Shift+S" },
          { label: "Bildschirmtastatur", combo: "Win+Ctrl+O" }
        ]
      },
      tasks: [],
      hideActions: true
    },
    {
      id: "41",
      tabLabel: "Abschnitt 41",
      title: "41. Archiv-Jagd",
      description: "Eine Mini-Story mit drei schnellen Entscheidungen.",
      narrative: {
        autoCheck: false,
        entries: [
          {
            scene: "Mira durchforstet einen Vertrag und markiert die relevanten Zeilen.",
            prompt: "Sie kopiert den Abschnitt mit ____ + ____.",
            missingSlots: 2,
            options: [
              { label: "Ctrl", value: "Ctrl" },
              { label: "C", value: "C" },
              { label: "X", value: "X" },
              { label: "V", value: "V" }
            ],
            answers: ["Ctrl", "C"]
          },
          {
            scene: "Der nächste Absatz kommt an eine neue Stelle.",
            prompt: "Mira fügt ihn dort ein mit ____ + ____.",
            missingSlots: 2,
            options: [
              { label: "Ctrl", value: "Ctrl" },
              { label: "V", value: "V" },
              { label: "Z", value: "Z" },
              { label: "F", value: "F" }
            ],
            answers: ["Ctrl", "V"]
          },
          {
            scene: "Um einen Begriff zu prüfen, sucht sie blitzschnell.",
            prompt: "Welche Kombination nutzt sie? ____ + ____",
            missingSlots: 2,
            options: [
              { label: "Ctrl", value: "Ctrl" },
              { label: "F", value: "F" },
              { label: "S", value: "S" },
              { label: "P", value: "P" }
            ],
            answers: ["Ctrl", "F"]
          }
        ]
      },
      tasks: []
    },
    {
      id: "42",
      tabLabel: "Abschnitt 42",
      title: "42. Navigator-Puzzle",
      description: "Ordne die Fensternavigation den Aktionen zu.",
      tasks: [
        {
          type: "dnd",
          tokens: ["Ctrl+Esc", "Alt+Tab", "Win+Tab", "Win+D", "Win+E", "Win+S", "Win+PfeiltasteLinks", "Win+PfeiltasteRechts"],
          targets: [
            { label: "Startmenü ohne Maus öffnen", answer: "Ctrl+Esc" },
            { label: "Zwischen Programmen springen", answer: "Alt+Tab" },
            { label: "Task-Ansicht starten", answer: "Win+Tab" },
            { label: "Desktop sofort anzeigen", answer: "Win+D" },
            { label: "Explorer öffnen", answer: "Win+E" },
            { label: "Systemsuche öffnen", answer: "Win+S" },
            { label: "Fenster links andocken", answer: "Win+PfeiltasteLinks" },
            { label: "Fenster rechts andocken", answer: "Win+PfeiltasteRechts" }
          ]
        }
      ]
    },
    {
      id: "43",
      tabLabel: "Abschnitt 43",
      title: "43. Launch Pad",
      description: "Baue essentielle Windows-Kombos zusammen.",
      comboBuilder: {
        title: "Launch Pad",
        instructions: "Setze die richtigen Tasten in die richtige Reihenfolge.",
        defaultOptions: ["Win", "Ctrl", "R", "E", "I", ".", "O"],
        combos: [
          { title: "Ausführen-Dialog", prompt: "Direkt Befehle starten.", answers: ["Win", "R"] },
          { title: "Explorer-Lift", prompt: "Dateien sofort sehen.", answers: ["Win", "E"] },
          { title: "Einstellungen öffnen", prompt: "Systemparameter ändern.", answers: ["Win", "I"] },
          { title: "Bildschirmtastatur", prompt: "Virtuelles Keyboard starten.", answers: ["Win", "Ctrl", "O"] }
        ]
      },
      tasks: []
    },
    {
      id: "44",
      tabLabel: "Abschnitt 44",
      title: "44. System-Checks – Szene",
      description: "Begleite die Datenspezialistin Lina durch ihr Abendritual.",
      narrative: {
        autoCheck: false,
        entries: [
          {
            scene: "Kurz nach Feierabend hängt eine App – sie braucht den Task-Manager sofort.",
            prompt: "Lina öffnet ihn mit ____ + ____ + ____.",
            missingSlots: 3,
            options: [
              { label: "Ctrl", value: "Ctrl" },
              { label: "Shift", value: "Shift" },
              { label: "Esc", value: "Esc" },
              { label: "Alt", value: "Alt" },
              { label: "Del", value: "Del" }
            ],
            answers: ["Ctrl", "Shift", "Esc"]
          },
          {
            scene: "Der Bericht ist lang – sie springt per Tastatur an den Anfang.",
            prompt: "Welche Kombination? ____ + ____",
            missingSlots: 2,
            options: [
              { label: "Ctrl", value: "Ctrl" },
              { label: "Home", value: "Home" },
              { label: "End", value: "End" },
              { label: "Shift", value: "Shift" }
            ],
            answers: ["Ctrl", "Home"]
          },
          {
            scene: "Die letzte Kontrolle erfolgt ganz am Ende des Dokuments.",
            prompt: "Sie springt mit ____ + ____ dorthin.",
            missingSlots: 2,
            options: [
              { label: "Ctrl", value: "Ctrl" },
              { label: "End", value: "End" },
              { label: "Shift", value: "Shift" },
              { label: "Page Down", value: "PageDown" }
            ],
            answers: ["Ctrl", "End"]
          },
          {
            scene: "Damit keine Änderung verloren geht, speichert Lina ein letztes Mal.",
            prompt: "Sie nutzt ____ + ____.",
            missingSlots: 2,
            options: [
              { label: "Ctrl", value: "Ctrl" },
              { label: "S", value: "S" },
              { label: "P", value: "P" },
              { label: "Win", value: "Win" }
            ],
            answers: ["Ctrl", "S"]
          }
        ]
      },
      tasks: []
    },
    {
      id: "45",
      tabLabel: "Abschnitt 45",
      title: "45. Focus Board",
      description: "Trage die passenden Eingaben ein.",
      tasks: [
        { type: "input", prompt: "Zum Dokumentanfang springen", answer: "Ctrl+Home" },
        { type: "input", prompt: "Zum Dokumentende springen", answer: "Ctrl+End" },
        { type: "input", prompt: "Task-Manager öffnen", answer: "Ctrl+Shift+Esc" }
      ]
    },
    {
      id: "46",
      tabLabel: "Abschnitt 46",
      title: "46. Screenshot Studio",
      description: "Maya dokumentiert ihr Projekt nur per Tastatur.",
      narrative: {
        autoCheck: false,
        entries: [
          {
            scene: "Sie will nur einen Ausschnitt abfotografieren.",
            prompt: "Maya drückt ____ + ____ + ____.",
            missingSlots: 3,
            options: [
              { label: "Win", value: "Win" },
              { label: "Shift", value: "Shift" },
              { label: "S", value: "S" },
              { label: "Ctrl", value: "Ctrl" },
              { label: "V", value: "V" }
            ],
            answers: ["Win", "Shift", "S"]
          },
          {
            scene: "Den Bildausschnitt klebt sie direkt in ihr Board.",
            prompt: "Welche Tastenkombination nutzt sie zum Einfügen? ____ + ____",
            missingSlots: 2,
            options: [
              { label: "Ctrl", value: "Ctrl" },
              { label: "V", value: "V" },
              { label: "Shift", value: "Shift" },
              { label: "X", value: "X" }
            ],
            answers: ["Ctrl", "V"]
          },
          {
            scene: "Zum Schluss öffnet sie kurz die Suche im System.",
            prompt: "Sie drückt ____ + ____.",
            missingSlots: 2,
            options: [
              { label: "Win", value: "Win" },
              { label: "S", value: "S" },
              { label: "Ctrl", value: "Ctrl" },
              { label: "P", value: "P" }
            ],
            answers: ["Win", "S"]
          }
        ]
      },
      tasks: []
    },
    {
      id: "47",
      tabLabel: "Abschnitt 47",
      title: "47. Control Room",
      description: "Ordne grundlegende Service-Kürzel zu.",
      tasks: [
        {
          type: "dnd",
          tokens: ["Win+L", "Win+R", "Ctrl+Esc", "Ctrl+Shift+Esc"],
          targets: [
            { label: "PC sofort sperren", answer: "Win+L" },
            { label: "Ausführen-Dialog aufrufen", answer: "Win+R" },
            { label: "Startmenü über Tastatur öffnen", answer: "Ctrl+Esc" },
            { label: "Task-Manager aufrufen", answer: "Ctrl+Shift+Esc" }
          ]
        }
      ]
    },
    {
      id: "48",
      tabLabel: "Abschnitt 48",
      title: "48. Navigation Matrix",
      description: "Baue Snap- und Ansichtskombinationen zusammen.",
      comboBuilder: {
        title: "Navigation Matrix",
        instructions: "Setze die Tastenblöcke richtig zusammen.",
        defaultOptions: ["Win", "Alt", "Tab", "PfeiltasteLinks"],
        combos: [
          { title: "Task-Ansicht", prompt: "Alle Fenster zeigen.", answers: ["Win", "Tab"] },
          { title: "Fenster links andocken", prompt: "Snap nach links.", answers: ["Win", "PfeiltasteLinks"] },
          { title: "Zwischen Programmen wechseln", prompt: "Bleibe in Flow ohne Maus.", answers: ["Alt", "Tab"] }
        ]
      },
      tasks: []
    },
    {
      id: "49",
      tabLabel: "Abschnitt 49",
      title: "49. Creative Deck",
      description: "Ein selektiver Mix aus Kreativ-Kürzeln.",
      tasks: [
        { type: "input", prompt: "Neues Dokument öffnen", answer: "Ctrl+N" },
        { type: "input", prompt: "Datei öffnen", answer: "Ctrl+O" },
        { type: "input", prompt: "Alles markieren", answer: "Ctrl+A" },
        { type: "input", prompt: "Desktop anzeigen", answer: "Win+D" }
      ]
    },
    {
      id: "50",
      tabLabel: "Abschnitt 50",
      title: "50. Fast-Paced Mastery",
      description: "12 schnelle Runden à 5 Sekunden – nur für Shortcut-Profis.",
      fastPaced: {
        rounds: 12,
        timeLimitSeconds: 10,
        optionsPerRound: 8,
        combos: [
          { label: "PC sperren", combo: "Win+L" },
          { label: "Einstellungen", combo: "Win+I" },
          { label: "Ausführen-Dialog", combo: "Win+R" },
          { label: "Zwischenablage-Verlauf", combo: "Win+V" },
          { label: "Emoji-Panel", combo: "Win+." },
          { label: "Suche", combo: "Win+S" },
          { label: "Explorer öffnen", combo: "Win+E" },
          { label: "Screenshot-Ausschnitt", combo: "Win+Shift+S" },
          { label: "Bildschirmtastatur", combo: "Win+Ctrl+O" },
          { label: "Task-Ansicht", combo: "Win+Tab" },
          { label: "Zwischen Programmen wechseln", combo: "Alt+Tab" },
          { label: "Task-Manager", combo: "Ctrl+Shift+Esc" },
          { label: "Desktop anzeigen", combo: "Win+D" },
          { label: "Startmenü öffnen", combo: "Ctrl+Esc" },
          { label: "Fenster links andocken", combo: "Win+PfeiltasteLinks" },
          { label: "Fenster rechts andocken", combo: "Win+PfeiltasteRechts" }
        ]
      },
      tasks: [],
      hideActions: true
    },
    {
      id: "51",
      tabLabel: "Abschnitt 51",
      title: "51. Grundlagen",
      description: "Die klassischen Basics – nur Eingaben, keine Auswahl.",
      tasks: [
        { type: "input", prompt: "Speichern", answer: "Ctrl+S" },
        { type: "input", prompt: "Neues Dokument", answer: "Ctrl+N" },
        { type: "input", prompt: "Drucken", answer: "Ctrl+P" },
        { type: "input", prompt: "Rückgängig", answer: "Ctrl+Z" }
      ]
    },
    {
      id: "52",
      tabLabel: "Abschnitt 52",
      title: "52. Selber tippen – Teil 2 again",
      description: "Der zweite Teil nochmal als reine Eingabeübung.",
      tasks: [
        { type: "input", prompt: "Alles markieren", answer: "Ctrl+A" },
        { type: "input", prompt: "Suche öffnen", answer: "Ctrl+F" },
        { type: "input", prompt: "Wiederholen", answer: "Ctrl+Y" },
        { type: "input", prompt: "Fett formatieren", answer: "Ctrl+B" }
      ]
    },
    {
      id: "53",
      tabLabel: "Abschnitt 53",
      title: "53. Quick Wins – Input",
      description: "Die Überraschungskombinationen als einfache Eingabefelder.",
      tasks: [
        { type: "input", prompt: "Startmenü öffnen", answer: "Ctrl+Esc" },
        { type: "input", prompt: "Zwischen aktiven Fenstern wechseln", answer: "Alt+Tab" },
        { type: "input", prompt: "Task-Manager öffnen", answer: "Ctrl+Shift+Esc" },
        { type: "input", prompt: "Desktop anzeigen", answer: "Win+D" },
        { type: "input", prompt: "Screenshot-Ausschnitt", answer: "Win+Shift+S" },
      ]
    },
    {
      id: "54",
      tabLabel: "Abschnitt 54",
      title: "54. Agenten-Epilog",
      description: "Neue Szene: Agentin Nova sichert ihr System vor dem Wochenendflug.",
      narrative: {
        autoCheck: false,
        entries: [
          {
            scene: "Nova sperrt ihr Terminal, bevor sie den Projektraum verlässt.",
            prompt: "Welche Kombi nutzt sie? ____ + ____",
            missingSlots: 2,
            options: [
              { label: "Win", value: "Win" },
              { label: "L", value: "L" },
              { label: "Shift", value: "Shift" },
              { label: "Ctrl", value: "Ctrl" }
            ],
            answers: ["Win", "L"]
          },
          {
            scene: "Anschließend startet sie den Ausführen-Dialog, um den Backup-Befehl zu tippen.",
            prompt: "Wie öffnet sie ihn? ____ + ____",
            missingSlots: 2,
            options: [
              { label: "Win", value: "Win" },
              { label: "R", value: "R" },
              { label: "Ctrl", value: "Ctrl" },
              { label: "B", value: "B" }
            ],
            answers: ["Win", "R"]
          },
          {
            scene: "Zum Schluss erstellt sie einen Screenshot-Ausschnitt der Statusübersicht und fügt ihn in einen Agentenbericht ein.",
            prompt: "Zuerst nimmt sie den Ausschnitt mit ____ + ____ + ____, danach fügt sie ihn via ____ + ____ ein.",
            missingSlots: 5,
            options: [
              { label: "Win", value: "Win" },
              { label: "Shift", value: "Shift" },
              { label: "S", value: "S" },
              { label: "Ctrl", value: "Ctrl" },
              { label: "V", value: "V" },
              { label: "Alt", value: "Alt" }
            ],
            answers: ["Win", "Shift", "S", "Ctrl", "V"]
          }
        ]
      },
      tasks: []
    },
    {
      id: "55",
      tabLabel: "Abschnitt 55",
      title: "55. Fast-Paced Mastery II",
      description: "Noch schneller: 12 Runden à 5 Sekunden mit erweiterten System-Kombos.",
      fastPaced: {
        rounds: 12,
        timeLimitSeconds: 5,
        optionsPerRound: 5,
        combos: [
          { label: "PC sperren", combo: "Win+L" },
          { label: "Einstellungen", combo: "Win+I" },
          { label: "Ausführen-Dialog", combo: "Win+R" },
          { label: "Zwischenablage-Verlauf", combo: "Win+V" },
          { label: "Emoji-Panel", combo: "Win+." },
          { label: "Suche", combo: "Win+S" },
          { label: "Explorer öffnen", combo: "Win+E" },
          { label: "Screenshot-Ausschnitt", combo: "Win+Shift+S" },
          { label: "Bildschirmtastatur", combo: "Win+Ctrl+O" },
          { label: "Task-Ansicht", combo: "Win+Tab" },
          { label: "Zwischen Programmen wechseln", combo: "Alt+Tab" },
          { label: "Task-Manager", combo: "Ctrl+Shift+Esc" },
          { label: "Desktop anzeigen", combo: "Win+D" },
          { label: "Startmenü öffnen", combo: "Ctrl+Esc" },
          { label: "Fenster links andocken", combo: "Win+PfeiltasteLinks" },
          { label: "Fenster rechts andocken", combo: "Win+PfeiltasteRechts" }
        ]
      },
      tasks: [],
      hideActions: true
    }
  ];

  global.LEARN_SECTION_BLUEPRINTS = sections;
})(typeof window !== "undefined" ? window : globalThis);