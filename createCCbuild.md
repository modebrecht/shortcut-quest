## CC Build Process

1. Copied `index.html` into `cc/index.html` to give the customized variant the exact same baseline markup, styles, and scripts as the main root build, ensuring every existing component continues to work without additional wiring.
2. Added the color chooser UI block in `cc/index.html` right after the report view so it sits on top of every screen. The toggle + close button slide the panel in from the right to keep it unobtrusive.
3. Extracted all color picker styles into the standalone stylesheet `cc/color-chooser.css`, then linked it from the `<head>` of `cc/index.html` so that the CC flavor stays plug-and-play.
4. Built the JavaScript controller in `cc/color-chooser.js`:
   - Persists custom colors to `localStorage`.
   - Updates the shared CSS variables (`--good`, `--bad`, and their soft variants) so task fields, reports, and any other element that reads those values stay in sync.
   - Notifies ApexCharts via `updateReportStatusColors` to refresh scatter/bar series colors.
5. Hooked the report render helpers in `cc/index.html` to consume the current palette via `getReportStatusColors`, guaranteeing that charts render with the configured red/green pair even after reload.

## Keeping CC in Sync with Root

Whenever `index.html` (root) changes:

1. Copy the updated root file over the CC version: `cp index.html cc/index.html`.
2. Re-apply the CC-specific hooks:
   - Ensure the `<head>` still links `color-chooser.css`.
   - Add the redirect guard to force `/cc` → `/cc/` so relative assets load on Vercel:
     ```html
     <script>
       (function enforceTrailingSlash() {
         const path = window.location.pathname;
         if (path === "/cc") {
           const search = window.location.search || "";
           const hash = window.location.hash || "";
           window.location.replace("/cc/" + search + hash);
         }
       })();
     </script>
     ```
   - Re-insert the color chooser markup block (place it directly inside `<body>` before the main layout begins) if the copy step overwrote it.
   - Update static asset/script paths so they reference the parent directory (e.g. change `href="favicon.svg"` → `href="../favicon.svg"` and `src="assets/...` → `src="../assets/...`) since the CC build lives under `cc/`.
   - Re-add `window.activeReportCharts = activeReportCharts;` after the `const activeReportCharts = []` declaration so the color chooser script can reach the chart instances.
   - Confirm the `<script src="color-chooser.js"></script>` tag remains at the bottom of the body.
3. Re-test the drawer and color swapping to confirm custom behavior still works with the latest upstream HTML.

Because all bespoke logic lives in `cc/color-chooser.css` and `cc/color-chooser.js`, most merges only require re-adding the handful of hooks described above. Using `git diff index.html cc/index.html` after copying can help confirm only the intentional differences remain.

### Copy Ready Snippets

**Head include**
```html
<link rel="stylesheet" href="color-chooser.css">
```

**Asset path adjustment**
```html
<link rel="icon" type="image/svg+xml" href="../favicon.svg">
<script src="../apexcharts.min.js"></script>
<script src="../sections-data.js"></script>
<script src="../skill-hotkeys.js"></script>
<!-- Replace every "assets/…" reference with "../assets/…" as well -->
```

**Color chooser markup**
Place this immediately after the opening `<body>` tag so it can overlay every view regardless of scroll position.
```html
    <div class="color-chooser" id="colorChooser" aria-live="polite">
      <button type="button" class="color-chooser-toggle" id="colorChooserToggle" aria-expanded="false">🎨 Choose Color</button>
      <div class="color-chooser-panel" role="group" aria-label="Farbwähler">
        <div class="color-chooser-header">
          <span>Color Chooser</span>
          <button type="button" class="color-chooser-close" id="colorChooserClose" aria-label="Farbwähler schließen">&times;</button>
        </div>
        <div class="color-chooser-options">
          <label class="color-option" for="colorChooserCorrect">
            <strong>Correct</strong>
            <input type="color" id="colorChooserCorrect" value="#22c55e">
          </label>
          <label class="color-option" for="colorChooserIncorrect">
            <strong>Incorrect</strong>
            <input type="color" id="colorChooserIncorrect" value="#f87171">
          </label>
        </div>
      </div>
    </div>
```

**Chart color usage**
```js
const [goodColor, badColor] = getReportStatusColors();
// ...
colors: [goodColor, badColor],
```

**Expose chart array**
```js
const activeReportCharts = [];
window.activeReportCharts = activeReportCharts;
```

**Footer include**
```html
<script src="color-chooser.js"></script>
```
