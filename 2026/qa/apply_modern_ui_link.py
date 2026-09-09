from pathlib import Path

p = Path('2026/skill-hotkeys.js')
s = p.read_text(encoding='utf-8')
anchor = '  if (typeof document !== "undefined") {\n    document.title = "Shortcut Quest 2026";\n'
insert = '''  if (typeof document !== "undefined") {\n    if (!document.getElementById("shortcutQuestModernUi")) {\n      const modernUi = document.createElement("link");\n      modernUi.id = "shortcutQuestModernUi";\n      modernUi.rel = "stylesheet";\n      modernUi.href = "modern-ui.css";\n      document.head.appendChild(modernUi);\n    }\n    document.title = "Shortcut Quest 2026";\n'''
if anchor not in s:
    raise SystemExit('modern UI insertion anchor not found')
p.write_text(s.replace(anchor, insert, 1), encoding='utf-8')
