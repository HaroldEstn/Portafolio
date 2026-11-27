// Costs scene: per-category before/after bars. Every "before" bar has the same
// full height; each "after" bar is sized from the reduction below. The
// reductions only drive bar heights and are never rendered as text.

import { applyTranslations, onLangChange, t } from '../i18n.js';
import { createRunner, svg, clamp, lerp, easeOutCubic, easeInOutCubic } from '../util.js';

// Internal values only (never shown): share removed from the "before" bar.
const CATEGORIES = [
  { key: 'costs.cat1', reduction: 0.8 },
  { key: 'costs.cat2', reduction: 0.1 },
  { key: 'costs.cat3', reduction: 0.6 },
  { key: 'costs.cat4', reduction: 0.65 },
];

// Chart geometry (SVG user units).
const W = 320;
const H = 214;
const COL = W / CATEGORIES.length;
const BAR_W = 28;
const GAP = 4;
const TOP = 12;
const BOTTOM = 168;
const FULL = BOTTOM - TOP;
const DURATION = 5400;

// Timeline as fractions of DURATION: before bars grow together, then each
// after bar drops in sequence.
const GROW_LEN = 0.22;
const GROW_STAGGER = 0.04;
const DROP_START = 0.3;
const DROP_STEP = 0.16;
const DROP_LEN = 0.18;

const TEMPLATE = `
  <div class="costs">
    <header class="scene__head">
      <h3 data-i18n="costs.title">Cost optimization across the stack</h3>
      <p data-i18n="costs.sub">Each category compared before and after optimization.</p>
    </header>
    <svg class="costs__svg" data-role="chart" viewBox="0 0 ${W} ${H}" role="img" data-i18n-aria="costs.chartAlt" aria-label="Grouped bars comparing cost before and after optimization in four categories."></svg>
    <ul class="costs__legend">
      <li><span class="costs__swatch costs__swatch--before" aria-hidden="true"></span><span data-i18n="costs.before">Before</span></li>
      <li><span class="costs__swatch costs__swatch--after" aria-hidden="true"></span><span data-i18n="costs.after">After</span></li>
    </ul>
    <p class="costs__note" data-i18n="costs.note">Illustrative view: bar heights are proportional to each reduction, figures are not shown.</p>
  </div>`;

export default function createCosts() {
  const run = createRunner();
  let root;
  let unsubLang = () => {};
  let els = [];

  function relabel() {
    els.forEach((e, i) => {
      e.label.replaceChildren();
      t(CATEGORIES[i].key).split('\n').forEach((line, row) => {
        const span = svg('tspan', { x: COL * (i + 0.5), y: BOTTOM + 17 + row * 14 });
        span.textContent = line;
        e.label.appendChild(span);
      });
    });
  }

  function build() {
    const chart = root.querySelector('[data-role="chart"]');
    svg('line', { x1: 0, x2: W, y1: BOTTOM + 0.5, y2: BOTTOM + 0.5, class: 'costs__axis-line' }, chart);

    els = CATEGORIES.map((_, i) => {
      const cx = COL * (i + 0.5);
      const g = svg('g', { class: 'costs__group' }, chart);
      const bx = cx - GAP / 2 - BAR_W;
      const ax = cx + GAP / 2;
      const before = svg('rect', { x: bx, width: BAR_W, rx: 3, class: 'costs__rect costs__rect--before', y: BOTTOM, height: 0 }, g);
      const saved = svg('rect', { x: ax, width: BAR_W, rx: 3, class: 'costs__saved', y: BOTTOM, height: 0 }, g);
      const after = svg('rect', { x: ax, width: BAR_W, rx: 3, class: 'costs__rect costs__rect--after', y: BOTTOM, height: 0 }, g);
      const label = svg('text', { class: 'costs__label', 'text-anchor': 'middle' }, g);
      return { before, saved, after, label };
    });
    relabel();
  }

  function setProgress(p) {
    els.forEach((e, i) => {
      const grow = easeOutCubic(clamp((p - i * GROW_STAGGER) / GROW_LEN, 0, 1));
      const drop = clamp((p - (DROP_START + i * DROP_STEP)) / DROP_LEN, 0, 1);
      const beforeH = FULL * grow;
      const afterH = beforeH * (1 - CATEGORIES[i].reduction * easeInOutCubic(drop));

      e.before.setAttribute('y', BOTTOM - beforeH);
      e.before.setAttribute('height', beforeH);
      e.after.setAttribute('y', BOTTOM - afterH);
      e.after.setAttribute('height', afterH);

      // The removed part sits above the after bar and fades out as it drops.
      e.saved.setAttribute('y', BOTTOM - beforeH);
      e.saved.setAttribute('height', beforeH - afterH);
      e.saved.style.opacity = drop > 0 ? lerp(0.85, 0.2, easeOutCubic(drop)) : 0;

      e.label.style.opacity = clamp((grow - 0.4) / 0.5, 0, 1);
    });
  }

  return {
    mount(el) {
      root = el;
      el.innerHTML = TEMPLATE;
      build();
      applyTranslations(el);
      setProgress(0);
      unsubLang = onLangChange(() => relabel());
    },

    play() {
      this.reset();
      run.tween(DURATION, setProgress);
    },

    reset() {
      run.cancel();
      if (root) setProgress(0);
    },

    destroy() {
      run.cancel();
      unsubLang();
      root?.replaceChildren();
    },
  };
}
