import fs from 'node:fs';
import vm from 'node:vm';

function createSandbox() {
  const sandbox = {};
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  return sandbox;
}

function runFile(path, sandbox) {
  const code = fs.readFileSync(path, 'utf8');
  vm.runInContext(code, sandbox, { filename: path });
}

function loadBlueprints(path) {
  const sandbox = createSandbox();
  runFile(path, sandbox);
  const sections = sandbox.LEARN_SECTION_BLUEPRINTS;
  if (!Array.isArray(sections)) throw new Error(`${path}: LEARN_SECTION_BLUEPRINTS missing`);
  return sections;
}

function load2026RuntimeBlueprints() {
  const sandbox = createSandbox();
  runFile('2026/sections-data.js', sandbox);
  runFile('2026/skill-hotkeys.js', sandbox);
  const sections = sandbox.LEARN_SECTION_BLUEPRINTS;
  if (!Array.isArray(sections)) throw new Error('2026 runtime: LEARN_SECTION_BLUEPRINTS missing');
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

const legacySections = loadBlueprints('sections-data.js');
const source2026Sections = loadBlueprints('2026/sections-data.js');
const runtime2026Sections = load2026RuntimeBlueprints();
const legacy = summarize('legacy-root', legacySections);
const source2026 = summarize('tk2-2026-source', source2026Sections);
const current = summarize('tk2-2026-runtime', runtime2026Sections);

const runtime = fs.readFileSync('2026/skill-hotkeys.js', 'utf8');
const scaleMatch = runtime.match(/const\s+REWARD_SCALE_2026\s*=\s*([0-9.]+)/);
if (!scaleMatch) throw new Error('REWARD_SCALE_2026 missing from 2026 runtime');
const rewardScale = Number(scaleMatch[1]);
if (!Number.isFinite(rewardScale) || rewardScale <= 0) throw new Error(`Invalid REWARD_SCALE_2026: ${scaleMatch[1]}`);

const sectionEconomy = runtime2026Sections.map(section => {
  const units = rewardUnits(section);
  return {
    id: String(section.id),
    units,
    firstClearCoins: Math.round(units * 10 * rewardScale)
  };
});
const adjusted2026Coins = sectionEconomy.reduce((sum, section) => sum + section.firstClearCoins, 0);
const parityMultiplier = current.units > 0 ? legacy.units / current.units : 1;
const parityDelta = legacy.firstClearCoinsAt10 > 0
  ? Math.abs(adjusted2026Coins - legacy.firstClearCoinsAt10) / legacy.firstClearCoinsAt10
  : 0;

if (current.sections !== 30) throw new Error(`Expected 30 runtime sections, got ${current.sections}`);
if (current.units !== 282) throw new Error(`Expected 282 runtime reward units, got ${current.units}`);
if (adjusted2026Coins !== 3274) throw new Error(`Expected 3274 first-perfect runtime coins, got ${adjusted2026Coins}`);
if (parityDelta > 0.03) {
  throw new Error(`2026 first-clear economy is not within 3% of legacy: legacy=${legacy.firstClearCoinsAt10}, adjusted=${adjusted2026Coins}`);
}
if (!runtime.includes('equipmentCoinBonus: false')) throw new Error('2026 economy must explicitly disable equipment coin bonuses');
if (!runtime.includes('runenAmuletEffect: "+1 DEF per tier"')) throw new Error('Runen-Amulett 2026 combat effect contract missing');

console.log(JSON.stringify({ legacy, source2026, current, parityMultiplier, rewardScale, adjusted2026Coins, parityDelta, sectionEconomy }, null, 2));
console.log(`ECONOMY OK: runtime=${current.units} units, first-perfect=${adjusted2026Coins} coins, legacy=${legacy.firstClearCoinsAt10}, delta=${(parityDelta * 100).toFixed(2)}%, no equipment coin bonus.`);
