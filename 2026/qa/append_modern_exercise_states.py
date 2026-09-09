from pathlib import Path

p = Path('2026/modern-exercises.css')
s = p.read_text(encoding='utf-8')
marker = '/* PASS 2 STATE HARDENING */'
if marker in s:
    raise SystemExit('state hardening already present')
block = r'''

/* PASS 2 STATE HARDENING */
#learnSections .fast-paced-option.correct {
  border-color: rgba(34, 197, 94, .58) !important;
  background: linear-gradient(145deg, rgba(22, 101, 52, .28), rgba(12, 37, 31, .78)) !important;
  color: #dcfce7 !important;
}

#learnSections .fast-paced-option.incorrect {
  border-color: rgba(248, 113, 113, .52) !important;
  background: linear-gradient(145deg, rgba(127, 29, 29, .25), rgba(48, 23, 31, .78)) !important;
  color: #fee2e2 !important;
}

#learnSections .a8-filtered-combo .combo-slot select.correct {
  border-color: rgba(34, 197, 94, .58) !important;
  background-color: rgba(20, 70, 45, .72) !important;
  color: #dcfce7 !important;
}

#learnSections .a8-filtered-combo .combo-slot select.incorrect {
  border-color: rgba(248, 113, 113, .52) !important;
  background-color: rgba(74, 30, 38, .72) !important;
  color: #fee2e2 !important;
}

#learnSections .a8-dnd-assignment.correct {
  border-color: rgba(34, 197, 94, .34) !important;
  background: rgba(22, 101, 52, .10) !important;
  color: #bbf7d0 !important;
}

#learnSections .a8-dnd-assignment.incorrect {
  border-color: rgba(248, 113, 113, .34) !important;
  background: rgba(127, 29, 29, .10) !important;
  color: #fecaca !important;
}
'''
p.write_text(s.rstrip() + block + '\n', encoding='utf-8')
