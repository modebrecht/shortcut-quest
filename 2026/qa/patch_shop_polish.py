from pathlib import Path

# Make the shop CTA source-clean and more game-like.
index_path = Path('2026/index.html')
raw = index_path.read_bytes()
old_btn = '<button id="gachaBtn" class="shop-buy-btn"><span class="emoji">🛍️</span>Item kaufen (20x Coins)</button>'.encode('utf-8')
new_btn = '''<button id="gachaBtn" class="shop-buy-btn"><svg class="shop-buy-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/><circle cx="17.5" cy="17" r="2.2" fill="currentColor" stroke="none"/></svg><span>Kaufen</span><span class="shop-buy-price">20 Coins</span></button>'''.encode('utf-8')
if old_btn not in raw:
    raise SystemExit('shop CTA anchor missing')
raw = raw.replace(old_btn, new_btn, 1)
index_path.write_bytes(raw)

css_path = Path('2026/modern-game.css')
css = css_path.read_text(encoding='utf-8')
marker = '/* SHOP FOCUS POLISH --------------------------------------------------- */'
if marker not in css:
    css += r'''

/* SHOP FOCUS POLISH --------------------------------------------------- */
#shopView .game-grid {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
}

#shopView .game-grid > .card {
  padding: .92rem !important;
  overflow: hidden;
}

#shopView .gacha-options {
  display: grid !important;
  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  gap: .5rem !important;
  margin: 0 !important;
}

#shopView .gacha-option {
  min-width: 0;
  min-height: 86px !important;
  padding: .62rem .68rem !important;
  grid-template-columns: 44px minmax(0, 1fr) !important;
  border-radius: .92rem !important;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

#shopView .gacha-option input[type="radio"] {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

#shopView .gacha-option .gacha-icon {
  width: 44px !important;
  height: 44px !important;
  border-radius: .72rem !important;
}

#shopView .gacha-label {
  font-size: .84rem !important;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#shopView .gacha-remaining {
  font-size: .66rem !important;
  line-height: 1.2;
  opacity: .82;
}

#shopView .gacha-option.active {
  border-color: rgba(251,191,36,.50) !important;
  background:
    radial-gradient(170px 100px at 18% 45%, rgba(251,191,36,.14), transparent 74%),
    linear-gradient(145deg, rgba(91,61,7,.28), rgba(25,25,32,.36)) !important;
  box-shadow: inset 0 0 0 1px rgba(251,191,36,.08), 0 10px 24px rgba(245,158,11,.09) !important;
}

#shopView .gacha-option.active::after {
  content: "";
  position: absolute;
  left: .68rem;
  right: .68rem;
  bottom: 0;
  height: 2px;
  border-radius: 999px 999px 0 0;
  background: rgba(251,191,36,.92);
}

#shopView #gachaBtn.shop-buy-btn {
  width: 100%;
  min-height: 54px !important;
  margin-top: .62rem !important;
  padding: .62rem .82rem !important;
  display: grid;
  grid-template-columns: 22px 1fr auto;
  align-items: center;
  gap: .58rem;
  border-radius: .88rem !important;
  text-align: left;
}

#shopView #gachaBtn .shop-buy-icon {
  width: 20px;
  height: 20px;
}

#shopView #gachaBtn > span:not(.shop-buy-price) {
  font-size: .9rem;
  font-weight: 900;
}

#shopView #gachaBtn .shop-buy-price {
  padding: .28rem .48rem;
  border-radius: 999px;
  border: 1px solid rgba(23,32,51,.20);
  background: rgba(255,255,255,.22);
  font-size: .72rem;
  font-weight: 850;
  white-space: nowrap;
}

#shopView .shop-latest {
  margin-top: .64rem !important;
  padding-top: .58rem;
  border-top: 1px solid rgba(148,163,184,.10);
}

#shopView .shop-latest h3 {
  margin: 0 !important;
  font-size: .7rem !important;
  color: #8498b3 !important;
}

#shopView .shop-latest-empty {
  margin: .32rem 0 0;
  color: #71849d;
  font-size: .72rem;
}

@media (max-width: 900px) {
  #shopView .gacha-options {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}

@media (max-width: 520px) {
  #shopView .game-grid > .card {
    padding: .68rem !important;
  }

  #shopView .gacha-options {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: .38rem !important;
  }

  #shopView .gacha-option {
    min-height: 74px !important;
    padding: .5rem !important;
    grid-template-columns: 38px minmax(0, 1fr) !important;
    column-gap: .48rem !important;
  }

  #shopView .gacha-option .gacha-icon {
    width: 38px !important;
    height: 38px !important;
  }

  #shopView .gacha-label {
    font-size: .76rem !important;
  }

  #shopView #gachaBtn.shop-buy-btn {
    min-height: 50px !important;
  }
}
'''
    css_path.write_text(css, encoding='utf-8')

smoke_path = Path('2026/qa/browser-smoke.mjs')
smoke = smoke_path.read_text(encoding='utf-8')
anchor = "  await page.locator('#gachaBtn').click();\n  await page.waitForTimeout(250);\n"
insert = "  const shopColumns = await page.locator('#shopView .gacha-options').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length);\n  assert.equal(shopColumns, 4, 'Desktop shop should show four balanced category tiles');\n  assert.equal(await page.locator('#shopView .gacha-option').count(), 4, 'Shop should expose four purchase categories');\n  const shopOverflow = await page.locator('#shopView .game-grid > .card').evaluate(el => el.scrollWidth > el.clientWidth + 2);\n  assert.equal(shopOverflow, false, 'Shop card must not overflow horizontally');\n  assert.ok((await page.locator('#gachaBtn').textContent()).includes('20 Coins'), 'Shop CTA should show its 20 coin price clearly');\n  await page.locator('#gachaBtn').click();\n  await page.waitForTimeout(250);\n"
if anchor not in smoke:
    raise SystemExit('shop smoke anchor missing')
smoke = smoke.replace(anchor, insert, 1)
smoke_path.write_text(smoke, encoding='utf-8')

print('shop focus polish applied')
