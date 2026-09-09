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
const runtime = fs.readFileSync('2026/skill-hotkeys.js', 'utf8');
const scaleMatch = runtime.match(/const\s+REWARD_SCALE_2026\s*=\s*([0-9.]+)/);
if (!scaleMatch) throw new Error('REWARD_SCALE_2026 missing from 2026 runtime');
const rewardScale = Number(scaleMatch[1]);
if (!Number.isFinite(rewardScale) || rewardScale <= 0) throw new Error(`Invalid REWARD_SCALE_2026: ${scaleMatch[1]}`);

const parityMultiplier = current.units > 0 ? legacy.units / current.units : 1;
const adjusted2026Coins = Math.round(current.firstClearCoinsAt10 * rewardScale);
const parityDelta = legacy.firstClearCoinsAt10 > 0
  ? Math.abs(adjusted2026Coins - legacy.firstClearCoinsAt10) / legacy.firstClearCoinsAt10
  : 0;

if (parityDelta > 0.03) {
  throw new Error(`2026 first-clear economy is not within 3% of legacy: legacy=${legacy.firstClearCoinsAt10}, adjusted=${adjusted2026Coins}`);
}
if (!runtime.includes('equipmentCoinBonus: false')) throw new Error('2026 economy must explicitly disable equipment coin bonuses');
if (!runtime.includes('runenAmuletEffect: "+1 DEF per tier"')) throw new Error('Runen-Amulett 2026 combat effect contract missing');

console.log(JSON.stringify({ legacy, current, parityMultiplier, rewardScale, adjusted2026Coins, parityDelta }, null, 2));
console.log(`ECONOMY OK: legacy=${legacy.firstClearCoinsAt10} coins, 2026 adjusted=${adjusted2026Coins}, delta=${(parityDelta * 100).toFixed(2)}%, no equipment coin bonus.`);
