# Shortcut Quest 2026 — TK2 A8

This folder contains the isolated TK2 2026 edition of Shortcut Quest.

- `PLAN.md` is the implementation checklist and didactic authority for this pass.
- `sections-data.js` contains the curated 30-section learning path.
- The RPG/meta loop remains based on the existing Shortcut Quest implementation: coins, shop, inventory/equipment, skills, 11 battles and report.
- Memory content is intentionally excluded because TK2 A7 already contains Memory.
- Workflow Chains are the new transfer mechanic: students solve real multi-step workflows by ordering complete shortcuts.
- Sections 1–10 form the initially open training hall; first clears then unlock sections 11–30 sequentially.
- Battle 1 is immediately available. Each three mastered sections permit the next battle rank, but the previous enemy must also be cleared.
- The save is isolated as `shortcutRitter_2026_v1`; it does not overwrite the legacy root save.
- Typed shortcuts accept both compact and naturally spaced input such as `Ctrl+C` and `Ctrl + C`.
- `qa/browser-smoke.mjs` is the real Chromium E2E gate. It covers normal grading, DnD, Workflow Chains, shop/equipment, skills, battle gating, persistence, all 30 renderers and mobile layout.
- `.github/workflows/tk2-2026-qa.yml` runs static invariants plus the Chromium smoke on changes to the 2026 edition.

The root Shortcut Quest version remains preserved. Vercel automatic deployment stays disabled while this branch is under review.
