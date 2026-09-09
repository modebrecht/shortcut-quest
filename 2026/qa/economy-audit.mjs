import fs from 'node:fs';
import vm from 'node:vm';

function loadBlueprints(path) {
  const code = fs.readFileSync(path, 'utf8');
  const sandbox = {};
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: path });
  const sections = sandbox.LEARN_SECTION_BLUEPRINTS;
  if (!Array.isArray(sections)) throw new Error(`${path}: LEARN_SECTION_BLUEPRINTS missing`);
  return sections;
}

function rewardUnits(section) {
  let units = 0;
  if (section?.fastPaced) units += Number(section.fastPaced.rounds || 0);
  if (section?.comboBuilder?.combos) {
    for (const combo of section.comboBuilder.combos) units += Array.isArray(combo.answers) ? combo.answers.length : 0;
  }
  if (section?.narrative?.entries) {
    for (const entry of section.narrative.entries) units += Number(entry.missingSlots || (Array.isArray(entry.answers) ? entry.answers.length : 0));
  }
  if (Array.isArray(section?.tasks)) {
    for (const task of section.tasks) {
      if (!task) continue;
      if (task.type === 'dnd') units += Array.isArray(task.targets) ? task.targets.length : 0;
      else if (task.type === 'input' || task.type === 'select') units += 1;
    }
  }
  return units;
}

function summarize(label, sections) {
  const units = sections.reduce((sum, section) => sum + rewardUnits(section), 0);
  const memorySections = sections.filter(section => section?.memoryGame).length;
  const fastSections = sections.filter(section => section?.fastPaced).length;
  return { label, sections: sections.length, units, firstClearCoinsAt10: units * 10, memorySections, fastSections };
}

const legacy = summarize('legacy-root', loadBlueprints('sections-data.js'));
const current = summarize('tk2-2026', loadBlueprints('2026/sections-data.js'));
const parityMultiplier = current.units > 0 ? legacy.units / current.units : 1;

console.log(JSON.stringify({ legacy, current, parityMultiplier }, null, 2));
console.log(`ECONOMY: legacy=${legacy.units} reward units, 2026=${current.units}, parity multiplier=${parityMultiplier.toFixed(3)}x`);
