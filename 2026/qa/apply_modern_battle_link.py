from pathlib import Path

p = Path('2026/skill-hotkeys.js')
s = p.read_text(encoding='utf-8')
anchor = '''    if (!document.getElementById("shortcutQuestModernGame")) {
      const modernGame = document.createElement("link");
      modernGame.id = "shortcutQuestModernGame";
      modernGame.rel = "stylesheet";
      modernGame.href = "modern-game.css";
      document.head.appendChild(modernGame);
    }
    document.title = "Shortcut Quest 2026";
'''
replacement = '''    if (!document.getElementById("shortcutQuestModernGame")) {
      const modernGame = document.createElement("link");
      modernGame.id = "shortcutQuestModernGame";
      modernGame.rel = "stylesheet";
      modernGame.href = "modern-game.css";
      document.head.appendChild(modernGame);
    }
    if (!document.getElementById("shortcutQuestModernBattle")) {
      const modernBattle = document.createElement("link");
      modernBattle.id = "shortcutQuestModernBattle";
      modernBattle.rel = "stylesheet";
      modernBattle.href = "modern-battle.css";
      document.head.appendChild(modernBattle);
    }
    document.title = "Shortcut Quest 2026";
'''
if anchor not in s:
    raise SystemExit('modern battle loader anchor not found')
p.write_text(s.replace(anchor, replacement, 1), encoding='utf-8')
