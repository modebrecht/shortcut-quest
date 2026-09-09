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

header_helpers_anchor = '''  function renderSharedXP() {
'''
header_helpers = r'''  function headerIconSvg(name) {
    const paths = {
      training: '<circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3M22 12h-3M12 22v-3M2 12h3"></path>',
      inventory: '<path d="M7 8V6a5 5 0 0 1 10 0v2"></path><path d="M5 8h14l1 12H4L5 8Z"></path><path d="M9 12v1M15 12v1"></path>',
      skills: '<path d="m12 2 1.7 5.1L19 9l-5.3 1.9L12 16l-1.7-5.1L5 9l5.3-1.9L12 2Z"></path><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"></path>',
      shop: '<path d="M4 10v10h16V10"></path><path d="M3 10 5 4h14l2 6"></path><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"></path><path d="M9 20v-5h6v5"></path>',
      battle: '<path d="m5 3 6 6-2 2-6-6V3h2Z"></path><path d="m19 3-6 6 2 2 6-6V3h-2Z"></path><path d="m8 12-5 5 4 4 5-5"></path><path d="m16 12 5 5-4 4-5-5"></path>',
      report: '<path d="M4 20V10h4v10H4Zm6 0V4h4v16h-4Zm6 0v-7h4v7h-4Z"></path>',
      bolt: '<path d="M13 2 5 13h6l-1 9 8-12h-6l1-8Z"></path>',
      coin: '<circle cx="12" cy="12" r="9"></circle><path d="M15.2 8.5c-.8-.8-1.8-1.2-3.2-1.2-1.8 0-3 .8-3 2s1 1.8 3 2.2 3 .9 3 2.2-1.2 2.3-3 2.3c-1.4 0-2.6-.4-3.5-1.3M12 5.5v13"></path>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"></path>'
    };
    const body = paths[name] || paths.training;
    return `<svg class="sq-header-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  }

  function renderHeaderCoin() {
    if (typeof document === "undefined") return;
    const badge = document.getElementById("coinTop");
    if (!badge) return;
    if (badge.querySelector(".sq-header-icon")) return;
    const match = String(badge.textContent || "").match(/-?\d[\d'’.,]*/);
    const value = match ? match[0] : "0";
    badge.innerHTML = `${headerIconSvg("coin")}<span>Coins: ${value}</span>`;
  }

  function ensureHeaderSvgIcons() {
    if (typeof document === "undefined") return;
    const header = document.querySelector("header");
    if (!header) return;
    header.querySelectorAll(".emoji").forEach(node => node.remove());
    const navIcons = {
      learn: "training",
      inventory: "inventory",
      skills: "skills",
      shop: "shop",
      battle: "battle",
      report: "report"
    };
    header.querySelectorAll(".nav-toggle[data-view]").forEach(button => {
      if (button.querySelector(".sq-header-icon")) return;
      const icon = navIcons[button.dataset.view] || "training";
      button.insertAdjacentHTML("afterbegin", headerIconSvg(icon));
    });
    const mobile = document.getElementById("mobileNavToggle");
    if (mobile && !mobile.querySelector(".sq-header-icon")) {
      mobile.innerHTML = `${headerIconSvg("menu")}<span>Menü</span>`;
    }
    renderHeaderCoin();
    const coin = document.getElementById("coinTop");
    if (coin && !coin.__sqHeaderObserver) {
      const observer = new MutationObserver(() => queueMicrotask(renderHeaderCoin));
      observer.observe(coin, { childList: true, characterData: true, subtree: true });
      coin.__sqHeaderObserver = observer;
    }
  }

  function renderSharedXP() {
'''
if header_helpers_anchor not in s:
    raise SystemExit('header helpers anchor not found')
s = s.replace(header_helpers_anchor, header_helpers, 1)

old_xp = '''    badge.textContent = `⚡ XP: ${getSharedXP()}`;
'''
new_xp = '''    badge.innerHTML = `${headerIconSvg("bolt")}<span>XP: ${getSharedXP()}</span>`;
'''
if old_xp not in s:
    raise SystemExit('XP badge anchor not found')
s = s.replace(old_xp, new_xp, 1)

install_anchor = '''    injectChoiceStyles();
    renderSharedXP();
    upgradeAllInteractiveUI();
'''
install_new = '''    injectChoiceStyles();
    renderSharedXP();
    ensureHeaderSvgIcons();
    upgradeAllInteractiveUI();
'''
if install_anchor not in s:
    raise SystemExit('interaction install anchor not found')
s = s.replace(install_anchor, install_new, 1)

style_anchor = '''      #overviewCard { display:none!important; }
'''
style_new = '''      #overviewCard { display:none!important; }
      header .nav-toggle,header .mobile-nav-toggle,header .header-right .badge { display:inline-flex;align-items:center;gap:.42rem; }
      header .sq-header-icon { width:1rem;height:1rem;flex:0 0 auto;display:block; }
      header .nav-toggle .sq-header-icon { opacity:.82; }
      header .nav-toggle.active .sq-header-icon { opacity:1; }
      header #a8XpTop .sq-header-icon { color:#93c5fd; }
      header #coinTop .sq-header-icon { color:#fbbf24; }
      header .mobile-nav-toggle .sq-header-icon { width:1.05rem;height:1.05rem; }
'''
if style_anchor not in s:
    raise SystemExit('header style anchor not found')
s = s.replace(style_anchor, style_new, 1)

p.write_text(s, encoding='utf-8')
