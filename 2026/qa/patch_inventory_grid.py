from pathlib import Path

# Shorten the visible equipment slot labels in the legacy runtime source.
index_path = Path('2026/index.html')
raw = index_path.read_bytes()
replacements = {
    b'Ring / Amulett 1': b'Ring 1',
    b'Ring / Amulett 2': b'Ring 2',
    b'Schwert 2 / Schild': b'Nebenhand',
}
for old, new in replacements.items():
    if old not in raw:
        raise SystemExit(f'missing inventory label anchor: {old!r}')
    raw = raw.replace(old, new)
index_path.write_bytes(raw)

# Append a final, intentionally strong layout layer so old row/mobile rules cannot
# re-introduce overlap. The DOM order is already exactly the desired 3x3 order:
# gloves / helm / necklace, weapon / hero / offhand, ring1 / boots / ring2.
css_path = Path('2026/modern-game.css')
css = css_path.read_text(encoding='utf-8')
marker = '/* INVENTORY 3X3 LOADOUT REPAIR --------------------------------------- */'
if marker not in css:
    css += r'''

/* INVENTORY 3X3 LOADOUT REPAIR --------------------------------------- */
#inventoryView .equipment-layout {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(150px, 1fr));
  gap: .68rem !important;
  width: 100%;
  padding: .72rem !important;
  align-items: stretch !important;
  justify-items: stretch !important;
  overflow: hidden;
}

/* Flatten the historical row wrappers into one real 3x3 equipment grid. */
#inventoryView .equipment-layout > .slot-row {
  display: contents !important;
}

#inventoryView .equipment-slot {
  min-width: 0 !important;
  width: auto !important;
  height: auto !important;
  min-height: 150px !important;
  padding: .62rem !important;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  display: block;
}

#inventoryView .equipment-slot .slot-body,
#inventoryView .equipment-slot.equipped .slot-body {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto minmax(78px, 1fr) auto;
  align-items: stretch !important;
  gap: .42rem !important;
  width: 100%;
  height: 100%;
}

#inventoryView .equipment-slot .slot-info {
  display: contents !important;
}

#inventoryView .equipment-slot .slot-header {
  grid-row: 1;
  min-width: 0;
  width: 100%;
  min-height: 1rem;
  display: flex;
  align-items: center;
  color: #aebed2;
  font-size: .65rem;
  font-weight: 850;
  letter-spacing: .07em;
  line-height: 1.15;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#inventoryView .equipment-slot .slot-icon {
  grid-row: 2;
  width: 100% !important;
  min-width: 0 !important;
  max-width: none !important;
  height: 100% !important;
  min-height: 78px !important;
  max-height: none !important;
  margin: 0;
  display: grid;
  place-items: center;
  border-radius: .78rem;
  border: 1px solid rgba(148,163,184,.13);
  background:
    radial-gradient(circle at 50% 42%, rgba(59,130,246,.08), transparent 58%),
    rgba(3,8,23,.56);
}

#inventoryView .equipment-slot .slot-icon img,
#inventoryView .equipment-slot .slot-icon svg {
  width: auto !important;
  height: auto !important;
  max-width: 78% !important;
  max-height: 78% !important;
  transform: none !important;
  object-fit: contain;
}

#inventoryView .equipment-slot .slot-stats {
  grid-row: 3;
  min-width: 0;
  min-height: 0;
  margin: 0 !important;
  gap: .24rem !important;
}

#inventoryView .equipment-slot .slot-placeholder {
  position: relative;
  display: block;
  width: 24px;
  height: 24px;
  font-size: 0 !important;
  color: transparent !important;
  opacity: .38;
}

#inventoryView .equipment-slot .slot-placeholder::before,
#inventoryView .equipment-slot .slot-placeholder::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 999px;
  background: #8fa3bb;
  transform: translate(-50%, -50%);
}

#inventoryView .equipment-slot .slot-placeholder::before {
  width: 18px;
  height: 2px;
}

#inventoryView .equipment-slot .slot-placeholder::after {
  width: 2px;
  height: 18px;
}

#inventoryView .equipment-slot .slot-unequip {
  position: absolute;
  top: .42rem;
  right: .42rem;
  z-index: 4;
}

/* The avatar is one grid cell, not a floating oversized card. */
#inventoryView .equipment-layout .hero-center,
#inventoryView .slot-row.middle-row .hero-center {
  min-width: 0 !important;
  width: auto !important;
  min-height: 150px !important;
  height: auto !important;
  padding: .5rem;
  margin: 0;
  align-self: stretch !important;
  justify-self: stretch !important;
  display: grid !important;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(96,165,250,.20);
  border-radius: 1rem;
  background:
    radial-gradient(circle at 50% 42%, rgba(59,130,246,.16), transparent 57%),
    linear-gradient(165deg, rgba(17,32,57,.92), rgba(6,15,29,.95));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.03);
}

#inventoryView .equipment-layout .hero-avatar {
  width: 100% !important;
  height: 100% !important;
  min-width: 0 !important;
  min-height: 0 !important;
  max-width: none !important;
  max-height: none !important;
  padding: .35rem !important;
  border: 0 !important;
  border-radius: .72rem !important;
  background: transparent !important;
  box-shadow: none !important;
  overflow: hidden !important;
}

#inventoryView .equipment-layout .hero-avatar .hero-illustration,
#inventoryView .equipment-layout .hero-avatar .hero-illustration.is-blueprint,
#inventoryView .equipment-layout .hero-avatar .hero-illustration.is-knight {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  padding: .2rem;
  object-fit: contain !important;
  object-position: center !important;
  transform: none !important;
}

@media (max-width: 720px) {
  #inventoryView .equipment-layout {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    grid-template-rows: repeat(3, minmax(112px, 1fr));
    gap: .38rem !important;
    padding: .42rem !important;
  }

  #inventoryView .equipment-slot,
  #inventoryView .slot-row [data-equip-slot="weapon"],
  #inventoryView .slot-row [data-equip-slot="offhand"],
  #inventoryView .equipment-layout .hero-center,
  #inventoryView .slot-row.middle-row .hero-center {
    min-height: 112px !important;
    height: auto !important;
    grid-column: auto !important;
    order: initial !important;
  }

  #inventoryView .equipment-slot {
    padding: .42rem !important;
  }

  #inventoryView .equipment-slot .slot-body {
    grid-template-rows: auto minmax(58px, 1fr) auto;
    gap: .28rem !important;
  }

  #inventoryView .equipment-slot .slot-header {
    font-size: .54rem;
    letter-spacing: .045em;
  }

  #inventoryView .equipment-slot .slot-icon {
    min-height: 58px !important;
  }
}

@media (max-width: 460px) {
  #inventoryView .equipment-layout {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: .28rem !important;
    padding: .32rem !important;
  }

  #inventoryView .equipment-slot,
  #inventoryView .equipment-layout .hero-center {
    min-height: 100px !important;
  }

  #inventoryView .equipment-slot .slot-header {
    font-size: .49rem;
  }
}
'''
css_path.write_text(css, encoding='utf-8')

