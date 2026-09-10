from pathlib import Path

index = Path('2026/index.html')
s = index.read_text(encoding='utf-8-sig')

replacements = {
    '        actionCard.className = "card action-card";': '        actionCard.className = "action-card section-actions";',
    '        checkBtn.textContent = `✅ ${checkLabel}`;': '        checkBtn.innerHTML = `<svg class="section-action-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg><span>${checkLabel}</span>`;',
    '        resetBtn.textContent = `🔄 ${resetLabel}`;': '        resetBtn.innerHTML = `<svg class="section-action-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v6h6"/></svg><span>${resetLabel}</span>`;',
    '        wrapper.appendChild(actionCard);': '''        const readCheckableValue = field => {
          if (field.classList.contains("dnd-target")) {
            const slot = field.querySelector(".drop-slot");
            return slot ? (slot.dataset.value || slot.textContent || "").trim() : "";
          }
          if (field.classList.contains("narrative-blank")) {
            return (field.dataset.value || field.textContent || "").trim();
          }
          if (field.tagName === "SELECT" || field.tagName === "INPUT") {
            return String(field.value || "").trim();
          }
          return "";
        };
        const updateCheckReadyState = () => {
          const fields = Array.from(contentCard.querySelectorAll("[data-answer], .dnd-target"));
          const ready = fields.length > 0 && fields.every(field => Boolean(readCheckableValue(field)));
          checkBtn.classList.toggle("is-ready", ready && checkBtn.dataset.checked !== "true");
          checkBtn.setAttribute("aria-label", ready ? `${checkLabel} – bereit` : checkLabel);
        };
        const scheduleReadyRefresh = event => {
          if (event.target.closest(".check-section")) {
            checkBtn.dataset.checked = "true";
            checkBtn.classList.remove("is-ready");
            return;
          }
          if (!event.target.closest(".reset-section")) checkBtn.dataset.checked = "false";
          setTimeout(updateCheckReadyState, 0);
        };
        ["input", "change", "click", "drop"].forEach(type => contentCard.addEventListener(type, scheduleReadyRefresh));
        requestAnimationFrame(updateCheckReadyState);
        contentCard.appendChild(actionCard);'''
}

for old, new in replacements.items():
    if old not in s:
        raise SystemExit(f'index anchor not found: {old[:80]}')
    s = s.replace(old, new, 1)

index.write_text(s, encoding='utf-8')

css = Path('2026/modern-exercises.css')
c = css.read_text(encoding='utf-8')
marker = '/* INTEGRATED SECTION ACTIONS ------------------------------------------ */'
if marker in c:
    raise SystemExit('integrated section actions block already exists')

block = r'''

/* INTEGRATED SECTION ACTIONS ------------------------------------------ */
#learnSections .card--section > .section-actions {
  display: grid;
  grid-template-columns: max-content max-content minmax(0, 1fr);
  align-items: center;
  gap: .7rem;
  margin: 0;
  padding: .9rem 1.35rem 1.15rem 1.45rem;
  border: 0;
  border-top: 1px solid rgba(148, 163, 184, .11);
  border-radius: 0;
  background: linear-gradient(180deg, rgba(15, 23, 42, .08), rgba(7, 16, 31, .28));
  box-shadow: none;
}

#learnSections .section-actions button {
  width: auto;
  min-width: 0;
  margin: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .48rem;
  cursor: pointer;
}

#learnSections .section-actions .section-action-icon {
  width: 1.05rem;
  height: 1.05rem;
  flex: 0 0 auto;
}

#learnSections .section-actions .check-section {
  min-height: 48px;
  padding: .72rem 1.05rem;
  border: 1px solid rgba(251, 191, 36, .58);
  border-radius: .88rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #172033;
  font-size: .9rem;
  font-weight: 850;
  letter-spacing: -.01em;
  box-shadow: 0 8px 22px rgba(245, 158, 11, .12), inset 0 1px 0 rgba(255, 255, 255, .28);
  transition: transform .16s ease, box-shadow .16s ease, filter .16s ease;
}

#learnSections .section-actions .check-section:hover {
  transform: translateY(-1px);
  filter: brightness(1.035);
  box-shadow: 0 11px 28px rgba(245, 158, 11, .18), inset 0 1px 0 rgba(255, 255, 255, .30);
}

#learnSections .section-actions .reset-section {
  min-height: 42px;
  padding: .6rem .76rem;
  border: 1px solid rgba(148, 163, 184, .18);
  border-radius: .78rem;
  background: rgba(15, 23, 42, .28);
  color: #91a4bd;
  font-size: .78rem;
  font-weight: 700;
  box-shadow: none;
  transition: color .15s ease, border-color .15s ease, background .15s ease;
}

#learnSections .section-actions .reset-section:hover {
  color: #dbe7f5;
  border-color: rgba(148, 163, 184, .32);
  background: rgba(30, 41, 59, .52);
}

#learnSections .section-actions .result-text {
  grid-column: 3;
  margin: 0;
  min-width: 0;
  color: #9fb0c7;
}

@keyframes sq-ready-check-pulse {
  0%, 100% {
    box-shadow: 0 8px 22px rgba(245, 158, 11, .12), 0 0 0 0 rgba(251, 191, 36, 0), inset 0 1px 0 rgba(255,255,255,.28);
  }
  45% {
    box-shadow: 0 10px 26px rgba(245, 158, 11, .24), 0 0 0 5px rgba(251, 191, 36, .16), inset 0 1px 0 rgba(255,255,255,.32);
  }
}

#learnSections .section-actions .check-section.is-ready {
  animation: sq-ready-check-pulse 1.45s ease-in-out 2;
}

@media (prefers-reduced-motion: reduce) {
  #learnSections .section-actions .check-section.is-ready { animation: none; }
}

@media (max-width: 700px) {
  #learnSections .card--section > .section-actions {
    grid-template-columns: minmax(0, 1fr) auto;
    padding: .85rem 1rem 1rem;
    gap: .55rem;
  }
  #learnSections .section-actions .check-section {
    width: 100%;
  }
  #learnSections .section-actions .reset-section {
    padding-inline: .68rem;
  }
  #learnSections .section-actions .result-text {
    grid-column: 1 / -1;
  }
}
'''
css.write_text(c + block, encoding='utf-8')
