from pathlib import Path

path = Path('2026/modern-exercises.css')
css = path.read_text(encoding='utf-8')
marker = '/* UNAMBIGUOUS CHOICE STATES ------------------------------------------ */'
if marker in css:
    raise SystemExit('choice state override already exists')

block = r'''

/* UNAMBIGUOUS CHOICE STATES ------------------------------------------ */
/* Neutral buttons stay neutral. Hover and focus must never look selected. */
#learnSections .a8-choice-option:not(.selected):not(.correct):not(.correct-answer):not(.wrong) {
  border-color: rgba(148, 163, 184, .17) !important;
  background: linear-gradient(145deg, rgba(28, 42, 66, .82), rgba(13, 24, 43, .88)) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .025) !important;
}

#learnSections .a8-choice-option:not(.selected):not(.correct):not(.correct-answer):not(.wrong):hover:not(:disabled):not(.removed) {
  transform: translateY(-1px);
  border-color: rgba(96, 165, 250, .38) !important;
  background: linear-gradient(145deg, rgba(30, 45, 70, .86), rgba(15, 27, 47, .90)) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .03) !important;
}

#learnSections .a8-choice-option:focus {
  outline: none;
}

#learnSections .a8-choice-option:focus-visible:not(.selected):not(.correct):not(.correct-answer):not(.wrong) {
  outline: 2px solid rgba(96, 165, 250, .58);
  outline-offset: 3px;
  border-color: rgba(148, 163, 184, .17) !important;
  background: linear-gradient(145deg, rgba(28, 42, 66, .82), rgba(13, 24, 43, .88)) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .025) !important;
}

/* Selected is the only pre-grade filled state. */
#learnSections .a8-choice-option.selected,
#learnSections .a8-choice-option.selected:hover,
#learnSections .a8-choice-option.selected:focus,
#learnSections .a8-choice-option.selected:focus-visible {
  border-color: rgba(251, 191, 36, .88) !important;
  background: linear-gradient(145deg, rgba(120, 78, 12, .40), rgba(55, 43, 26, .82)) !important;
  box-shadow: 0 0 0 2px rgba(251, 191, 36, .10), 0 10px 24px rgba(245, 158, 11, .08) !important;
}
'''

path.write_text(css + block, encoding='utf-8')
