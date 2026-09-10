from pathlib import Path

js_path = Path('2026/skill-hotkeys.js')
js = js_path.read_text(encoding='utf-8')
marker = '  function install2026SectionStageNav() {'
if marker in js:
    raise SystemExit('stage nav already installed')

anchor = '  if (typeof document !== "undefined") {\n'
if anchor not in js:
    raise SystemExit('skill-hotkeys install anchor not found')

fn = r'''  function install2026SectionStageNav() {
    if (typeof document === "undefined") return;
    const tabsHost = document.getElementById("sectionTabs");
    if (!tabsHost || tabsHost.dataset.stageNavInstalled === "true") return;
    const navCard = tabsHost.closest(".nav-card");
    if (!navCard) return;

    const stageNav = document.createElement("div");
    stageNav.id = "a8SectionStageNav";
    stageNav.className = "section-stage-nav";

    const meta = document.createElement("div");
    meta.className = "section-stage-meta";
    meta.innerHTML = '<strong>30 Abschnitte</strong><span>3 Etappen</span>';

    const controls = document.createElement("div");
    controls.className = "section-stage-controls";
    stageNav.appendChild(meta);
    stageNav.appendChild(controls);
    navCard.insertBefore(stageNav, tabsHost);

    const sectionNumber = tab => Number(tab?.dataset?.sectionId || tab?.dataset?.goto || 0);
    let activeStage = 0;

    const stageButtons = Array.from({ length: 3 }, (_, stageIndex) => {
      const start = stageIndex * 10 + 1;
      const end = start + 9;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "section-stage-button";
      button.dataset.stage = String(stageIndex);
      button.innerHTML = `<span class="section-stage-range">${start}–${end}</span><span class="section-stage-progress">gesperrt</span>`;
      button.addEventListener("click", () => {
        if (button.disabled) return;
        showStage(stageIndex, true);
      });
      controls.appendChild(button);
      return button;
    });

    const normalizeTabLabels = tabs => {
      tabs.forEach(tab => {
        const label = tab.querySelector(".section-tab-label");
        const number = sectionNumber(tab);
        if (!label || !number) return;
        label.textContent = tab.dataset.baseLabel || `Abschnitt ${number}`;
      });
    };

    const updateStageButtons = tabs => {
      stageButtons.forEach((button, stageIndex) => {
        const start = stageIndex * 10 + 1;
        const end = start + 9;
        const stageTabs = tabs.filter(tab => {
          const number = sectionNumber(tab);
          return number >= start && number <= end;
        });
        const completed = stageTabs.filter(tab => tab.classList.contains("completed")).length;
        const available = stageTabs.length > 0;
        button.disabled = !available;
        button.classList.toggle("active", stageIndex === activeStage);
        const progress = button.querySelector(".section-stage-progress");
        if (progress) progress.textContent = available ? `${completed}/10` : "gesperrt";
        button.setAttribute("aria-label", available
          ? `Abschnitte ${start} bis ${end}, ${completed} von 10 abgeschlossen`
          : `Abschnitte ${start} bis ${end}, noch gesperrt`);
      });
    };

    function showStage(stageIndex, selectFirst = false) {
      const tabs = Array.from(tabsHost.querySelectorAll(".section-tab"));
      const start = stageIndex * 10 + 1;
      const end = start + 9;
      const visibleTabs = tabs.filter(tab => {
        const number = sectionNumber(tab);
        return number >= start && number <= end;
      });
      if (!visibleTabs.length) return false;

      activeStage = stageIndex;
      tabsHost.dataset.stage = String(stageIndex + 1);
      tabs.forEach(tab => {
        const number = sectionNumber(tab);
        tab.hidden = number < start || number > end;
      });
      normalizeTabLabels(tabs);
      updateStageButtons(tabs);

      if (selectFirst && !visibleTabs.some(tab => tab.classList.contains("active"))) {
        visibleTabs[0].click();
      }
      return true;
    }

    const initialTabs = Array.from(tabsHost.querySelectorAll(".section-tab"));
    normalizeTabLabels(initialTabs);
    const initialActive = initialTabs.find(tab => tab.classList.contains("active"));
    const initialNumber = sectionNumber(initialActive) || sectionNumber(initialTabs[0]) || 1;
    activeStage = Math.max(0, Math.min(2, Math.floor((initialNumber - 1) / 10)));
    let previousMaxStage = initialTabs.length
      ? Math.max(...initialTabs.map(sectionNumber).filter(Boolean).map(number => Math.floor((number - 1) / 10)))
      : 0;
    showStage(activeStage, false);

    tabsHost.addEventListener("click", event => {
      const tab = event.target.closest(".section-tab");
      if (!tab) return;
      const number = sectionNumber(tab);
      if (!number) return;
      activeStage = Math.floor((number - 1) / 10);
      setTimeout(() => {
        const tabs = Array.from(tabsHost.querySelectorAll(".section-tab"));
        normalizeTabLabels(tabs);
        updateStageButtons(tabs);
      }, 0);
    });

    const observer = new MutationObserver(() => {
      const tabs = Array.from(tabsHost.querySelectorAll(".section-tab"));
      if (!tabs.length) return;
      normalizeTabLabels(tabs);
      const maxStage = Math.max(...tabs.map(sectionNumber).filter(Boolean).map(number => Math.floor((number - 1) / 10)));
      if (maxStage > previousMaxStage) {
        previousMaxStage = maxStage;
        showStage(maxStage, true);
        return;
      }
      showStage(activeStage, false);
    });
    observer.observe(tabsHost, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    tabsHost.dataset.stageNavInstalled = "true";
  }

'''
js = js.replace(anchor, fn + anchor, 1)

