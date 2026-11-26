// Costs scene: a generic cost-optimization waterfall. Bars are sized from the
// internal values below; no amounts, percentages or axis values are rendered.

import { applyTranslations, onLangChange, t } from '../i18n.js';
import { createRunner, svg, clamp, easeOutCubic } from '../util.js';

// Internal values only (never shown).
const BASELINE = 16000;
const STEPS = [
  { key: 'costs.step1', delta: 5000 },
  { key: 'costs.step2', delta: 600 },
  { key: 'costs.step3', delta: 500 },
  { key: 'costs.step4', delta: 100 },
];
const FINAL = BASELINE - STEPS.reduce((sum, s) => sum + s.delta, 0);

// Chart geometry (SVG user units).
const W = 360;
const H = 236;
const COL = W / (STEPS.length + 2);
const BAR_W = 38;
const TOP = 20;
const BOTTOM = 190;
const SCALE = (BOTTOM - TOP) / BASELINE;
const MIN_STEP_H = 5; // keeps the thinnest steps perceptible
const DURATION = 5200;

// Timeline slots as fractions of DURATION: [start, length] per bar.
const SLOTS = [[0, 0.18], [0.2, 0.14], [0.36, 0.14], [0.52, 0.14], [0.68, 0.14], [0.84, 0.16]];

// Bars: baseline, one per step, optimized result.
function layout() {
  const bars = [];
  let cursor = BOTTOM - BASELINE * SCALE;
  bars.push({ kind: 'base', key: 'costs.baseline', top: cursor, bottom: BOTTOM });
  STEPS.forEach((s) => {
    const top = cursor;
    const bottom = top + Math.max(s.delta * SCALE, MIN_STEP_H);
    bars.push({ kind: 'step', key: s.key, top, bottom });
    cursor = bottom;
  });
  bars.push({ kind: 'final', key: 'costs.final', top: cursor, bottom: BOTTOM });
  return bars.map((b, i) => ({ ...b, cx: COL * (i + 0.5) }));
}

const TEMPLATE = `
  <div class="costs">
    <header class="scene__head">
      <h3 data-i18n="costs.title">Cost optimization across the stack</h3>
      <p data-i18n="costs.sub">Starting from the initial cost, each optimization lowers the monthly total.</p>
    </header>
    <svg class="costs__svg" data-role="chart" viewBox="0 0 ${W} ${H}" role="img" data-i18n-aria="costs.chartAlt" aria-label="Cost waterfall chart"></svg>
    <p class="costs__note" data-i18n="costs.note">Illustrative view: bar heights are proportional, figures are not shown.</p>
  </div>`;

export default function createCosts() {
  const run = createRunner();
  let root;
  let unsubLang = () => {};
  let bars = [];
  let els = [];

  function setLabel(el, key, cx) {
    el.replaceChildren();
    t(key).split('\n').forEach((line, i) => {
      const span = svg('tspan', { x: cx, y: BOTTOM + 16 + i * 13 });
      span.textContent = line;
      el.appendChild(span);
    });
  }

  function relabel() {
    els.forEach((e, i) => setLabel(e.label, bars[i].key, bars[i].cx));
  }

  function build() {
    const chart = root.querySelector('[data-role="chart"]');
    bars = layout();

    svg('line', { x1: 0, x2: W, y1: BOTTOM + 0.5, y2: BOTTOM + 0.5, class: 'costs__axis-line' }, chart);

    // Connectors first so bars paint over their ends.
    const connectors = bars.slice(1).map((b, i) => {
      const prev = bars[i];
      const y = b.kind === 'final' ? b.top : prev.bottom;
      return svg('line', {
        x1: prev.cx + BAR_W / 2, x2: b.cx - BAR_W / 2, y1: y, y2: y, class: 'costs__link',
      }, chart);
    });

    els = bars.map((b, i) => {
      const g = svg('g', { class: `costs__bar costs__bar--${b.kind}` }, chart);
      const halo = svg('rect', {
        x: b.cx - BAR_W / 2 - 4, width: BAR_W + 8, rx: 4, class: 'costs__halo',
        y: b.top - 4, height: b.bottom - b.top + 8,
      }, g);
      const rect = svg('rect', { x: b.cx - BAR_W / 2, width: BAR_W, rx: 3, class: 'costs__rect', y: b.top, height: 0 }, g);
      const label = svg('text', { class: 'costs__label', 'text-anchor': 'middle' }, g);
      return { g, halo, rect, label, link: connectors[i - 1] ?? null };
    });
    relabel();
  }

  function setProgress(p) {
    els.forEach((e, i) => {
      const b = bars[i];
      const [start, len] = SLOTS[i];
      const local = clamp((p - start) / len, 0, 1);
      const grow = easeOutCubic(local);
      const h = (b.bottom - b.top) * grow;

      // Baseline and result grow up from the axis; steps drop down from the previous level.
      e.rect.setAttribute('y', b.kind === 'step' ? b.top : b.bottom - h);
      e.rect.setAttribute('height', h);
      e.label.style.opacity = clamp((local - 0.3) / 0.4, 0, 1);
      if (e.link) e.link.style.opacity = clamp(local * 4, 0, 1);

      // Pulse on each step so thin reductions stay noticeable.
      const pulse = b.kind === 'step' && local > 0 && local < 1 ? Math.sin(local * Math.PI) : 0;
      e.halo.style.opacity = pulse;
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
