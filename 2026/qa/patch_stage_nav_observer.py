from pathlib import Path

path = Path('2026/skill-hotkeys.js')
text = path.read_text(encoding='utf-8')
old = '''        if (!label || !number) return;
        label.textContent = tab.dataset.baseLabel || `Abschnitt ${number}`;
'''
new = '''        if (!label || !number) return;
        const targetLabel = tab.dataset.baseLabel || `Abschnitt ${number}`;
        if (label.textContent !== targetLabel) label.textContent = targetLabel;
'''
if old not in text:
    raise SystemExit('stage label normalization anchor not found')
path.write_text(text.replace(old, new, 1), encoding='utf-8')
