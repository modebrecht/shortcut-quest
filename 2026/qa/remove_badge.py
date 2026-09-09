from pathlib import Path

p = Path('2026/skill-hotkeys.js')
s = p.read_text(encoding='utf-8')
start = s.find('      if (!document.getElementById("tk2EditionBadge")) {')
if start < 0:
    raise SystemExit('TK2 badge block not found')
end_marker = '      }\n'
end = s.find(end_marker, start)
if end < 0:
    raise SystemExit('TK2 badge block end not found')
end += len(end_marker)
p.write_text(s[:start] + s[end:], encoding='utf-8')