old_install = '''    const installAfterRuntime = () => queueMicrotask(() => {
      install2026EconomyOverrides();
      install2026Interactions();
    });'''
new_install = '''    const installAfterRuntime = () => queueMicrotask(() => {
      install2026EconomyOverrides();
      install2026Interactions();
      install2026SectionStageNav();
    });'''
if old_install not in js:
    raise SystemExit('installAfterRuntime anchor not found')
js = js.replace(old_install, new_install, 1)
js_path.write_text(js, encoding='utf-8')

css_path = Path('2026/modern-ui.css')
css = css_path.read_text(encoding='utf-8')
css_marker = '/* SECTION STAGE NAVIGATION ------------------------------------------- */'
if css_marker in css:
    raise SystemExit('stage nav css already installed')

css_block = r'''

/* SECTION STAGE NAVIGATION ------------------------------------------- */
.section-stage-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
  margin: .02rem .05rem .48rem;
}

.section-stage-meta {
  display: flex;
  align-items: baseline;
  gap: .45rem;
  white-space: nowrap;
}

.section-stage-meta strong {
  color: #dce7f5;
  font-size: .76rem;
  font-weight: 850;
}

.section-stage-meta span {
  color: #71849d;
  font-size: .68rem;
  font-weight: 700;
}

.section-stage-controls {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  width: min(100%, 390px);
  gap: .28rem;
  padding: .22rem;
  border: 1px solid rgba(148, 163, 184, .10);
  border-radius: .78rem;
  background: rgba(7, 16, 31, .34);
}

.section-stage-button {
  min-height: 34px;
  padding: .3rem .5rem;
  border: 1px solid transparent;
  border-radius: .62rem;
  background: transparent;
  color: #8092a9;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .38rem;
  font: inherit;
  cursor: pointer;
  transition: background .14s ease, border-color .14s ease, color .14s ease;
}

.section-stage-button:hover:not(:disabled):not(.active) {
  color: #dbe7f5;
  background: rgba(148, 163, 184, .08);
}

.section-stage-button.active {
  color: #172033;
  border-color: rgba(251, 191, 36, .62);
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.section-stage-button:disabled {
  cursor: default;
  opacity: .38;
}

.section-stage-range {
  font-size: .74rem;
  font-weight: 850;
}

.section-stage-progress {
  font-size: .62rem;
  font-weight: 800;
  opacity: .72;
}

#sectionTabs .section-tab[hidden] {
  display: none !important;
}

/* Completed sections keep their full label; completion is additive, not a replacement. */
#sectionTabs .section-tab.completed:not(.active) {
  min-width: max-content;
}

#sectionTabs .section-tab-label {
  white-space: nowrap;
}

@media (max-width: 700px) {
  .section-stage-nav {
    align-items: stretch;
    flex-direction: column;
    gap: .42rem;
  }
  .section-stage-meta {
    justify-content: space-between;
  }
  .section-stage-controls {
    width: 100%;
  }
  .section-stage-button {
    min-height: 38px;
  }
}
'''
css_path.write_text(css + css_block, encoding='utf-8')