# Add regression checks to the existing browser smoke near the inventory flow.
smoke_path = Path('2026/qa/browser-smoke.mjs')
smoke = smoke_path.read_text(encoding='utf-8')
anchor = "  await page.locator('.nav-toggle[data-view=\"inventory\"]').click();\n  await page.locator('#autoEquipBtn').click();\n"
insert = "  await page.locator('.nav-toggle[data-view=\"inventory\"]').click();\n  assert.equal(await page.locator('.equipment-layout > .slot-row').count(), 3, 'Inventory should keep three semantic equipment rows');\n  assert.equal(await page.locator('.equipment-slot').count(), 8, 'Inventory should render eight equipment slots around the hero');\n  const inventoryGridStyle = await page.locator('.equipment-layout').evaluate(el => getComputedStyle(el).display);\n  assert.equal(inventoryGridStyle, 'grid', 'Inventory equipment layout must be a real CSS grid');\n  const heroBox = await page.locator('.equipment-layout .hero-center').boundingBox();\n  assert.ok(heroBox && heroBox.width > 0 && heroBox.height > 0, 'Inventory hero cell must have a stable box');\n  const overlapCount = await page.locator('.equipment-slot').evaluateAll((slots, hero) => {\n    const h = hero.getBoundingClientRect();\n    return slots.filter(slot => {\n      const r = slot.getBoundingClientRect();\n      const x = Math.max(0, Math.min(r.right, h.right) - Math.max(r.left, h.left));\n      const y = Math.max(0, Math.min(r.bottom, h.bottom) - Math.max(r.top, h.top));\n      return x * y > 2;\n    }).length;\n  }, await page.locator('.equipment-layout .hero-center').elementHandle());\n  assert.equal(overlapCount, 0, 'Inventory hero must not overlap equipment slots');\n  await page.locator('#autoEquipBtn').click();\n"
if anchor not in smoke:
    raise SystemExit('inventory browser-smoke anchor missing')
smoke = smoke.replace(anchor, insert, 1)
smoke_path.write_text(smoke, encoding='utf-8')

print('patched inventory into stable 3x3 loadout grid')
