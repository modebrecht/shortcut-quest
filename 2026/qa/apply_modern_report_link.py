from pathlib import Path

p = Path('2026/skill-hotkeys.js')
s = p.read_text(encoding='utf-8')
anchor = '''    if (!document.getElementById("shortcutQuestModernBattle")) {
      const modernBattle = document.createElement("link");
      modernBattle.id = "shortcutQuestModernBattle";
      modernBattle.rel = "stylesheet";
      modernBattle.href = "modern-battle.css";
      document.head.appendChild(modernBattle);
    }
    document.title = "Shortcut Quest 2026";
'''
replacement = '''    if (!document.getElementById("shortcutQuestModernBattle")) {
      const modernBattle = document.createElement("link");
      modernBattle.id = "shortcutQuestModernBattle";
      modernBattle.rel = "stylesheet";
      modernBattle.href = "modern-battle.css";
      document.head.appendChild(modernBattle);
    }
    if (!document.getElementById("shortcutQuestModernReport")) {
      const modernReport = document.createElement("link");
      modernReport.id = "shortcutQuestModernReport";
      modernReport.rel = "stylesheet";
      modernReport.href = "modern-report.css";
      document.head.appendChild(modernReport);
    }
    document.title = "Shortcut Quest 2026";
'''
if anchor not in s:
    raise SystemExit('modern report loader anchor not found')
p.write_text(s.replace(anchor, replacement, 1), encoding='utf-8')
