from pathlib import Path

p = Path('2026/skill-hotkeys.js')
s = p.read_text(encoding='utf-8')
anchor = '''    if (!document.getElementById("shortcutQuestModernExercises")) {
      const modernExercises = document.createElement("link");
      modernExercises.id = "shortcutQuestModernExercises";
      modernExercises.rel = "stylesheet";
      modernExercises.href = "modern-exercises.css";
      document.head.appendChild(modernExercises);
    }
    document.title = "Shortcut Quest 2026";
'''
replacement = '''    if (!document.getElementById("shortcutQuestModernExercises")) {
      const modernExercises = document.createElement("link");
      modernExercises.id = "shortcutQuestModernExercises";
      modernExercises.rel = "stylesheet";
      modernExercises.href = "modern-exercises.css";
      document.head.appendChild(modernExercises);
    }
    if (!document.getElementById("shortcutQuestModernGame")) {
      const modernGame = document.createElement("link");
      modernGame.id = "shortcutQuestModernGame";
      modernGame.rel = "stylesheet";
      modernGame.href = "modern-game.css";
      document.head.appendChild(modernGame);
    }
    document.title = "Shortcut Quest 2026";
'''
if anchor not in s:
    raise SystemExit('modern game loader anchor not found')
p.write_text(s.replace(anchor, replacement, 1), encoding='utf-8')
