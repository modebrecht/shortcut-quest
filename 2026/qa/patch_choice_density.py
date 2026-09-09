from pathlib import Path

p = Path('2026/skill-hotkeys.js')
s = p.read_text(encoding='utf-8')

old = '''    const options = Array.from(select.options).filter(option => option.value);
    if (!options.length) return;
'''
new = '''    const allOptions = Array.from(select.options).filter(option => option.value);
    if (!allOptions.length) return;
    const answerValue = select.dataset.answer || "";
    const currentValue = select.value || "";
    let options = allOptions;
    if (allOptions.length > 4) {
      const correctOption = allOptions.find(option => option.value === answerValue) || null;
      const currentOption = currentValue && currentValue !== answerValue
        ? allOptions.find(option => option.value === currentValue) || null
        : null;
      const distractors = allOptions.filter(option => option !== correctOption && option !== currentOption);
      const seedText = `${select.closest(".task-field")?.querySelector(".question-text")?.textContent || ""}|${answerValue}`;
      const seed = Array.from(seedText).reduce((sum, char) => (sum + char.charCodeAt(0)) % 997, 0);
      const rotated = distractors.length
        ? distractors.map((_, index) => distractors[(index + (seed % distractors.length)) % distractors.length])
        : [];
      const picked = [];
      if (currentOption) picked.push(currentOption);
      for (const option of rotated) {
        if (picked.length >= 3) break;
        if (!picked.includes(option)) picked.push(option);
      }
      options = correctOption ? [correctOption, ...picked].slice(0, 4) : allOptions.slice(0, 4);
      if (options.length > 1) {
        const shift = seed % options.length;
        options = options.map((_, index) => options[(index + shift) % options.length]);
      }
    }
'''
if old not in s:
    raise SystemExit('choice options anchor not found')
s = s.replace(old, new, 1)

old_css = '''      .a8-choice-options { display:grid;grid-template-columns:repeat(auto-fit,minmax(112px,1fr));gap:.55rem;width:100%; }
'''
new_css = '''      #learnSections .a8-choice-options { display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.55rem;width:100%;max-width:980px; }
'''
if old_css not in s:
    raise SystemExit('choice grid css anchor not found')
s = s.replace(old_css, new_css, 1)

old_hover = '''      .a8-choice-option:hover:not(:disabled),.a8-combo-bank-option:hover:not(:disabled),.a8-combo-slot-button:hover:not(:disabled) { border-color:var(--accent);background:rgba(245,158,11,.14);transform:translateY(-1px); }
'''
new_hover = '''      #learnSections .a8-choice-option:hover:not(:disabled):not(.selected),#learnSections .a8-choice-option:focus-visible:not(:disabled):not(.selected) { border-color:rgba(96,165,250,.62);background:rgba(37,99,235,.16);box-shadow:0 0 0 2px rgba(96,165,250,.10);transform:translateY(-1px);outline:none; }
      .a8-combo-bank-option:hover:not(:disabled),.a8-combo-slot-button:hover:not(:disabled) { border-color:rgba(96,165,250,.55);background:rgba(37,99,235,.14);transform:translateY(-1px); }
'''
if old_hover not in s:
    raise SystemExit('choice hover css anchor not found')
s = s.replace(old_hover, new_hover, 1)

old_mobile = '''        .a8-choice-options { grid-template-columns:repeat(2,minmax(0,1fr)); }
'''
new_mobile = '''        #learnSections .a8-choice-options { grid-template-columns:repeat(2,minmax(0,1fr)); }
'''
if old_mobile not in s:
    raise SystemExit('mobile grid css anchor not found')
s = s.replace(old_mobile, new_mobile, 1)

p.write_text(s, encoding='utf-8')
